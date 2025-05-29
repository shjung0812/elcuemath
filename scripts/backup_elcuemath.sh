#!/bin/bash
#set -x # 디버깅을 위해 이 줄의 주석을 해제하세요.

# --- 전역 변수 선언 ---
# .env 파일 로드 경로
script_dir=$(dirname "$(readlink -f "$0")")
env_file_path=$(dirname "$script_dir")/.env

# MySQL 설정 (환경 변수 우선, .env 파일에서 로드됨)
DB_USER=""
DB_PASSWORD=""
DB_NAME=""
DB_HOST="localhost"

# 프로젝트 설정
PROJECT_DIR="" # 백업할 프로젝트 폴더 전체 경로

# 백업 설정
BACKUP_DIR="" # 백업 파일을 저장할 디렉토리 (중요: 프로젝트 외부!)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S") # 백업 파일에 사용할 시간 정보 (YYYYMMDD_HHMMSS 형식)
RETENTION_COUNT=14 # 유지할 최근 백업 개수

# --- 함수 정의 ---

# .env 파일에서 환경 변수를 로드하는 함수
load_env_vars() {
  echo "환경 변수 로드 중..."
  if [ -f "$env_file_path" ]; then
    while IFS='=' read -r key value; do
      # 공백 제거 및 export (환경 변수 충돌 방지)
      key=$(echo "$key" | xargs)
      value=$(echo "$value" | xargs)
      # 주석 처리된 줄이나 빈 줄은 건너뛰기
      [[ "$key" =~ ^#.* || -z "$key" ]] && continue
      export "$key"="$value"
    done < "$env_file_path"
    echo ".env 파일 로드 완료."
  else
    echo "경고: .env 파일이 존재하지 않습니다: $env_file_path"
    echo "기본값 또는 수동으로 설정된 변수들이 사용됩니다."
  fi

  # 환경 변수가 로드된 후 전역 변수 설정
  USER_ID="${USER_ID:-$(whoami)}" # USER_ID가 .env에 없으면 현재 사용자명 사용
  DB_USER="${DB_USER}"
  DB_PASSWORD="${DB_PASSWORD}"
  DB_NAME="${DB_NAME}"
  DB_HOST="${DB_HOST:-localhost}"
  PROJECT_DIR="${PROJECT_DIR:-/home/$USER_ID/web/elcuemath}"
  BACKUP_DIR="${BACKUP_DIR:-/home/$USER_ID/web/backup}"
  RETENTION_COUNT="${RETENTION_COUNT:-14}" # 기본값 14
}

# 백업 디렉토리를 확인하고 필요한 경우 생성하는 함수
check_and_create_backup_dir() {
  echo "백업 디렉토리 확인 및 생성: $BACKUP_DIR"
  if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    if [ $? -eq 0 ]; then
      # 백업 디렉토리 권한 설정 (스크립트를 실행하는 사용자만 접근 가능하도록)
      chmod 700 "$BACKUP_DIR"
      chown "$USER_ID":"$USER_ID" "$BACKUP_DIR" # 설정된 USER_ID로 소유자 변경
      echo "백업 디렉토리 '$BACKUP_DIR' 생성 및 권한 설정 완료."
    else
      echo "오류: 백업 디렉토리 '$BACKUP_DIR' 생성 실패. 권한을 확인하세요."
      exit 1
    fi
  else
    echo "백업 디렉토리 '$BACKUP_DIR'가 이미 존재합니다."
  fi
}

# MySQL 데이터베이스를 덤프하는 함수
dump_mysql_database() {
  echo "MySQL 덤프 생성 중..."
  # GTID 및 일관성 경고를 해결하기 위한 옵션 추가
  # --master-data를 --source-data로 변경 (MySQL 8.0.20+ 권장)
  # --no-tablespaces 유지
  local DUMP_OPTIONS="--single-transaction --set-gtid-purged=OFF --source-data=2 --no-tablespaces"

  if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
    echo "오류: DB_USER 또는 DB_NAME이 설정되지 않았습니다. MySQL 덤프를 건너뜝니다."
    return 1 # 함수 실패 반환
  fi

  # DB_PASSWORD 환경 변수 사용 시의 보안 경고 완화
  # 최적의 방법은 .my.cnf 파일을 사용하는 것임.
  if [ -n "$DB_PASSWORD" ]; then
    echo "DB_PASSWORD 환경 변수를 사용하여 mysqldump 실행 중..."
    # 경고를 피하기 위해 password 옵션을 -p 뒤에 붙이지 않고 사용하도록 유도
    # 하지만 현재 스크립트 구조상 명령줄에 비밀번호가 노출되는 것은 피할 수 없음
    # 따라서 이 경고를 완전히 없애려면 .my.cnf 사용이 유일한 방법
    mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" $DUMP_OPTIONS "$DB_NAME" | gzip > "$BACKUP_DIR/mysql_dump_$TIMESTAMP.sql.gz"
  else
    echo "경고: DB_PASSWORD 환경 변수가 설정되지 않았습니다. .my.cnf 파일을 사용하거나 비밀번호를 수동으로 입력해야 합니다."
    # -p 옵션만 사용하여 비밀번호 프롬프트 표시 또는 .my.cnf 파일 사용 유도
    mysqldump -h "$DB_HOST" -u "$DB_USER" -p $DUMP_OPTIONS "$DB_NAME" | gzip > "$BACKUP_DIR/mysql_dump_$TIMESTAMP.sql.gz"
  fi

  if [ $? -eq 0 ]; then
    echo "MySQL 덤프 완료: $BACKUP_DIR/mysql_dump_$TIMESTAMP.sql.gz"
    return 0 # 함수 성공 반환
  else
    echo "오류: MySQL 덤프 중 문제가 발생했습니다. 위에 표시된 오류 메시지를 확인하세요."
    return 1 # 함수 실패 반환
  fi
}

# 프로젝트 폴더를 백업하는 함수
backup_project_folder() {
  echo "프로젝트 폴더 백업 중..."
  if [ -z "$PROJECT_DIR" ]; then
    echo "오류: PROJECT_DIR이 설정되지 않았습니다. 프로젝트 폴더 백업을 건너뜝니다."
    return 1
  fi
  if [ ! -d "$PROJECT_DIR" ]; then
    echo "오류: 프로젝트 디렉토리가 존재하지 않습니다: $PROJECT_DIR. 백업을 건너뜁니다."
    return 1
  fi

  # tar 명령어로 압축, -C 옵션으로 디렉토리 이동 후 작업 (상대 경로 문제 방지)
  # --exclude='node_modules' 옵션으로 node_modules 디렉토리 제외
  tar -czf "$BACKUP_DIR/project_backup_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR" --exclude='node_modules' .

  if [ $? -eq 0 ]; then
    echo "프로젝트 폴더 백업 완료: $BACKUP_DIR/project_backup_$TIMESTAMP.tar.gz"
    return 0
  else
    echo "오류: 프로젝트 폴더 백업 실패."
    return 1
  fi
}

# 오래된 백업 파일을 정리하는 함수
clean_old_backups() {
  echo "오래된 백업 파일 정리 중 (최신 $RETENTION_COUNT 개 유지)..."
  # 백업 디렉토리로 이동하여 작업
  cd "$BACKUP_DIR" || { echo "오류: 백업 디렉토리로 이동 실패. 정리 작업을 건너뜁니다."; return 1; }

  # MySQL 덤프 파일과 프로젝트 백업 파일을 각각 정리
  local mysql_dumps=$(ls -t mysql_dump_*.sql.gz 2>/dev/null)
  local project_backups=$(ls -t project_backup_*.tar.gz 2>/dev/null)

  # MySQL 덤프 정리
  if [ -n "$mysql_dumps" ]; then
    local files_to_delete_mysql=$(echo "$mysql_dumps" | tail -n +$((RETENTION_COUNT + 1)))
    if [ -n "$files_to_delete_mysql" ]; then
      echo "삭제 대상 MySQL 덤프 파일:"
      echo "$files_to_delete_mysql"
      echo "$files_to_delete_mysql" | xargs rm --
    else
      echo "유지 개수($RETENTION_COUNT)보다 MySQL 덤프 파일이 적어 삭제할 파일이 없습니다."
    fi
  fi

  # 프로젝트 백업 정리
  if [ -n "$project_backups" ]; then
    local files_to_delete_project=$(echo "$project_backups" | tail -n +$((RETENTION_COUNT + 1)))
    if [ -n "$files_to_delete_project" ]; then
      echo "삭제 대상 프로젝트 백업 파일:"
      echo "$files_to_delete_project"
      echo "$files_to_delete_project" | xargs rm --
    else
      echo "유지 개수($RETENTION_COUNT)보다 프로젝트 백업 파일이 적어 삭제할 파일이 없습니다."
    fi
  fi

  echo "오래된 백업 파일 정리 완료."
  return 0
}

# --- 메인 실행 흐름 ---
main() {
  echo "--- 백업 시작: $TIMESTAMP ---"

  # 1. 환경 변수 로드
  load_env_vars

  # 2. 백업 디렉토리 확인 및 생성
  check_and_create_backup_dir

  # 3. MySQL 데이터베이스 덤프
  dump_mysql_database

  # 4. 프로젝트 폴더 백업
  backup_project_folder

  # 5. 오래된 백업 파일 정리
  clean_old_backups

  echo "--- 백업 종료: $TIMESTAMP ---"
}

# 스크립트 실행
main
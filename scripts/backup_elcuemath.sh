#!/bin/bash
#set -x # 이 줄 추가

# --- 설정 변수 ---
# MySQL 설정
USER_ID="morgan"
DB_USER="shjung"         # MySQL 사용자 이름
DB_PASSWORD="" # MySQL 비밀번호 (보안 경고: 스크립트에 직접 쓰는 것은 위험)
DB_NAME="prismmath"      # 백업할 데이터베이스 이름

# 프로젝트 설정
PROJECT_DIR="/home/$USER_ID/web/elcuemath" # 백업할 프로젝트 폴더 전체 경로

# 백업 설정
BACKUP_DIR="/home/$USER_ID/web/backup" # 백업 파일을 저장할 디렉토리 (중요: 프로젝트 외부!)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")       # 백업 파일에 사용할 시간 정보 (YYYYMMDD_HHMMSS 형식)
RETENTION_COUNT=7                         # 유지할 최근 백업 개수 (예: 7개 = 7일치 백업)

# --- 스크립트 본문 ---

echo "--- 백업 시작: $TIMESTAMP ---"

# 1. 백업 디렉토리 확인 및 생성
if [ ! -d "$BACKUP_DIR" ]; then
  echo "백업 디렉토리 생성: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"
  # 백업 디렉토리 권한 설정 (스크립트를 실행하는 사용자만 접근 가능하도록 설정)
  chmod 700 "$BACKUP_DIR"
  chown $(whoami):$(whoami) "$BACKUP_DIR" # 현재 스크립트 실행 사용자로 소유자 변경
fi

# 2. MySQL 데이터베이스 덤프
echo "MySQL 덤프 생성 중..."
# mysqldump 명령에 -p 옵션 바로 뒤에 비밀번호를 붙여 사용합니다. (보안상 .my.cnf 권장)
# 또는 DB_PASSWORD 변수를 직접 사용합니다.
# 보안 강화를 위해 비밀번호를 직접 쓰지 않고 .my.cnf 파일을 사용하는 방법은 아래 설명 참조
# mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" | gzip > "$BACKUP_DIR/mysql_dump_$TIMESTAMP.sql.gz"

# .my.cnf 파일을 사용하는 안전한 방식 (권장)
# ~/.my.cnf 파일에 [mysqldump] 또는 [client] 섹션에 user=... password=... 설정
# 이 스크립트를 실행하는 사용자의 홈 디렉토리에 해당 파일이 있어야 합니다.
mysqldump -u "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/mysql_dump_$TIMESTAMP.sql.gz"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "오류: MySQL 덤프 실패"
  exit 1
fi
echo "MySQL 덤프 완료: $BACKUP_DIR/mysql_dump_$TIMESTAMP.sql.gz"

# 3. 프로젝트 폴더 백업 (node_modules 제외)
echo "프로젝트 폴더 백업 중..."
# tar 명령어로 압축, -C 옵션으로 디렉토리 이동 후 작업 (상대 경로 문제 방지)
# --exclude='node_modules' 옵션으로 node_modules 디렉토리 제외
tar -czf "$BACKUP_DIR/project_backup_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR" --exclude='node_modules' .

if [ $? -ne 0 ]; then
  echo "오류: 프로젝트 폴더 백업 실패"
  exit 1
fi
echo "프로젝트 폴더 백업 완료: $BACKUP_DIR/project_backup_$TIMESTAMP.tar.gz"


# 4. 오래된 백업 파일 삭제 (최신 N개 유지)
echo "오래된 백업 파일 정리 중 (최신 $RETENTION_COUNT 개 유지)..."
# 백업 디렉토리로 이동하여 작업
cd "$BACKUP_DIR" || { echo "오류: 백업 디렉토리로 이동 실패"; exit 1; }

# 파일 목록을 시간순(최신 순)으로 정렬하고, N+1번째 이후 파일들을 삭제
# 파일 이름에 타임스탬프가 포함되어 있으므로 ls -t 또는 ls -r로 정렬 가능
# 여기서는 ls -t (modification time) 기준으로 정렬
FILE_LIST=$(ls -t mysql_dump_*.sql.gz project_backup_*.tar.gz 2>/dev/null) # 백업 파일만 대상으로, 에러는 무시

if [ -z "$FILE_LIST" ]; then
    echo "삭제할 백업 파일이 없습니다."
else
    # ls -t 결과는 최신 파일이 먼저 나옵니다.
    # tail -n +K 는 K번째 라인부터 끝까지 출력합니다.
    # RETENTION_COUNT + 1 번째부터 시작하는 라인을 얻어서 삭제합니다.
    FILES_TO_DELETE=$(echo "$FILE_LIST" | tail -n +$((RETENTION_COUNT + 1)))

    if [ -z "$FILES_TO_DELETE" ]; then
        echo "유지 개수($RETENTION_COUNT)보다 파일이 적어 삭제할 파일이 없습니다."
    else
        echo "삭제 대상 파일:"
        echo "$FILES_TO_DELETE"
        echo "$FILES_TO_DELETE" | xargs rm --
        echo "오래된 백업 파일 정리 완료."
    fi
fi

echo "--- 백업 종료: $TIMESTAMP ---"

exit 0 # 정상 종료

#!/bin/bash

# 스크립트 실행 시 에러 발생 시 즉시 종료
set -e
# --- 변수 설정 ---
SOURCE_DIR="/home/seokhyun/Downloads"                 # 복사할 원본 서버의 폴더 경로로 변경하세요.
TARGET_DIR="/home/seokhyun/web"                       # 새로운 서버에 복사할 대상 폴더 경로로 변경하세요.
TAR_FILE="project_backup_20250531_024514.tar.gz"    # 압축 해제할 tar 파일 이름 (SOURCE_DIR 안에 있어야 함)
MYSQL_ROOT_PASSWORD="@131071vangogh@"               # MySQL root 비밀번호로 변경하세요.
MYSQL_USER="shjung"                                 # 생성할 MySQL 사용자 이름으로 변경하세요.
MYSQL_PASSWORD="@soojunglove@"                      # 생성할 MySQL 사용자 비밀번호로 변경하세요.
MYSQL_DATABASE="prismmath"                          # 생성할 MySQL 데이터베이스 이름으로 변경하세요.
MYSQL_DUMP_FILE="mysql_dump_20250531_024514.sql.gz" # 실행할 MySQL dump 파일 이름 (SOURCE_DIR 안에 있어야 함)
SFTP_USER="seokhyun"                                  # SFTP 사용자 계정
SFTP_USER_HOME="/home/$SFTP_USER"                   # SFTP 사용자 홈 디렉토리
PROJECT_DIR="elcuemath"

# --- 함수 정의 ---
check_status() {
  local message="$1"
  local command="$2"
  echo -n "$message ... "
  if $command &>/dev/null; then
    echo "완료"
    return 0 # 성공
  else
    echo "실패"
    return 1 # 실패
  fi
}
check_status() {
  local message="$1"
  local command="$2"
  echo -n "$message ... "
  if $command &>/dev/null; then
    echo "완료"
    return 0 # 성공
  else
    echo "실패"
    return 1 # 실패
  fi
}
# check_status() {
#   local message="$1"
#   local command="$2"
#   echo -n "$message ... "
#   if $command; then
#   if $command; then
#     echo "완료"
#     return 0 # 성공
#   else
#     echo "실패 (오류: $@)"
#     echo "실패 (오류: $@)"
#     return 1 # 실패
#   fi
# }

validate_directories() {
  echo "디렉토리 유효성 검사 시작..."

  # 소스 디렉토리 검사
  if [ ! -d "$SOURCE_DIR" ]; then
    echo "오류: 소스 디렉토리 '$SOURCE_DIR'이 존재하지 않거나 유효한 디렉토리가 아닙니다. 스크립트를 종료합니다."
    exit 1
  fi
  echo "소스 디렉토리 '$SOURCE_DIR'은 유효합니다."

  # 대상 디렉토리 검사 및 생성
  if [ ! -d "$TARGET_DIR" ]; then
    echo "경고: 대상 디렉토리 '$TARGET_DIR'이 존재하지 않습니다. 생성합니다."
    mkdir -p "$TARGET_DIR"
    if [ ! -d "$TARGET_DIR" ]; then
      echo "오류: 대상 디렉토리 '$TARGET_DIR' 생성 실패. 스크립트를 종료합니다."
      exit 1
    fi
    echo "대상 디렉토리 '$TARGET_DIR'을 생성했습니다."
  else
    echo "대상 디렉토리 '$TARGET_DIR'은 유효합니다."
  fi

  # 프로젝트 디렉토리 검사 및 생성 (TARGET_DIR 안에 있어야 함)
  PROJECT_FULL_PATH="$TARGET_DIR/$PROJECT_DIR"
  if [ ! -d "$PROJECT_FULL_PATH" ]; then
    echo "경고: 프로젝트 디렉토리 '$PROJECT_DIR'이 대상 디렉토리 '$TARGET_DIR' 안에 존재하지 않습니다. 생성합니다."
    mkdir -p "$PROJECT_FULL_PATH"
    if [ ! -d "$PROJECT_FULL_PATH" ]; then
      echo "오류: 프로젝트 디렉토리 '$PROJECT_DIR' 생성 실패. 스크립트를 종료합니다."
      exit 1
    fi
    echo "프로젝트 디렉토리 '$PROJECT_DIR'을 대상 디렉토리 '$TARGET_DIR' 안에 생성했습니다."
  else
    echo "프로젝트 디렉토리 '$PROJECT_DIR'은 대상 디렉토리 '$TARGET_DIR' 안에 있으며 유효합니다."
  fi

  echo "디렉토리 유효성 검사 완료."
}

validate_tar_content() {
  echo ""
  echo "TAR 파일 존재 여부 검사 시작..."
  if [ -f "$SOURCE_DIR/$TAR_FILE" ]; then
    echo "확인: TAR 파일 '$SOURCE_DIR/$TAR_FILE'이 존재합니다."
  else
    echo "경고: TAR 파일 '$SOURCE_DIR/$TAR_FILE'이 존재하지 않습니다. 프로젝트 설정 관련 작업을 건너뜁니다."
    # 필요하다면 PROJECT_DIR 변수를 기본값으로 설정하거나 다른 처리 수행
    # 예: PROJECT_DIR="my-app"
  fi
  echo "TAR 파일 존재 여부 검사 완료."
}
install_sftp() {
  echo ""
  echo "SFTP (OpenSSH Server) 설치 확인 및 시작..."

  # OpenSSH Server 설치 여부 확인 (dpkg -s 사용)
  if dpkg -s openssh-server &>/dev/null; then
  if dpkg -s openssh-server &>/dev/null; then
    echo "OpenSSH Server가 이미 설치되어 있습니다. 설치 단계를 건너뜁니다."
  else
    echo "OpenSSH Server가 설치되어 있지 않습니다. 설치를 진행합니다..."
    sudo apt-get update
    if ! check_status "SFTP 패키지 업데이트" "sudo apt-get update"; then
      echo "SFTP 패키지 업데이트 실패. 스크립트 종료."
      exit 1
    fi
    sudo apt-get install -y openssh-server
    if dpkg -s openssh-server &>/dev/null; then
    if dpkg -s openssh-server &>/dev/null; then
      echo "SFTP (OpenSSH Server) 설치 완료."
    else
      echo "SFTP (OpenSSH Server) 설치 실패. 스크립트 종료."
      exit 1
    fi
  fi

  # SFTP 사용자 생성 (필요한 경우)
  if ! id -u "$SFTP_USER" &>/dev/null; then
  if ! id -u "$SFTP_USER" &>/dev/null; then
    echo "SFTP 사용자 '$SFTP_USER' 생성..."
    sudo useradd -m -d "$SFTP_USER_HOME" -s /sbin/nologin "$SFTP_USER"
    if check_status "SFTP 사용자 생성" "id -u "$SFTP_USER""; then
      echo "SFTP 사용자 '$SFTP_USER' 생성 완료."
    else
      echo "SFTP 사용자 '$SFTP_USER' 생성 실패. 스크립트 종료."
      exit 1
    fi
  else
    echo "SFTP 사용자 '$SFTP_USER'가 이미 존재합니다. 건너뜁니다."
  fi

  # # SFTP Chroot 설정
  # echo "SFTP Chroot 설정 시작..."
  # sudo mkdir -p /var/sftp
  # sudo chown root:root /var/sftp
  # sudo chmod 755 /var/sftp

  #   # /etc/ssh/sshd_config 파일 수정
  #   sudo sed -i 's/Subsystem\s\s\s\ssftp\s\s\s\s\/usr\/lib\/openssh\/sftp-server/Subsystem\s\s\s\ssftp\s\s\s\sinternal-sftp/g' /etc/ssh/sshd_config
  #   sudo sed -i '$a\
  # Match User '$SFTP_USER'\n\
  #     ChrootDirectory /var/sftp\n\
  #     ForceCommand internal-sftp\n\
  #     AllowTcpForwarding no\n\
  #     X11Forwarding no\n\
  # ' /etc/ssh/sshd_config
  #   # /etc/ssh/sshd_config 파일 수정
  #   sudo sed -i 's/Subsystem\s\s\s\ssftp\s\s\s\s\/usr\/lib\/openssh\/sftp-server/Subsystem\s\s\s\ssftp\s\s\s\sinternal-sftp/g' /etc/ssh/sshd_config
  #   sudo sed -i '$a\
  # Match User '$SFTP_USER'\n\
  #     ChrootDirectory /var/sftp\n\
  #     ForceCommand internal-sftp\n\
  #     AllowTcpForwarding no\n\
  #     X11Forwarding no\n\
  # ' /etc/ssh/sshd_config

  # sshd 서비스 재시작 (실행 중인지 확인 후 조건부 실행)
  echo "sshd 서비스 상태 확인..."
  if pgrep -x sshd >/dev/null; then
  if pgrep -x sshd >/dev/null; then
    echo "sshd 서비스가 실행 중입니다. 재시작을 건너뜁니다."
    echo "SFTP Chroot 설정 완료 (sshd 재시작 필요 없음)."
  else
    echo "sshd 서비스가 실행 중이지 않습니다. 재시작을 시도합니다..."
    SSH_SERVICE_NAME=$(systemctl list-unit-files | grep "^sshd" | awk '{print $1}')
    if [ -n "$SSH_SERVICE_NAME" ]; then
      sudo systemctl restart "$SSH_SERVICE_NAME"
      if check_status "sshd 서비스 재시작" "systemctl status "$SSH_SERVICE_NAME" | grep -q 'active (running)'"; then
        echo "SFTP Chroot 설정 및 sshd 서비스 재시작 완료."
      else
        echo "SFTP Chroot 설정 실패 또는 sshd 서비스 재시작 실패. 스크립트 종료."
        exit 1
      fi
    else
      echo "sshd 서비스 이름을 찾을 수 없습니다. 수동으로 확인하고 재시작해야 합니다. 스크립트 종료."
      exit 1
    fi
  fi
}
install_nodejs() {
  echo ""
  echo "Node.js 22 설치 시작..."

  # 기존 Node.js 및 npm 제거 (안전한 재설치를 위해)
  if command -v node &>/dev/null || command -v npm &>/dev/null; then
    echo "기존 Node.js 또는 npm이 감지되었습니다. 제거를 시도합니다."
    sudo apt purge nodejs npm -y 2>/dev/null || true # 오류 발생해도 스크립트 중단 안 함
    sudo apt autoremove -y 2>/dev/null || true
    echo "기존 Node.js 및 npm 제거 시도 완료."

    # 기존 NodeSource PPA 설정 파일 제거 (클린 설치를 위해)
    echo "기존 NodeSource PPA 설정 파일을 제거합니다..."
    sudo rm -f /etc/apt/sources.list.d/nodesource.list* 2>/dev/null || true
    sudo rm -f /etc/apt/sources.list.d/node_*.list* 2>/dev/null || true
    sudo apt update # PPA 제거 후 업데이트
    echo "기존 PPA 설정 파일 제거 및 APT 업데이트 완료."
  else
    echo "기존 Node.js 및 npm이 감지되지 않았습니다. 새로 설치를 진행합니다."
  fi


  # NodeSource PPA를 사용하여 Node.js 22.x 저장소 추가
  echo "Node.js 22 LTS 저장소를 추가합니다..."
  # setup_22.x 스크립트는 Node.js와 npm을 함께 설치하도록 설계되어 있습니다.
  if ! curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -; then
    echo "오류: Node.js 22 LTS 저장소 추가에 실패했습니다. 인터넷 연결 또는 권한을 확인하세요."
    exit 1
  fi

  # APT 패키지 목록 업데이트
  echo "APT 패키지 목록을 업데이트합니다..."
  if ! sudo apt-get update; then
    echo "오류: 패키지 목록 업데이트에 실패했습니다. 인터넷 연결 또는 저장소 문제를 확인하세요."
    exit 1
  fi

  # Node.js 22 설치
  # 이 명령은 일반적으로 npm도 함께 설치합니다.
  echo "Node.js 22 및 npm을 설치합니다..."
  if ! sudo apt-get install -y nodejs; then
    echo "오류: Node.js 22 설치에 실패했습니다. 잠시 후 다시 시도하거나 로그를 확인하세요."
    exit 1
  fi

  # npm이 Node.js 설치와 함께 설치되었는지 확인
  if command -v npm &>/dev/null; then
    echo "npm이 Node.js 설치와 함께 성공적으로 설치되었습니다."
  else
    echo "경고: npm이 Node.js 설치와 함께 설치되지 않은 것 같습니다. 별도로 설치를 시도합니다."
    # npm을 명시적으로 설치 (일반적으로 nodejs 패키지에 포함되어 있지만, 만약을 위해)
    if ! sudo apt-get install -y npm; then
      echo "오류: npm 명시적 설치에도 실패했습니다. 수동 확인이 필요합니다."
      exit 1
    fi
    echo "npm이 성공적으로 명시적으로 설치되었습니다."
  fi

  # 최종 설치 확인
  echo "최종 Node.js 및 npm 버전 확인:"
  if command -v node &>/dev/null && command -v npm &>/dev/null; then
    echo "Node.js 버전: $(node -v)"
    echo "npm 버전: $(npm -v)"
    echo "Node.js 22 및 npm 설치가 완료되었습니다."
  else
    echo "오류: Node.js 또는 npm 중 하나 이상이 제대로 설치되지 않았습니다. 수동 확인이 필요합니다."
    exit 1
  fi
}
install_mysql() {
  echo ""
  echo "MySQL 설치 시작..."
  if check_status "MySQL 설치 확인" "command -v mysql"; then
    echo "MySQL이 이미 설치되어 있습니다."
  else
    echo "MySQL 서버 설치 중..."
    # auth_socket 인증 방식을 선호하므로 root 비밀번호 설정을 위한 debconf-set-selections 제거
    # 또는 최소한 이 부분에서 사용자 입력 비밀번호를 사용하지 않음
    # sudo apt-get install -y mysql-server --fix-missing # --fix-missing 추가하여 패키지 누락 오류 방지
    sudo apt-get update # apt update 먼저 실행
    echo "MySQL 서버 설치 중..."
    # auth_socket 인증 방식을 선호하므로 root 비밀번호 설정을 위한 debconf-set-selections 제거
    # 또는 최소한 이 부분에서 사용자 입력 비밀번호를 사용하지 않음
    # sudo apt-get install -y mysql-server --fix-missing # --fix-missing 추가하여 패키지 누락 오류 방지
    sudo apt-get update # apt update 먼저 실행
    sudo apt-get install -y mysql-server


    if ! check_status "MySQL 설치" "command -v mysql"; then
      echo "MySQL 설치 실패. 스크립트 종료."
      exit 1
    fi
    echo "MySQL 설치 완료."
  fi

  create_database_and_user() {
    echo "데이터베이스 '$MYSQL_DATABASE' 및 사용자 '$MYSQL_USER' 설정 시작..."

    # MYSQL_PWD 환경 변수에 비밀번호 설정
    # 이 변수는 mysql 클라이언트가 비밀번호를 자동으로 사용하도록 합니다.
    export MYSQL_PWD=$MYSQL_ROOT_PASSWORD

    local SQL_QUERIES="
    CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
    CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_USER_PASSWORD}';
    GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'localhost';
    FLUSH PRIVILEGES;
  "

    echo "SQL 쿼리 실행 중..."
    # sudo -E 옵션을 사용하여 현재 환경 변수(MYSQL_PWD)를 유지한 채 mysql 명령 실행
    if sudo -E mysql -u root -B -N -e "$SQL_QUERIES"; then
      echo "데이터베이스 '$MYSQL_DATABASE' 및 사용자 '$MYSQL_USER' 생성 및 권한 설정 완료."
  create_database_and_user() {
    echo "데이터베이스 '$MYSQL_DATABASE' 및 사용자 '$MYSQL_USER' 설정 시작..."

    # MYSQL_PWD 환경 변수에 비밀번호 설정
    # 이 변수는 mysql 클라이언트가 비밀번호를 자동으로 사용하도록 합니다.
    export MYSQL_PWD=$MYSQL_ROOT_PASSWORD

    local SQL_QUERIES="
    CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
    CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_USER_PASSWORD}';
    GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'localhost';
    FLUSH PRIVILEGES;
  "

    echo "SQL 쿼리 실행 중..."
    # sudo -E 옵션을 사용하여 현재 환경 변수(MYSQL_PWD)를 유지한 채 mysql 명령 실행
    if sudo -E mysql -u root -B -N -e "$SQL_QUERIES"; then
      echo "데이터베이스 '$MYSQL_DATABASE' 및 사용자 '$MYSQL_USER' 생성 및 권한 설정 완료."
      return 0
    else
      echo "오류: 데이터베이스 및 사용자 설정 실패. 비밀번호 확인 또는 권한 문제일 수 있습니다."
      echo "오류: 데이터베이스 및 사용자 설정 실패. 비밀번호 확인 또는 권한 문제일 수 있습니다."
      return 1
    fi

    # 작업 완료 후 MYSQL_PWD 환경 변수 제거 (보안 강화)
    # 이 부분이 중요합니다. 비밀번호가 메모리에 오래 남아있지 않도록 합니다.
    unset MYSQL_PWD

    # 작업 완료 후 MYSQL_PWD 환경 변수 제거 (보안 강화)
    # 이 부분이 중요합니다. 비밀번호가 메모리에 오래 남아있지 않도록 합니다.
    unset MYSQL_PWD
  }

  if create_database_and_user; then
  if create_database_and_user; then
    echo "데이터베이스 생성 확인 ... 성공"
  else
    echo "데이터베이스 생성 확인 ... 실패. 스크립트 종료."
    exit 1
  fi

  # 필요하다면 사용자 생성 및 권한 부여 로직 추가 (auth_socket 사용)
  # 예: sudo mysql -u root -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
  #     sudo mysql -u root -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$DB_USER'@'localhost';"
  #     sudo mysql -u root -e "FLUSH PRIVILEGES;"
}
setup_project() {
  echo ""
  echo "프로젝트 파일 압축 해제 및 설정 시작..."

  TARGET_FULL_PATH="$TARGET_DIR/$PROJECT_DIR"
  SOURCE_FULL_PATH="$SOURCE_DIR/$TAR_FILE"

  echo "확인: 대상 전체 경로: '$TARGET_FULL_PATH'"
  echo "확인: 소스 전체 경로: '$SOURCE_FULL_PATH'"

  if [ -f "$SOURCE_FULL_PATH" ]; then
    if [ -d "$TARGET_FULL_PATH" ]; then
      cd "$TARGET_FULL_PATH"

      if check_status "압축 해제" "tar -xvf "$SOURCE_FULL_PATH" -C "$TARGET_FULL_PATH""; then
        echo "프로젝트 파일 압축 해제 완료 ($SOURCE_FULL_PATH -> $TARGET_FULL_PATH)."
        pwd
        if [ ! -f package.json ]; then
          if check_status "npm 초기화" "npm init -y"; then
            echo "npm 초기화 완료."
            install_modules "$TARGET_FULL_PATH"
          else
            echo "npm 초기화 실패. 스크립트 종료."
            exit 1
          fi
        else
          echo "package.json 파일이 이미 존재합니다. npm 초기화 건너뜁니다."
          install_modules "$TARGET_FULL_PATH"
        fi
      else
        echo "프로젝트 파일 압축 해제 실패. 스크립트 종료."
        exit 1
      fi
    else
      echo "오류: 대상 디렉토리 '$TARGET_FULL_PATH'이 존재하지 않습니다. 스크립트 종료."
      exit 1
    fi
  else
    echo "경고: TAR 파일 '$SOURCE_FULL_PATH'이 존재하지 않습니다. 프로젝트 설정을 건너뜁니다."
  fi
}

install_modules() {
  local PROJECT_PATH="$1"
  echo ""
  echo "npm 모듈 설치 시작..."
  echo "확인: 프로젝트 디렉토리: '$PROJECT_PATH'"

  if [ -d "$PROJECT_PATH" ]; then
    cd "$PROJECT_PATH"

    if [ -f "package.json" ]; then
      if [ -f "package-lock.json" ]; then
        echo "package-lock.json 파일이 존재합니다. 삭제합니다..."
        if rm "package-lock.json"; then
          echo "package-lock.json 파일 삭제 완료."
        else
          echo "오류: package-lock.json 파일 삭제 실패. 스크립트 종료."
          exit 1
        fi
      fi

      if check_status "npm install" "npm install"; then
        echo "npm 모듈 설치 완료."
      else
        echo "오류: npm 모듈 설치 실패. 스크립트 종료."
        exit 1
      fi
    else
      echo "오류: package.json 파일이 존재하지 않습니다. npm 모듈 설치를 건너뜁니다."
    fi
  else
    echo "오류: 대상 디렉토리 '$PROJECT_PATH'이 존재하지 않습니다. 스크립트 종료."
    exit 1
  fi
}
configure_mysql_user() {
  echo ""
  echo "MySQL 사용자 생성 및 데이터베이스 설정 시작 (권한 부여 포함)..."

  local root_user="root"
  local remote_allowed_host="%"       # 외부 접속을 허용할 호스트 (보안상 특정 IP를 명시하는 것이 좋음, 예: "192.168.1.100")
  local local_backup_host="localhost" # 백업이 진행될 로컬 호스트
  local config_file="/etc/mysql/mysql.conf.d/mysqld.cnf"

  local root_user="root"
  local remote_allowed_host="%"       # 외부 접속을 허용할 호스트 (보안상 특정 IP를 명시하는 것이 좋음, 예: "192.168.1.100")
  local local_backup_host="localhost" # 백업이 진행될 로컬 호스트
  local config_file="/etc/mysql/mysql.conf.d/mysqld.cnf"

  # MySQL 접속 및 명령어 실행을 위한 함수
  mysql_exec() {
    echo "$1" | sudo mysql -u root -p"$MYSQL_ROOT_PASSWORD"
  }

  # 데이터베이스 존재 확인
  echo -n "데이터베이스 '$MYSQL_DATABASE' 존재 확인 ... "
  if mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$MYSQL_DATABASE';" | grep -q "^$MYSQL_DATABASE$"; then
    echo "존재합니다."
  else
    echo "존재하지 않습니다. 생성합니다..."
    if mysql_exec "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"; then
      echo "데이터베이스 '$MYSQL_DATABASE' 생성 완료."
    else
      echo "데이터베이스 '$MYSQL_DATABASE' 생성 실패. 스크립트 종료."
      exit 1
    fi
  fi
  echo "--- MySQL 사용자 권한 설정 시작 ---"

  # 1. 기존 'myuser@%' 계정 삭제 (외부 접속용 계정 초기화)
  echo "기존 '${MYSQL_USER}'@'${remote_allowed_host}' 계정이 있다면 삭제합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "DROP USER IF EXISTS '${MYSQL_USER}'@'${remote_allowed_host}';"

  # 2. 기존 'myuser@localhost' 계정 삭제 (로컬 백업용 계정 초기화)
  echo "기존 '${MYSQL_USER}'@'${local_backup_host}' 계정이 있다면 삭제합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "DROP USER IF EXISTS '${MYSQL_USER}'@'${local_backup_host}';"

  # 3. 외부 접속용 사용자 생성 및 권한 부여 (CRUD + DROP 포함)
  echo "외부 접속용 사용자 '${MYSQL_USER}'@'${remote_allowed_host}'를 생성하고 모든 일반 접근 권한 (CRUD + DROP)을 부여합니다..."
  # 사용자 생성은 동일
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'${remote_allowed_host}' IDENTIFIED BY '${MYSQL_PASSWORD}';"
  # 외부 사용자는 특정 DB에 대한 모든 권한을 가집니다.
  # ALL PRIVILEGES는 SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP 등을 포함합니다.
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'${remote_allowed_host}';"

  # 4. 로컬 백업용 사용자 생성 및 권한 부여 (CRUD + DROP + 백업 권한 포함)
  echo "로컬 백업용 사용자 '${MYSQL_USER}'@'${local_backup_host}'를 생성하고 백업 및 일반 접근 권한 (CRUD + DROP)을 부여합니다..."
  # 사용자 생성은 동일
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'${local_backup_host}' IDENTIFIED BY '${MYSQL_PASSWORD}';"
  # 백업에 필요한 글로벌 권한 (RELOAD, REPLICATION CLIENT, LOCK TABLES)과
  # 특정 데이터베이스에 대한 모든 권한 (ALL PRIVILEGES)을 함께 부여합니다.
  # 주의: ON *.* 에 ALL PRIVILEGES를 부여하면 해당 호스트에서 모든 DB에 접근 가능해집니다.
  # 만약 로컬 백업 유저가 특정 DB에만 ALL 권한을 가지게 하려면 아래 줄을 두 줄로 분리해야 합니다.
   # 백업 사용자는 특정 DB에 대한 모든 권한 (CRUD + DROP)을 가집니다.
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'${local_backup_host}';"

  # 백업에 필요한 글로벌 권한 (RELOAD, REPLICATION CLIENT, LOCK TABLES, PROCESS)을 함께 부여합니다.
  # PROCESS 권한 추가!
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT RELOAD, REPLICATION CLIENT, LOCK TABLES, PROCESS ON *.* TO '${MYSQL_USER}'@'${local_backup_host}';"

  # 5. 변경 사항 적용
  echo "권한 변경 사항을 적용합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"

  echo "MySQL 사용자 목록을 확인합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT host, user FROM mysql.user WHERE user = '${MYSQL_USER}';"

  echo "--- MySQL 사용자 권한 설정 완료 ---"
  echo "--- MySQL 사용자 권한 설정 시작 ---"

  # 1. 기존 'myuser@%' 계정 삭제 (외부 접속용 계정 초기화)
  echo "기존 '${MYSQL_USER}'@'${remote_allowed_host}' 계정이 있다면 삭제합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "DROP USER IF EXISTS '${MYSQL_USER}'@'${remote_allowed_host}';"

  # 2. 기존 'myuser@localhost' 계정 삭제 (로컬 백업용 계정 초기화)
  echo "기존 '${MYSQL_USER}'@'${local_backup_host}' 계정이 있다면 삭제합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "DROP USER IF EXISTS '${MYSQL_USER}'@'${local_backup_host}';"

  # 3. 외부 접속용 사용자 생성 및 권한 부여 (CRUD + DROP 포함)
  echo "외부 접속용 사용자 '${MYSQL_USER}'@'${remote_allowed_host}'를 생성하고 모든 일반 접근 권한 (CRUD + DROP)을 부여합니다..."
  # 사용자 생성은 동일
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'${remote_allowed_host}' IDENTIFIED BY '${MYSQL_PASSWORD}';"
  # 외부 사용자는 특정 DB에 대한 모든 권한을 가집니다.
  # ALL PRIVILEGES는 SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP 등을 포함합니다.
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'${remote_allowed_host}';"

  # 4. 로컬 백업용 사용자 생성 및 권한 부여 (CRUD + DROP + 백업 권한 포함)
  echo "로컬 백업용 사용자 '${MYSQL_USER}'@'${local_backup_host}'를 생성하고 백업 및 일반 접근 권한 (CRUD + DROP)을 부여합니다..."
  # 사용자 생성은 동일
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'${local_backup_host}' IDENTIFIED BY '${MYSQL_PASSWORD}';"
  # 백업에 필요한 글로벌 권한 (RELOAD, REPLICATION CLIENT, LOCK TABLES)과
  # 특정 데이터베이스에 대한 모든 권한 (ALL PRIVILEGES)을 함께 부여합니다.
  # 주의: ON *.* 에 ALL PRIVILEGES를 부여하면 해당 호스트에서 모든 DB에 접근 가능해집니다.
  # 만약 로컬 백업 유저가 특정 DB에만 ALL 권한을 가지게 하려면 아래 줄을 두 줄로 분리해야 합니다.
   # 백업 사용자는 특정 DB에 대한 모든 권한 (CRUD + DROP)을 가집니다.
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'${local_backup_host}';"

  # 백업에 필요한 글로벌 권한 (RELOAD, REPLICATION CLIENT, LOCK TABLES, PROCESS)을 함께 부여합니다.
  # PROCESS 권한 추가!
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT RELOAD, REPLICATION CLIENT, LOCK TABLES, PROCESS ON *.* TO '${MYSQL_USER}'@'${local_backup_host}';"

  # 5. 변경 사항 적용
  echo "권한 변경 사항을 적용합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"

  echo "MySQL 사용자 목록을 확인합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT host, user FROM mysql.user WHERE user = '${MYSQL_USER}';"

  echo "--- MySQL 사용자 권한 설정 완료 ---"
}
import_mysql_dump() {
  echo ""
  echo "MySQL 데이터베이스 dump 파일 가져오기 시작..."

  local DUMP_FILE="$SOURCE_DIR/$MYSQL_DUMP_FILE"
  local UNCOMPRESSED_FILE="$SOURCE_DIR/${MYSQL_DUMP_FILE%.gz}" # .gz 확장자 제거

  # MySQL dump 파일 존재 여부 유효성 검사
  if [ ! -f "$DUMP_FILE" ]; then
    echo "경고: MySQL dump 파일 '$DUMP_FILE'이 존재하지 않습니다. 데이터베이스 가져오기를 건너뜁니다."
    return 0 # 파일이 없으면 건너뛰므로 성공으로 처리
  fi
  echo "확인: MySQL dump 파일 '$DUMP_FILE'이 존재합니다."
  which mysql

  # .gz 파일인 경우 압축 해제
  if [[ "$MYSQL_DUMP_FILE" == *.gz ]]; then
    echo "MySQL dump 파일이 gzip으로 압축되어 있습니다. 압축을 해제합니다..."
    if gunzip -c "$DUMP_FILE" >"$UNCOMPRESSED_FILE"; then
    if gunzip -c "$DUMP_FILE" >"$UNCOMPRESSED_FILE"; then
      echo "압축 해제 완료: '$UNCOMPRESSED_FILE'"
      DUMP_FILE="$UNCOMPRESSED_FILE" # 압축 해제된 파일로 변수 업데이트
    else
      echo "오류: gzip 압축 해제 실패. 스크립트 종료."
      exit 1
    fi
  fi

  # 데이터베이스 존재 여부 유효성 검사 (가져오기 전에)
  echo -n "데이터베이스 '$MYSQL_DATABASE' 존재 확인 ... "
  if mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$MYSQL_DATABASE';" | grep -q "^$MYSQL_DATABASE$"; then
    echo "존재합니다."
    # 데이터베이스에 테이블이 있는지 확인하여 데이터 존재 가능성 경고
    TABLE_COUNT=$(mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SHOW TABLES;" | grep -vc "Tables_in_$MYSQL_DATABASE" | wc -l)
    if [ "$TABLE_COUNT" -gt 0 ]; then
      echo ""
      echo "경고: 데이터베이스 '$MYSQL_DATABASE'에 기존 데이터가 있을 수 있습니다."
      read -p "계속 진행하여 기존 데이터를 덮어쓰시겠습니까? (y/N): " -n 1 -r
      echo "" # 개행
      if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
        echo "덮어쓰기를 취소합니다. 데이터베이스 가져오기를 건너뜁니다."
        return 0
      fi
    fi
    echo "데이터 dump를 가져옵니다..."
    # check_status 함수 대신 직접 실행 및 결과 확인
    if mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" <"$DUMP_FILE"; then
    if mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" <"$DUMP_FILE"; then
      echo "데이터베이스 dump 파일 가져오기 완료 ('$DUMP_FILE' -> '$MYSQL_DATABASE')."
      # 압축 해제된 파일 삭제 (선택 사항)
      if [[ "$MYSQL_DUMP_FILE" == *.gz ]]; then
        rm "$UNCOMPRESSED_FILE"
        echo "임시 압축 해제 파일 '$UNCOMPRESSED_FILE' 삭제 완료."
      fi
    else
      echo "오류: 데이터베이스 dump 파일 가져오기 실패."
      exit 1
    fi
  else
    echo "존재하지 않습니다. 먼저 데이터베이스를 생성해야 합니다. 데이터 가져오기를 건너뜁니다."
    return 0 # 데이터베이스가 없으면 건너뛰므로 성공으로 처리
  fi
}
grant_remote_access() {
  local root_user="root"
  local remote_allowed_host="%"                          # 외부 접속을 허용할 호스트 (보안상 특정 IP를 명시하는 것이 좋음, 예: "192.168.1.100")
  local local_backup_host="localhost"                    # 백업이 진행될 로컬 호스트
  local config_file="/etc/mysql/mysql.conf.d/mysqld.cnf" # MySQL 설정 파일 경로

  # --- MySQL 설정 변경 시작 ---
  local remote_allowed_host="%"                          # 외부 접속을 허용할 호스트 (보안상 특정 IP를 명시하는 것이 좋음, 예: "192.168.1.100")
  local local_backup_host="localhost"                    # 백업이 진행될 로컬 호스트
  local config_file="/etc/mysql/mysql.conf.d/mysqld.cnf" # MySQL 설정 파일 경로

  # --- MySQL 설정 변경 시작 ---
  echo ""
  echo "--- MySQL 설정 변경 시작 ---"

  # bind-address 설정을 0.0.0.0으로 변경 (외부 접속을 위해 필수)

  # bind-address 설정을 0.0.0.0으로 변경 (외부 접속을 위해 필수)
  echo "${config_file} 파일을 수정하여 bind-address를 0.0.0.0으로 설정합니다."
  if sudo sed -i 's/^bind-address\s*=\s*127\.0\.0\.1/bind-address = 0.0.0.0/' "${config_file}"; then
    echo "bind-address 설정을 0.0.0.0으로 변경했습니다."
  elif sudo grep -q '^bind-address' "${config_file}"; then
    echo "bind-address 설정이 이미 존재하며, 127.0.0.1이 아닐 수도 있습니다. 확인이 필요합니다."
  else
    echo "bind-address 설정이 파일에 없어 추가합니다."
    sudo sh -c "echo '[mysqld]\nbind-address = 0.0.0.0' >> '${config_file}'"
  fi

  # MySQL 시간을 한국 시간으로 설정 (default_time_zone)
  echo "MySQL 기본 시간을 한국 시간(Asia/Seoul)으로 설정합니다."
  if sudo grep -q '^default_time_zone' "${config_file}"; then
    # 이미 default_time_zone이 있다면 +09:00으로 변경
    # 변경: '+09:00'에서 따옴표 제거 (MySQL 설정에서 따옴표 없이 사용 가능)
    sudo sed -i "s|^default_time_zone\s*=\s*.*|default_time_zone = +09:00|" "${config_file}"
    echo "default_time_zone 설정을 +09:00으로 업데이트했습니다."
  else
    # default_time_zone이 없다면 [mysqld] 섹션 아래에 추가
    # sed -i '/^\[mysqld\]/a default_time_zone = \'+09:00\'' "${config_file}"
    # 또는 파일 끝에 추가 (간단한 방법) - 여기서도 따옴표 제거
    sudo sh -c "echo 'default_time_zone = +09:00' >> '${config_file}'"
    echo "default_time_zone 설정을 파일에 추가했습니다."
  fi

  # MySQL 시간을 한국 시간으로 설정 (default_time_zone)
  echo "MySQL 기본 시간을 한국 시간(Asia/Seoul)으로 설정합니다."
  if sudo grep -q '^default_time_zone' "${config_file}"; then
    # 이미 default_time_zone이 있다면 +09:00으로 변경
    # 변경: '+09:00'에서 따옴표 제거 (MySQL 설정에서 따옴표 없이 사용 가능)
    sudo sed -i "s|^default_time_zone\s*=\s*.*|default_time_zone = +09:00|" "${config_file}"
    echo "default_time_zone 설정을 +09:00으로 업데이트했습니다."
  else
    # default_time_zone이 없다면 [mysqld] 섹션 아래에 추가
    # sed -i '/^\[mysqld\]/a default_time_zone = \'+09:00\'' "${config_file}"
    # 또는 파일 끝에 추가 (간단한 방법) - 여기서도 따옴표 제거
    sudo sh -c "echo 'default_time_zone = +09:00' >> '${config_file}'"
    echo "default_time_zone 설정을 파일에 추가했습니다."
  fi

  # MySQL 서버 재시작
  echo "MySQL 서버를 재시작합니다..."
  if sudo systemctl restart mysql; then
    echo "MySQL 서버 재시작 완료."
  else
    echo "MySQL 서버 재시작 실패! 오류를 확인하세요."
    return 1 # 재시작 실패 시 함수 종료
    return 1 # 재시작 실패 시 함수 종료
  fi

  echo "--- MySQL 설정 변경 완료 ---"

  echo ""
  echo "MySQL 서버의 방화벽에서 3306 포트가 열려 있는지 확인하세요."
  echo "보안에 유의하여 사용하시기 바랍니다."

  echo ""
  echo "--- 연결 테스트 시작 ---"

  # 외부 접속용 계정 연결 테스트 (필요하다면)
  echo "외부 접속용 사용자 '${MYSQL_USER}'@'${remote_allowed_host}' 연결 테스트..."
  # MYSQL_USER와 MYSQL_PASSWORD 변수는 이 함수 외부에서 정의되어야 합니다.
  # 예를 들어, 이 함수 호출 전에 `MYSQL_USER="your_user"` `MYSQL_PASSWORD="your_password"` 등으로 정의 필요.
  if mysql -h"$(hostname -I | awk '{print $1}')" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SELECT 1;" >/dev/null 2>&1; then
    echo "MySQL 서버에 외부 접속용 사용자 '${MYSQL_USER}'로 연결 성공!"
  # 외부 접속용 계정 연결 테스트 (필요하다면)
  echo "외부 접속용 사용자 '${MYSQL_USER}'@'${remote_allowed_host}' 연결 테스트..."
  # MYSQL_USER와 MYSQL_PASSWORD 변수는 이 함수 외부에서 정의되어야 합니다.
  # 예를 들어, 이 함수 호출 전에 `MYSQL_USER="your_user"` `MYSQL_PASSWORD="your_password"` 등으로 정의 필요.
  if mysql -h"$(hostname -I | awk '{print $1}')" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SELECT 1;" >/dev/null 2>&1; then
    echo "MySQL 서버에 외부 접속용 사용자 '${MYSQL_USER}'로 연결 성공!"
  else
    echo "MySQL 서버에 외부 접속용 사용자 '${MYSQL_USER}'로 연결 실패! 방화벽/bind-address/권한을 점검하세요."
  fi

  # 로컬 백업용 계정 연결 테스트
  echo "로컬 백업용 사용자 '${MYSQL_USER}'@'${local_backup_host}' 연결 테스트..."
  if mysql -h"${local_backup_host}" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SELECT 1;" >/dev/null 2>&1; then
    echo "MySQL 서버에 로컬 백업용 사용자 '${MYSQL_USER}'로 연결 성공!"
  else
    echo "MySQL 서버에 로컬 백업용 사용자 '${MYSQL_USER}'로 연결 실패! 오류를 확인하세요."
    echo "MySQL 서버에 외부 접속용 사용자 '${MYSQL_USER}'로 연결 실패! 방화벽/bind-address/권한을 점검하세요."
  fi

  # 로컬 백업용 계정 연결 테스트
  echo "로컬 백업용 사용자 '${MYSQL_USER}'@'${local_backup_host}' 연결 테스트..."
  if mysql -h"${local_backup_host}" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SELECT 1;" >/dev/null 2>&1; then
    echo "MySQL 서버에 로컬 백업용 사용자 '${MYSQL_USER}'로 연결 성공!"
  else
    echo "MySQL 서버에 로컬 백업용 사용자 '${MYSQL_USER}'로 연결 실패! 오류를 확인하세요."
  fi

  echo "--- 연결 테스트 종료 ---"
}

# 함수를 호출하기 전에 전역 변수 MYSQL_USER, MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD를 설정해야 합니다.
# 예시:
# MYSQL_USER="shjung"
# MYSQL_PASSWORD="your_shjung_password"
# MYSQL_ROOT_PASSWORD="your_root_password"
# grant_remote_access

# 함수 사용 예시:
# grant_remote_access "root" "your_root_password" "shjung" "your_password" "%"
# --- 메인 프로세스 ---
#validate_directories
#validate_tar_content
#install_sftp
install_nodejs
#  install_mysql
#  setup_project
configure_mysql_user
 import_mysql_dump
 grant_remote_access

# echo ""
# echo "모든 작업이 완료되었습니다."
# echo "다음 단계를 확인하세요:"
# echo "1. Node.js 프로젝트에 필요한 패키지 설치 (cd $TARGET_DIR/$PROJECT_DIR && npm install <패키지명>)."
# echo "2. 애플리케이션 실행."
# echo "3. SFTP 접속 설정 확인 (필요한 경우)."
# echo "4. mysql dump"

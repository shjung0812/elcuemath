#!/bin/bash

# 스크립트 실행 시 에러 발생 시 즉시 종료
set -e

# --- 변수 설정 ---
SOURCE_DIR="/home/morgan/downloads"        # 복사할 원본 서버의 폴더 경로로 변경하세요.
TARGET_DIR="/home/morgan/web"             # 새로운 서버에 복사할 대상 폴더 경로로 변경하세요.
TAR_FILE="project_backup_20250510_094510.tar.gz"          # 압축 해제할 tar 파일 이름 (SOURCE_DIR 안에 있어야 함)
MYSQL_ROOT_PASSWORD="@131071vangogh@" # MySQL root 비밀번호로 변경하세요.
MYSQL_USER="shjung"          # 생성할 MySQL 사용자 이름으로 변경하세요.
MYSQL_PASSWORD="@soojunglove@"         # 생성할 MySQL 사용자 비밀번호로 변경하세요.
MYSQL_DATABASE="prismmath"          # 생성할 MySQL 데이터베이스 이름으로 변경하세요.
MYSQL_DUMP_FILE="mysql_dump_20250510_094510.sql.gz"          # 실행할 MySQL dump 파일 이름 (SOURCE_DIR 안에 있어야 함)
SFTP_USER="morgan"        # SFTP 사용자 계정
SFTP_USER_HOME="/home/$SFTP_USER" # SFTP 사용자 홈 디렉토리
PROJECT_DIR="elcuemath"

# --- 함수 정의 ---
# check_status() {
#   local message="$1"
#   local command="$2"
#   echo -n "$message ... "
#   if $command &> /dev/null; then
#     echo "완료"
#     return 0 # 성공
#   else
#     echo "실패"
#     return 1 # 실패
#   fi
# }
check_status() {
  local message="$1"
  local command="$2"
  echo -n "$message ... "
  if $command; then
    echo "완료"
    return 0 # 성공
  else
    echo "실패 (오류: $@)"
    return 1 # 실패
  fi
}

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
  if dpkg -s openssh-server &> /dev/null; then
    echo "OpenSSH Server가 이미 설치되어 있습니다. 설치 단계를 건너뜁니다."
  else
    echo "OpenSSH Server가 설치되어 있지 않습니다. 설치를 진행합니다..."
    sudo apt-get update
    if ! check_status "SFTP 패키지 업데이트" "sudo apt-get update"; then
      echo "SFTP 패키지 업데이트 실패. 스크립트 종료."
      exit 1
    fi
    sudo apt-get install -y openssh-server
    if dpkg -s openssh-server &> /dev/null; then
      echo "SFTP (OpenSSH Server) 설치 완료."
    else
      echo "SFTP (OpenSSH Server) 설치 실패. 스크립트 종료."
      exit 1
    fi
  fi

  # SFTP 사용자 생성 (필요한 경우)
  if ! id -u "$SFTP_USER" &> /dev/null; then
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

  # sshd 서비스 재시작 (실행 중인지 확인 후 조건부 실행)
  echo "sshd 서비스 상태 확인..."
  if pgrep -x sshd > /dev/null; then
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
  echo "Node.js 설치 시작..."
  if check_status "Node.js 설치 확인" "command -v node"; then
    echo "Node.js가 이미 설치되어 있습니다. 건너뜁니다."
  else
    curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get update
    if ! check_status "Node.js 패키지 업데이트" "sudo apt-get update"; then
      echo "Node.js 패키지 업데이트 실패. 스크립트 종료."
      exit 1
    fi
    sudo apt-get install -y nodejs
    if check_status "Node.js 설치" "command -v node"; then
      echo "Node.js 설치 완료. 버전:"
      node -v
      npm -v
    else
      echo "Node.js 설치 실패. 스크립트 종료."
      exit 1
    fi
  fi
}

install_mysql() {
  echo ""
  echo "MySQL 설치 시작..."
  if check_status "MySQL 설치 확인" "command -v mysql"; then
    echo "MySQL이 이미 설치되어 있습니다."
  else
    # 초기 설치 시 root 비밀번호 설정 (auth_socket 환경에서는 큰 의미 없을 수 있음)
    echo "mysql-server mysql-server/root_password password $MYSQL_ROOT_PASSWORD" | sudo debconf-set-selections
    echo "mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PASSWORD" | sudo debconf-set-selections
    sudo apt-get install -y mysql-server
    if ! check_status "MySQL 설치" "command -v mysql"; then
      echo "MySQL 설치 실패. 스크립트 종료."
      exit 1
    fi
    echo "MySQL 설치 완료."
  fi

  # MySQL 사용자 생성 및 데이터베이스 설정
  echo "MySQL 사용자 생성 및 데이터베이스 설정 시작..."
  create_database() {
    echo "데이터베이스 '$MYSQL_DATABASE' 생성 시도 (auth_socket 사용)..."
    if sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"; then
      echo "데이터베이스 '$MYSQL_DATABASE' 생성 완료."
      return 0
    else
      echo "데이터베이스 '$MYSQL_DATABASE' 생성 실패 (auth_socket 사용)."
      return 1
    fi
  }

  if create_database; then
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
configure_mysql() {
  echo ""
  echo "MySQL 사용자 생성 및 데이터베이스 설정 시작 (권한 부여 포함)..."

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

  # 사용자 존재 확인
  echo -n "사용자 '$MYSQL_USER'@'localhost' 존재 확인 ... "
  if mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT User FROM mysql.user WHERE User = '$MYSQL_USER' AND Host = 'localhost';" | grep -q "^$MYSQL_USER$"; then
    echo "존재합니다."
  else
    echo "존재하지 않습니다. 생성합니다..."
    if mysql_exec "CREATE USER '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"; then
      echo "사용자 '$MYSQL_USER'@'localhost' 생성 완료."
    else
      echo "사용자 '$MYSQL_USER'@'localhost' 생성 실패. 스크립트 종료."
      exit 1
    fi
  fi

  # 권한 부여 (기존 권한 부여 부분 유지)
  echo -n "사용자 '$MYSQL_USER'@'localhost'에게 데이터베이스 '$MYSQL_DATABASE' 권한 부여 ... "
  if mysql_exec "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'localhost';"; then
    echo "완료."

    # PROCESS 권한 부여 추가
    echo -n "사용자 '$MYSQL_USER'@'localhost'에게 PROCESS 권한 부여 ... "
    if mysql_exec "GRANT PROCESS ON *.* TO '$MYSQL_USER'@'localhost';"; then
      echo "완료."

      # FLUSH PRIVILEGES (기존 위치 유지)
      echo -n "MySQL 권한 적용 ... "
      if mysql_exec "FLUSH PRIVILEGES;"; then
        echo "완료."
      else
        echo "실패. 스크립트 종료."
        exit 1
      fi
    else
      echo "실패. 스크립트 종료."
      exit 1
    fi
  else
    echo "실패. 스크립트 종료."
    exit 1
  fi
}
import_database() {
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
    if gunzip -c "$DUMP_FILE" > "$UNCOMPRESSED_FILE"; then
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
    if mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$DUMP_FILE"; then
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
  local allowed_host="%"
  local config_file="/etc/mysql/mysql.conf.d/mysqld.cnf"

  echo "MySQL 사용자 '${MYSQL_USER}'에게 외부 접근 권한을 부여하는 함수입니다."

  # '${MYSQL_USER}'@'localhost' 계정이 이미 존재할 경우 삭제합니다.
  echo "기존 '${MYSQL_USER}'@'localhost' 계정이 있다면 삭제합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "DROP USER IF EXISTS '${MYSQL_USER}'@'localhost';"

  # 사용자 생성 및 외부 접근 허용
  echo "사용자 '${MYSQL_USER}'@'${allowed_host}'를 생성하고 비밀번호를 설정합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'${allowed_host}' IDENTIFIED BY '${MYSQL_PASSWORD}';"

  # 권한 부여
  echo "사용자 '${MYSQL_USER}'@'${allowed_host}'에게 모든 데이터베이스에 대한 모든 권한을 부여합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'${allowed_host}';"

  # 변경 사항 적용
  echo "권한 변경 사항을 적용합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"

  echo "MySQL 사용자 목록을 확인합니다..."
  mysql -u"${root_user}" -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT host, user FROM mysql.user WHERE user = '${MYSQL_USER}';"

  echo ""
  echo "함수 실행이 완료되었습니다."

  echo ""
  echo "--- MySQL 설정 변경 시작 ---"
  echo "${config_file} 파일을 수정하여 bind-address를 0.0.0.0으로 설정합니다."

  # bind-address 설정을 0.0.0.0으로 변경
  if sudo sed -i 's/^bind-address\s*=\s*127\.0\.0\.1/bind-address = 0.0.0.0/' "${config_file}"; then
    echo "bind-address 설정을 0.0.0.0으로 변경했습니다."
  elif sudo grep -q '^bind-address' "${config_file}"; then
    echo "bind-address 설정이 이미 존재하며, 127.0.0.1이 아닐 수도 있습니다. 확인이 필요합니다."
  else
    echo "bind-address 설정이 파일에 없어 추가합니다."
    sudo sh -c "echo '[mysqld]\nbind-address = 0.0.0.0' >> '${config_file}'"
  fi

  # MySQL 서버 재시작
  echo "MySQL 서버를 재시작합니다..."
  if sudo systemctl restart mysql; then
    echo "MySQL 서버 재시작 완료."
  else
    echo "MySQL 서버 재시작 실패! 오류를 확인하세요."
  fi

  echo "--- MySQL 설정 변경 완료 ---"

  echo ""
  echo "MySQL 서버의 방화벽에서 3306 포트가 열려 있는지 확인하세요."
  echo "보안에 유의하여 사용하시기 바랍니다."

  echo ""
  echo "--- 연결 테스트 시작 ---"

  # 연결 테스트
  if mysql -h"%" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SELECT 1;" > /dev/null 2>&1; then
    echo "MySQL 서버(모든 IP)에 사용자 '${MYSQL_USER}'로 연결 성공!"
  else
    echo "MySQL 서버(모든 IP)에 사용자 '${MYSQL_USER}'로 연결 실패!"
    echo "오류 메시지를 확인하고 방화벽, 설정 파일, 사용자 권한을 다시 점검해 보세요."
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
# validate_directories
# validate_tar_content
# install_sftp
# install_nodejs
# install_mysql
  # setup_project
configure_mysql
# import_database
# grant_remote_access

echo ""
echo "모든 작업이 완료되었습니다."
echo "다음 단계를 확인하세요:"
echo "1. Node.js 프로젝트에 필요한 패키지 설치 (cd $TARGET_DIR/$PROJECT_DIR && npm install <패키지명>)."
echo "2. 애플리케이션 실행."
echo "3. SFTP 접속 설정 확인 (필요한 경우)."
echo "4. mysql dump"


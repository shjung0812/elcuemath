#!/bin/bash

# 스크립트 실행 중 오류 발생 시 즉시 종료
set -e

# 1. 필요한 경로 및 변수 정의
REMOTE_SSH_USER="shjung"      # ai.elcue.org 서버에 접속할 사용자 이름
REMOTE_SSH_HOST="ai.elcue.org" # 파일 원본이 있는 메인 서버 주소 (고정)

# 로컬에서 동기화된 파일을 받을 기본 디렉토리
# 이 스크립트가 실행되는 현재 디렉토리를 기준으로 상대 경로 지정
LOCAL_SYNC_BASE_DIR=".." 
REMOTE_BASE_DIR="/home/${REMOTE_SSH_USER}/web/elcuemath" 

# rsync 로그 파일 (선택 사항)
RSYNC_LOG="$(pwd)/sync_rsync.log" # 스크립트 실행 디렉토리에 로그 생성

echo "--- 동기화 시작: ${REMOTE_SSH_HOST} 서버 ---"
echo "원본 서버: ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST}"
echo "로컬 대상 기본 경로: ${LOCAL_SYNC_BASE_DIR}"

# --- 동기화 대상 목록 정의 ---
# 각 항목은 "원격소스경로 로컬대상하위경로" 형식의 문자열입니다.
# 원격소스경로 끝에는 / 를 반드시 붙여서 내용물만 복사하도록 합니다.
# 로컬대상하위경로는 LOCAL_SYNC_BASE_DIR 아래에 생성/사용될 경로입니다.
declare -a SYNC_TARGETS=(
    "spam/ spam/"       # ai.elcue.org:/path/to/large/files/asset1/  -> ./data/asset1/ 로
    # "path/to/large/files/asset2/ asset2/"       # ai.elcue.org:/path/to/large/files/asset2/  -> ./data/asset2/ 로
    # "backup/videos/ videos/"                   # ai.elcue.org:/backup/videos/             -> ./data/videos/ 로
    # ai.elcue.org 서버 내의 다른 원본 경로는 이 배열에 계속 추가
)

# --- 반복문을 사용하여 각 대상 동기화 ---
for target_pair in "${SYNC_TARGETS[@]}"; do
    # 문자열을 원격 소스 경로와 로컬 대상 하위 경로로 분리
    # 첫 번째 공백을 기준으로 나눔
    remote_source_path=$(echo "${REMOTE_BASE_DIR}/${target_pair}" | cut -d' ' -f1)
    local_target_subdir=$(echo "${target_pair}" | cut -d' ' -f2)

    # 로컬 대상 전체 경로 구성
    local_target_dir="${LOCAL_SYNC_BASE_DIR}/${local_target_subdir}"

    echo ""
    echo "--- 동기화 대상 처리 중 ---"
    echo "원격 소스 경로: ${REMOTE_SSH_HOST}:${remote_source_path}"
    echo "로컬 대상 경로: ${local_target_dir}"

    # 로컬 대상 디렉토리가 없으면 생성
    if [ ! -d "${local_target_dir}" ]; then
      echo "로컬 대상 디렉토리 생성: ${local_target_dir}"
      mkdir -p "${local_target_dir}"
    fi

    # rsync 명령 실행 (로컬로 가져오기)
    # rsync [옵션] [원본] [대상]
    # 원본이 원격일 경우 "유저@호스트:경로" 형식
    rsync \
        -avP \
        --ignore-errors \
        # --delete # 필요하다면 원격에서 삭제된 파일을 로컬에서도 삭제
        # --log-file="${RSYNC_LOG}" # 필요하다면 로그 파일 기록
        "${REMOTE_SSH_USER}@${REMOTE_SSH_HOST}:${remote_source_path}" \
        "${local_target_dir}" # 로컬 대상 경로 (여기서는 끝에 / 를 안 붙여도 결과는 같음)
        # 로컬 대상 경로 끝에 / 를 붙여도 동일하게 작동합니다.

    # rsync 명령 실행 결과 확인
    if [ $? -eq 0 ]; then # 마지막 실행 명령($?)의 종료 코드가 0이면 성공
      echo "rsync 동기화 성공: ${local_target_dir}"
    else
      echo "rsync 동기화 실패 또는 경고 발생: ${local_target_dir}. 로그 파일을 확인하세요: ${RSYNC_LOG}"
      # 실패 시 전체 스크립트를 중단하려면 exit 1 추가
      # exit 1
    fi

done # for 루프 끝


echo ""
echo "--- 동기화 프로세스 완료 ---"

# 전체 동기화 결과 요약 (선택 사항)

exit 0 # 스크립트 성공 종료
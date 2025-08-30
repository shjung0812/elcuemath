---
### **README.md**

### **Google Drive 백업 자동화 스크립트**

이 프로젝트는 Python 스크립트와 Google Drive API를 사용하여 서버의 백업 파일을 Google Drive에 자동으로 동기화합니다. SSH 환경에서의 인증 문제를 해결하고, 효율적인 파일 관리를 위해 최신 백업 파일 N개만 동기화하는 기능을 제공합니다.
---

#### **1. 사전 준비 및 설치**

이 스크립트를 실행하기 전에 다음 단계를 완료해야 합니다.

1.  **Google Cloud Platform 설정**:

    - **OAuth 클라이언트 ID**: GCP 콘솔에서 **데스크톱 앱** 유형의 OAuth 클라이언트 ID를 생성하고, JSON 파일을 `credentials.json`으로 저장합니다.
    - **Google Drive API 활성화**: GCP에서 Google Drive API를 활성화합니다.
    - **테스트 사용자**: 사용자의 Google 계정을 **OAuth 동의 화면**의 테스트 사용자로 추가합니다.

2.  **서버 환경 설정**:

    - **Python 및 가상 환경 설치**: Ubuntu 서버에 `python3`, `python3-pip`, `python3-venv`를 설치합니다.
    - **Python 라이브러리 설치**: 가상 환경을 생성하고 활성화한 후, 필요한 라이브러리를 설치합니다.

      ```bash
      # 가상 환경 생성 및 활성화
      python3 -m venv venv
      source venv/bin/activate

      # 라이브러리 설치
      pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
      ```

    - **방화벽 설정**: 스크립트가 사용할 포트(예: 3005)를 방화벽에서 열어줍니다.
      ```bash
      sudo ufw allow 3005/tcp
      ```

---

#### **2. 최초 인증 (단 한 번만 수행)**

스크립트를 Cron Job으로 자동 실행하기 전에, Google 계정 인증을 완료하고 `token.json` 파일을 생성해야 합니다.

1.  **SSH 포트 포워딩**: 로컬 PC의 포트를 서버로 전달하는 SSH 터널을 생성합니다.
    ```bash
    ssh -L 3005:localhost:3005 morgan@ai.elcue.org
    ```
2.  **스크립트 실행**: 터널을 통해 서버에 접속한 상태에서 스크립트를 실행합니다.
    ```bash
    (venv) $ python3 upload_to_drive.py
    ```
3.  **인증 완료**: 터미널에 출력된 URL(`http://localhost:3005/...`)을 로컬 PC의 웹 브라우저에 붙여넣어 인증을 완료합니다.
4.  **`token.json` 확인**: 인증이 성공하면 스크립트와 같은 디렉토리에 `token.json` 파일이 생성됩니다. 이 파일은 향후 인증 없이 자동 로그인을 가능하게 합니다.

---

#### **3. 스크립트 설정 및 자동화**

`token.json` 파일이 생성된 후, 스크립트의 설정을 수정하고 Cron Job으로 자동화할 수 있습니다.

1.  **스크립트 설정**: `upload_to_drive.py` 파일을 열어 다음 변수들을 사용 환경에 맞게 수정합니다.

    - `LOCAL_FOLDER_PATH`: 동기화할 서버 내 백업 파일 경로
    - `FOLDER_ID`: 파일을 저장할 Google Drive 폴더 ID
    - `NUM_FILES_TO_SYNC`: 동기화할 최신 파일의 개수

2.  **Cron Job 등록**: 매일 자동으로 스크립트를 실행하도록 Cron에 등록합니다.

    ```bash
    crontab -e
    ```

    파일 하단에 다음 줄을 추가합니다. (예: 매일 새벽 3시 0분에 실행)

    ```bash
    0 3 * * * /path/to/your/venv/bin/python /path/to/your/script/upload_to_drive.py
    ```

---

#### **4. 스크립트 주요 기능**

- **자동 로그인**: `token.json` 파일이 존재하면, 스크립트가 별도의 인증 절차 없이 자동으로 Google Drive에 접근합니다.
- **선택적 동기화**: `NUM_FILES_TO_SYNC` 변수로 지정된 최신 N개의 파일만 동기화합니다.
- **효율적 관리**: 로컬에 없는 파일은 Google Drive에서 삭제하고, 수정된 파일만 업데이트하여 스토리지 공간을 효율적으로 관리합니다.

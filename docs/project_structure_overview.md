# 프로젝트 구조 개요 (Project Structure Overview)

이 문서는 프로젝트(`elcuemath/prismmath`)의 전체적인 디렉토리 구조와 각 컴포넌트의 역할을 설명합니다.

## 📂 전체 구조 요약

이 프로젝트는 크게 **레거시 모놀리식 백엔드(Root)** 와 **모던 프론트엔드(frontend)**, 그리고 **음성 처리 서비스(flaskvoice)** 로 구성되어 있습니다.

### 1. 루트 디렉토리 (`/`) - 메인 백엔드 & 레거시 웹
Node.js + Express 기반의 웹 서버로, 프로젝트의 핵심 백엔드 역할을 수행합니다.

*   **Core**: `cdctapp.js`가 애플리케이션의 진입점(Entry Point)입니다.
*   **View**: Pug 템플릿 엔진을 사용하여 서버 사이드 렌더링(SSR)을 처리합니다. (`views/` 폴더)
*   **Database**: MySQL을 사용하며, Sequelize ORM과 Raw SQL 쿼리를 혼용하고 있습니다. (`model/`, `bin/serverflow`)
*   **Key Features**:
    *   **Socket.io**: 화이트보드, 채팅, 시그널링 등 실시간 양방향 통신 구현.
    *   **WebRTC**: 화상 및 음성 통화 기능을 위한 시그널링 서버 역할.
    *   **Passport**: 로컬 전략 등을 이용한 사용자 인증 처리.
*   **주요 파일/폴더**:
    *   `package.json`: 프로젝트 메타데이터 및 의존성 (프로젝트명: `cdct`).
    *   `cdctapp.js`: 메인 서버 파일.
    *   `bin/`, `routes/`: 서버 로직 및 라우팅.

### 2. `frontend/` - 모던 프론트엔드
현재 개발 중인 것으로 추정되는 React 기반의 새로운 프론트엔드 애플리케이션입니다.

*   **Tech Stack**: React, Vite, Tailwind CSS.
*   **역할**: 루트의 Pug 템플릿 기반 뷰를 대체하거나, 별도의 독립적인 클라이언트 앱으로 동작할 가능성이 높습니다.
*   **상태**: 독립적인 `package.json`을 가지고 있으며 자체적인 빌드/개발 환경을 갖추고 있습니다.

### 3. `flaskvoice/` - 음성 처리 서비스
Python Flask 기반의 마이크로서비스로 추정됩니다.

*   **Tech Stack**: Python, Flask.
*   **역할**: Text-to-Speech(TTS), Voice Recognition(STT) 등 음성 처리와 관련된 기능을 전담하는 것으로 보입니다.

### 4. `backend/` - (기타/참고용)
구조화된 백엔드 코드가 들어있으나, 현재 활성화된 메인 서버(`cdctapp.js`)와는 직접적인 연결 고리가 약해 보입니다.

*   `controllers`, `models`, `routes` 등 표준적인 구조를 따르고 있습니다.
*   리팩토링을 위한 준비 단계이거나, 참고용 레거시/신규 코드일 수 있습니다.

## 📝 주요 특징
*   **Hybrid Architecture**: 기존의 Express+Pug 방식과 새로운 React+Vite 방식이 공존하고 있습니다.
*   **Real-time Communication**: WebRTC와 Socket.io가 코드의 상당 부분을 차지하며, 실시간 수업/통신이 핵심 도메인입니다.

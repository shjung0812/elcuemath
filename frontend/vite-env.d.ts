/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 여기에 VITE_로 시작하는 환경 변수들을 명시적으로 선언합니다.
  // TypeScript가 'import.meta.env.VITE_DEV_BASE_URL'을 인식하도록 하려면
  // 'VITE_DEV_BASE_URL: string;'을 추가해야 합니다.
  readonly VITE_DEV_BASE_URL: string;
  // 다른 환경 변수들도 필요하다면 여기에 추가할 수 있습니다.
  // readonly VITE_API_KEY: string;
  // readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
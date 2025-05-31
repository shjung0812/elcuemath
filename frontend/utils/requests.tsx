// 환경 변수 설정은 이 파일의 실행 환경 (Node.js, Vite 등)에 따라 다르게 처리됩니다.
// 클라이언트 측 코드 (브라우저)에서는 import.meta.env를 직접 사용할 수 있습니다.
// require('dotenv').config(...)는 Node.js 환경에서 .env 파일을 로드할 때 사용됩니다.
// 만약 이 파일이 브라우저에서 직접 실행되는 클라이언트 번들러에 의해 처리된다면 아래 주석 처리된 라인은 필요 없습니다.
// require('dotenv').config({ path: require('path').resolve(__dirname, '../../../', '.env') });

// Vite 환경 변수는 import.meta.env로 접근합니다.
// 이 변수들은 빌드 시점에 번들러에 의해 주입됩니다.
const BASE_URL: string = import.meta.env.VITE_DEV_BASE_URL;
const PORT: string = import.meta.env.VITE_PORT;

console.log('BASE_URL', BASE_URL); // 개발 환경에서 이 값이 콘솔에 잘 찍히는지 확인
console.log('PORT', PORT);

// --- 타입 정의 ---

// fetchWithOutCSRF 함수의 옵션 타입을 정의합니다.
// method: HTTP 메서드 (get, post, put, delete)
// body: 요청 본문 (선택 사항, JSON 객체 또는 FormData)
// headers: 요청 헤더 (선택 사항)
export interface FetchOptions {
  url: string; // 요청할 엔드포인트 URL 경로
  method: 'get' | 'post' | 'put' | 'delete';
  body?: Record<string, any> | FormData; // JSON 객체 또는 FormData. Record<string, any>는 모든 키가 string이고 값이 any인 객체를 의미
  headers?: Record<string, string>; // 커스텀 헤더
  isCsrfToken?: boolean; // CSRF 토큰 사용 여부 (주석 처리된 코드에 맞춰 추가)
}

// fetchWithOutCSRF 성공 시 백엔드 응답의 일반적인 타입을 정의합니다.
// 백엔드의 실제 응답 구조에 따라 data 속성의 타입을 더 구체적으로 정의할 수 있습니다.
export interface FetchSuccessResponse<T = any> { // 제네릭 타입 T를 사용하여 data의 타입을 유연하게 정의
  success: boolean;
  data?: T; // 응답 데이터
  message?: string; // 성공 메시지
  // 다른 공통 응답 필드 (예: status_code)도 여기에 추가할 수 있습니다.
}

// --- fetchWithOutCSRF 함수 구현 ---

/**
 * CSRF 토큰이 없거나 포함되지 않는 HTTP 요청을 수행하는 유틸리티 함수입니다.
 * @param {FetchOptions} options - 요청 옵션 객체입니다.
 * @returns {Promise<Response | FetchSuccessResponse>} - 서버 응답 또는 파싱된 JSON 응답 객체를 반환합니다.
 * @throws {Error} - HTTP 에러 또는 네트워크 에러 발생 시 예외를 던집니다.
 */
export async function fetchWithOutCSRF(options: FetchOptions): Promise<Response | FetchSuccessResponse> {
  const { url, method, body, headers, isCsrfToken } = options;

  // CSRF 토큰을 사용할 경우, 로컬 스토리지 등에서 가져오는 로직이 필요합니다.
  // 현재 코드에서는 주석 처리되어 있으니, 필요에 따라 구현하세요.
  // let csrfToken: string | undefined;
  // if (isCsrfToken) {
  //   csrfToken = getCsrfTokenFromSomewhere(); // CSRF 토큰을 가져오는 함수 (예: 로컬 스토리지, 쿠키)
  // }

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers || {}), // 전달받은 커스텀 헤더 추가
    // ...(isCsrfToken && csrfToken ? { "X-CSRFToken": csrfToken } : {}), // CSRF 토큰 포함 시 추가
  };

  const config: RequestInit = {
    method: method,
    headers: requestHeaders,
    // credentials: 'include', // 필요에 따라 쿠키 포함 여부 설정
  };

  // GET 또는 HEAD 메서드에는 body를 포함하지 않습니다.
  if (body && method !== 'get' && method !== 'head') {
    // FormData가 아닌 경우에만 JSON.stringify를 사용합니다.
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  // 완전한 URL 구성: BASE_URL, PORT, 요청 경로 조합
  const fullUrl = `${BASE_URL}:${PORT}${url}`;
  console.log(`Sending ${method.toUpperCase()} request to: ${fullUrl}`); // 요청 URL 로깅

  const response = await fetch(fullUrl, config);

  // 응답이 성공적이지 않은 경우 에러를 던집니다.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText })); // JSON 파싱 실패 대비
    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
  }

  // 성공적인 응답을 JSON으로 파싱하여 반환합니다.
  // 백엔드 응답이 항상 `success` 속성을 포함하는 경우 `FetchSuccessResponse`로 단언합니다.
  return response.json() as Promise<FetchSuccessResponse>;
}
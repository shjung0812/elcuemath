
import { Delta } from 'quill'; // <--- Delta 클래스를 임포트합니다.

export interface FetchOptions {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  body?: Record<string, any> | FormData; // Delta를 보낼 때 JSON.stringify를 사용하면 Record<string, any>
  headers?: Record<string, string>;
}

// fetchWithOutCSRF가 반환하는 성공 응답의 타입
export interface FetchSuccessResponse {
  success: boolean;
  data?: any; // 실제 데이터 타입에 맞게 구체화해야 합니다.
  message?: string;
}
// Quill.js의 getContents()가 반환하는 Delta 객체 타입을 위한 인터페이스 정의 (부분적)
// 실제 Delta는 더 복잡할 수 있으나, 이 예시에서는 필요한 최소한의 구조만 정의합니다.
export interface QuillDelta extends Delta {
  // Delta 클래스 자체에 필요한 속성들이 포함되어 있으므로,
  // 여기에 추가적인 사용자 정의 속성이나 메서드만 추가하면 됩니다.
  // ops?: Array<{
  //   insert?: string | { image: string };
  //   attributes?: Record<string, any>;
  // }>;
}
// 콘텐츠 객체의 타입 정의
export interface Content {
  id: number; // 백엔드 ID가 문자열 또는 숫자일 수 있으므로 유니온 타입 사용
  title: string;
  quill_content: string; // 백엔드에서 HTML을 직접 주거나, Delta JSON 문자열을 주거나
  // 'quill_content'가 Delta 객체 자체라면: quill_content: QuillDelta;
  // 백엔드에서 반환하는 다른 필드들을 여기에 추가할 수 있습니다.
}
export interface SaveContentOptions {
  title: string;
  delta: any; // Quill Delta 타입
  editingContentId?: string | number | null;
}

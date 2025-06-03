// common/types/commonTypes.d.ts

export interface Content {
  id: string | number;
  title: string;
  quill_content: string; // JSON string of Quill Delta
  created_at?: string;
  updated_at?: string;
}

export interface FetchSuccessResponse {
  success: boolean;
  message?: string;
  data?: any; // 데이터 타입은 구체적으로 명시하는 것이 좋음
}

// Delta 클래스의 인스턴스 타입은 rich-text-editor/types/editorTypes.d.ts로 이동
// type MyDeltaType = InstanceType<typeof Delta>;

export interface SaveContentOptions {
  title: string;
  delta: any; // MyDeltaType으로 지정해도 됨. JSON.stringify 전에 Delta 객체일 수 있음.
  editingContentId: string | number | null;
  isCreate: boolean;
}
export interface RequestOptions {
  url: string;
  method: "get" | "post" | "put" | "delete";
  body?: any;
  headers?: Record<string, string>;
}

// 예시용 응답 타입, 실제 API 스펙에 맞게 조정
export interface FetchSuccessResponse {
  success: boolean;
  message?: string;
  data?: any;
}

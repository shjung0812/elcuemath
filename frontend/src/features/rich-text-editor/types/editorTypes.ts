// features/rich-text-editor/types/editorTypes.d.ts
import { Quill } from "react-quill";

const Delta = Quill.import("delta");
export type MyDeltaType = InstanceType<typeof Delta>;

export interface PreviewHtmlContent {
  id: string | number;
  html: string;
}

// 이 외에 에디터 관련 props interface 등도 여기에 정의 가능

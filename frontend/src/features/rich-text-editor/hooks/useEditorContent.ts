// features/rich-text-editor/hooks/useEditorContent.ts
import { useState, useRef, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill";
import { Content } from "../../../common/types/commonTypes";
import { MyDeltaType } from "../types/editorTypes";

const Delta = Quill.import("delta");

interface UseEditorContentResult {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  quillRef: React.RefObject<ReactQuill | null>;
  handleChange: (newValue: string) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewPost: () => void;
  handleEditContent: (content: Content) => void;
  copyToPlainText: () => Promise<void>;
  getQuillDelta: () => MyDeltaType | null; // 에디터의 Delta를 반환하는 함수 추가
}

export const useEditorContent = (): UseEditorContentResult => {
  const [value, setValue] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const quillRef = useRef<ReactQuill | null>(null);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  const handleNewPost = useCallback(() => {
    setTitle("");
    setValue("");
    quillRef.current?.getEditor().setContents(new Delta()); // 에디터 내용도 비워줌
  }, []);

  const handleEditContent = useCallback((content: Content) => {
    setTitle(content.title);
    // 백엔드에서 받은 quill_content가 JSON string 형태라고 가정하고 Delta로 변환
    const deltaToLoad = new Delta(JSON.parse(content.quill_content));
    if (quillRef.current) {
      quillRef.current.getEditor().setContents(deltaToLoad);
      setValue(quillRef.current.getEditor().root.innerHTML); // HTML string으로 value 업데이트
    }
  }, []);

  const copyToPlainText = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const plainText: string = editor.getText();
      try {
        await navigator.clipboard.writeText(plainText);
        alert("텍스트가 클립보드에 복사되었습니다.");
      } catch (err: any) {
        console.error("텍스트 복사에 실패했습니다.", err);
        alert("텍스트 복사에 실패했습니다. 브라우저 설정을 확인해주세요.");
      }
    }
  }, []);

  const getQuillDelta = useCallback(() => {
    if (quillRef.current) {
      return quillRef.current.getEditor().getContents();
    }
    return null;
  }, []);

  return {
    value,
    setValue,
    title,
    setTitle,
    quillRef,
    handleChange,
    handleTitleChange,
    handleNewPost,
    handleEditContent,
    copyToPlainText,
    getQuillDelta,
  };
};

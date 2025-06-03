// features/rich-text-editor/hooks/useQuillToolbar.ts
import { useCallback, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";

// Quill에 ImageResize 모듈을 등록합니다.
Quill.register("modules/imageResize", ImageResize);

interface UseQuillToolbarProps {
  quillRef: React.RefObject<ReactQuill | null>;
  handleChange: (newValue: string) => void;
}

interface UseQuillToolbarResult {
  modules: Record<string, any>;
  formats: string[];
}

export const useQuillToolbar = ({
  quillRef,
  handleChange,
}: UseQuillToolbarProps): UseQuillToolbarResult => {
  const imageHandler = useCallback(() => {
    if (!quillRef.current) {
      console.error("Quill editor instance not available.");
      return;
    }
    const editor = quillRef.current.getEditor();
    const savedRange = editor.getSelection();

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file && quillRef.current) {
        try {
          // 실제 이미지 업로드 로직 (S3, Cloudinary 등)
          // 여기서는 플레이스홀더 사용
          const imageUrl: string =
            "https://placehold.co/600x400/FF5733/FFFFFF?text=Placeholder+Image";

          const currentEditor = quillRef.current.getEditor();
          currentEditor.focus();
          let rangeToUse = savedRange;
          if (!rangeToUse) {
            rangeToUse = currentEditor.getSelection();
          }
          const insertAtIndex: number = rangeToUse
            ? rangeToUse.index
            : currentEditor.getLength();
          currentEditor.insertEmbed(insertAtIndex, "image", imageUrl, "user");
          currentEditor.setSelection(insertAtIndex + 1, 0);

          handleChange(currentEditor.root.innerHTML); // React 상태 업데이트
        } catch (error: any) {
          console.error("이미지 업로드 또는 삽입 실패:", error);
          alert(`이미지 처리 중 오류가 발생했습니다: ${error.message}`);
        }
      }
    };
  }, [quillRef, handleChange]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
          ["image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    [imageHandler]
  );

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "header",
    "list",
    "script",
    "indent",
    "direction",
    "size",
    "color",
    "background",
    "font",
    "align",
    "clean",
    "image",
  ];

  return { modules, formats };
};

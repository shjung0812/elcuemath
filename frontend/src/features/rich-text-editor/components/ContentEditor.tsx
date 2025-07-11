// features/rich-text-editor/components/ContentEditor.tsx
import React from "react";
import ReactQuill from "react-quill"; // 주석 해제: ReactQuill 컴포넌트를 사용합니다.
// import "react-quill/dist/snow.css"; // Quill CSS (필요하다면 이 주석도 해제하세요)

interface ContentEditorProps {
  title: string;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string; // HTML string for Quill
  handleChange: (newValue: string) => void;
  quillRef: React.RefObject<ReactQuill | null>;
  modules: Record<string, any>;
  formats: string[];
  autoSaveStatus: { isSaving: boolean; message: string };
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  title,
  handleTitleChange,
  value,
  handleChange,
  quillRef,
  modules,
  formats,
  autoSaveStatus, // autoSaveStatus prop은 EditorPage에서 Toolbar로만 전달
}) => {
  // const editorStyle =
  //   "border border-gray-300 rounded-md p-4 bg-white shadow-inner focus-within:ring-2 focus-within:ring-blue-300 transition duration-150 overflow-y-auto";

  const editorStyle =
    "border border-gray-300 rounded-md p-4 bg-white shadow-inner focus-within:ring-2 focus-within:ring-blue-300 transition duration-150 flex flex-col flex-grow h-90";
  return (
    // flex-grow flex flex-col
    <div className="flex flex-col flex-grow h-full">
      <input
        type="text"
        placeholder="문서 제목"
        value={title}
        onChange={handleTitleChange}
        className="text-3xl font-bold text-gray-800 mb-4 p-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-400 rounded-md"
      />

      <style>
        {`
        .ql-container{
        height:90%;
        }

          .ql-editor {
            font-size: 1.25rem !important;
            line-height: 1.6;                         
            height: calc(100%); /* 부모 높이의 100%에서 툴바 높이를 뺀 값 */
            // overflow-y: auto; 
            // padding-bottom: 20px;
          }

          /* 에디터 컨테이너가 포커스 되었을 때의 시각적 피드백 (선택 사항) */
          .ql-container.ql-snow:focus-within {
              border-color: #60a5fa; /* blue-400 */
              box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5); /* ring-2 blue-300 */
          }
         
        `}
      </style>
      {/* 이 div 대신 실제 ReactQuill 컴포넌트를 렌더링하고 ref를 연결합니다. */}
      <ReactQuill
        ref={quillRef} // ReactQuill 컴포넌트에 ref를 올바르게 연결합니다.
        value={value}
        onChange={handleChange}
        theme="snow" // 필요에 따라 테마를 설정합니다. (예: "bubble", "snow")
        modules={modules}
        formats={formats}
        className={editorStyle}
      />
    </div>
  );
};

export default ContentEditor;

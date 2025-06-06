// features/rich-text-editor/components/ContentEditor.tsx
import React from "react";
import ReactQuill from "react-quill";
// import "react-quill/dist/snow.css"; // Quill CSS

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
  autoSaveStatus,
}) => {
  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <label
          htmlFor="contentTitle"
          className="block text-gray-800 text-base font-semibold mb-2"
        >
          제목
        </label>
        <input
          type="text"
          id="contentTitle"
          className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <p className="text-sm text-gray-600 mb-4 text-right">
        {autoSaveStatus.message}{" "}
        {autoSaveStatus.isSaving && <span className="animate-pulse">...</span>}
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">Quill 에디터</h2>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        theme="snow"
        modules={modules}
        formats={formats}
        className="editor-big-font bg-gray-50 border border-gray-300 rounded-lg shadow-sm min-h-[300px] flex flex-col"
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default ContentEditor;

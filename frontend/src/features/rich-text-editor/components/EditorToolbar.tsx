// features/rich-text-editor/components/EditorToolbar.tsx
import React from "react";

interface EditorToolbarProps {
  showPreview: boolean;
  togglePreview: () => void;
  copyToPlainText: () => Promise<void>;
  onSave: (isCreate: boolean) => Promise<void>;
  onNewPost: () => void;
  editingContentId: string | number | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  showPreview,
  togglePreview,
  copyToPlainText,
  onSave,
  onNewPost,
  editingContentId,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
      <button
        type="button"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        onClick={togglePreview}
      >
        {showPreview ? "에디터만 보기" : "에디터와 미리보기 같이 보기"}
      </button>
      <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3">
        <button
          type="button"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          onClick={copyToPlainText}
        >
          텍스트로 복사
        </button>
        <button
          type="button"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => onSave(editingContentId === null)} // isCreate prop 전달
        >
          {editingContentId ? "업데이트" : "저장"}
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          onClick={onNewPost}
        >
          새 글 작성
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;

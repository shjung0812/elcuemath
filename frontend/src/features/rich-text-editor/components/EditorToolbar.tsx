// features/rich-text-editor/components/EditorToolbar.tsx
import React from "react";

interface EditorToolbarProps {
  showPreview: boolean;
  togglePreview: () => void;
  copyToPlainText: () => Promise<void>;
  onSave: (isCreate: boolean) => Promise<void>;
  onNewPost: () => void;
  editingContentId: string | number | null;
  autoSaveStatus: { isSaving: boolean; message: string }; // autoSaveStatus prop 추가
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  showPreview,
  togglePreview,
  copyToPlainText,
  onSave,
  onNewPost,
  editingContentId,
  autoSaveStatus, // autoSaveStatus prop 받기
}) => {
  return (
    <div className="sticky top-0 bg-white p-4 shadow-md rounded-lg flex flex-wrap justify-between items-center z-10 mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNewPost()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200"
        >
          <span className="hidden sm:inline">새 글</span>
          <svg
            className="w-5 h-5 sm:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <button
          onClick={() => onSave(editingContentId === null)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200"
        >
          <span className="hidden sm:inline">저장</span>
          <svg
            className="w-5 h-5 sm:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7z"></path>
            <path
              fillRule="evenodd"
              d="M19 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2zm-3 6a1 1 0 11-2 0 1 1 0 012 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div className="text-gray-600 text-sm mt-2 sm:mt-0">
        <span
          className={`px-2 py-1 rounded-full ${
            autoSaveStatus.isSaving
              ? "bg-yellow-200 text-yellow-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {autoSaveStatus.message}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={togglePreview}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200"
        >
          <span className="hidden sm:inline">
            {showPreview ? "미리보기 닫기" : "미리보기 열기"}
          </span>
          <svg
            className="w-5 h-5 sm:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.65 6.138 3 10 3s8.268 2.65 9.542 7c-1.274 4.35-5.68 7-9.542 7S1.732 14.35.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <button
          onClick={copyToPlainText}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200"
        >
          <span className="hidden sm:inline">텍스트 복사</span>
          <svg
            className="w-5 h-5 sm:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;

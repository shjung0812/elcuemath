// features/rich-text-editor/components/ContentList.tsx
import React from "react";
import { Content } from "../../../common/types/commonTypes";
import { PreviewHtmlContent } from "../types/editorTypes"; // 에디터 특정 타입 사용

interface ContentListProps {
  contents: Content[];
  previewHtmlContents: PreviewHtmlContent[];
  onEditContent: (content: Content) => void;
  onDeleteContent: (id: string | number) => Promise<void>;
  editingContentId: string | number | null; // 현재 편집 중인 항목 ID 추가
}

const ContentList: React.FC<ContentListProps> = ({
  contents,
  previewHtmlContents,
  onEditContent,
  onDeleteContent,
  editingContentId,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-xl lg:w-1/4 w-full flex-shrink-0 lg:max-h-[calc(100vh-100px)] overflow-y-auto border border-gray-200">
      {" "}
      {/* 좌측 패널 스타일 */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        내 문서 목록
      </h2>
      {contents.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          저장된 문서가 없습니다. 새 문서를 시작하세요!
        </p>
      ) : (
        <ul className="space-y-1">
          {" "}
          {/* 목록 항목 간격 줄이기 */}
          {contents.map((content) => {
            const previewHtml =
              previewHtmlContents.find((p) => p.id === content.id)?.html ||
              "<p>미리보기 준비 중...</p>";
            return (
              <li
                key={content.id}
                className={`group relative flex items-center justify-between p-2 border border-gray-200 rounded-md shadow-sm transition duration-200 hover:bg-gray-50 cursor-pointer ${
                  editingContentId === content.id
                    ? "bg-blue-50 border-blue-400 ring-1 ring-blue-300"
                    : ""
                }`}
              >
                {/* 전체 콘텐츠 영역을 클릭 가능하게 */}
                <div
                  onClick={() => onEditContent(content)}
                  className="flex-grow flex flex-col pr-6" // 삭제 버튼 공간 확보
                >
                  <h3
                    className={`text-lg font-bold ${
                      editingContentId === content.id
                        ? "text-blue-700"
                        : "text-gray-800"
                    } line-clamp-1`}
                  >
                    {" "}
                    {/* 제목 크기 줄이기 */}
                    {content.title}
                    {editingContentId === content.id && (
                      <span className="ml-2 text-sm text-blue-500">
                        (편집 중)
                      </span>
                    )}
                  </h3>
                  <p
                    className="text-xs text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  ></p>{" "}
                  {/* 미리보기 텍스트 크기 줄이기 */}
                </div>

                {/* 삭제 버튼 (호버 시에만 표시) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteContent(content.id);
                    }} // 이벤트 버블링 방지
                    className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm transition duration-200 flex items-center justify-center"
                    title="삭제"
                  >
                    {/* 휴지통 아이콘 */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ContentList;

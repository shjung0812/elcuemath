// features/rich-text-editor/components/ContentList.tsx
import React from "react";
import { Content } from "../../../common/types/commonTypes";
import { PreviewHtmlContent } from "../types/editorTypes"; // 에디터 특정 타입 사용

interface ContentListProps {
  contents: Content[];
  previewHtmlContents: PreviewHtmlContent[];
  onEditContent: (content: Content) => void;
  onDeleteContent: (id: string | number) => Promise<void>;
}

const ContentList: React.FC<ContentListProps> = ({
  contents,
  previewHtmlContents,
  onEditContent,
  onDeleteContent,
}) => {
  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-5">
        저장된 콘텐츠 목록
      </h3>
      {contents.length === 0 ? (
        <p className="text-gray-600 text-lg text-center py-8">
          아직 저장된 콘텐츠가 없습니다. 새 글을 작성해보세요!
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => {
            const previewHtml =
              previewHtmlContents.find((p) => p.id === content.id)?.html ||
              "<p>미리보기 준비 중...</p>";
            return (
              <li
                key={content.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between transition duration-300 ease-in-out hover:shadow-lg hover:border-blue-300"
              >
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                    {content.title}
                  </h4>
                  <p
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  ></p>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
                    onClick={() => onEditContent(content)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
                    onClick={() => onDeleteContent(content.id)}
                  >
                    삭제
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

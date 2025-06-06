// features/rich-text-editor/components/ContentPreview.tsx
import React, { useRef, useEffect } from "react";

interface ContentPreviewProps {
  value: string; // HTML string
  showPreview: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  value,
  showPreview,
}) => {
  const previewRef = useRef<HTMLDivElement | null>(null);

  // 미리보기를 위한 MathJax 조판 (기존 로직 유지)
  useEffect(() => {
    if ((window as any).MathJax && showPreview && previewRef.current) {
      (window as any).MathJax.typesetPromise([previewRef.current]).catch(
        (err: any) => console.log("MathJax typesetting error:", err)
      );
    }
  }, [value, showPreview]);

  if (!showPreview) {
    return null;
  }

  // Quill HTML 문자열을 직접 사용 (목업에서 델타 JSON 문자열로 대체되었었음)
  const previewHtml = value || "<p>미리 볼 내용이 없습니다.</p>";

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200 mt-6 lg:mt-0">
      {" "}
      {/* 스타일 조정 */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">
        미리보기
      </h2>
      <div
        className="prose max-w-none overflow-y-auto max-h-[calc(50vh-100px)]" // 높이 조정 및 스크롤바
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </div>
  );
};

export default ContentPreview;

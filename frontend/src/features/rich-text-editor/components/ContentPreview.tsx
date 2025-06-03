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

  // 미리보기를 위한 MathJax 조판
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

  return (
    <div
      ref={previewRef}
      className="lg:w-1/2 mt-6 lg:mt-0 lg:pl-6 lg:border-l lg:border-gray-300"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-3">미리보기</h3>
      <div
        className="border border-gray-300 rounded-lg p-5 shadow-sm ql-editor bg-gray-50 min-h-[300px] overflow-auto"
        dangerouslySetInnerHTML={{ __html: value }}
      ></div>
    </div>
  );
};

export default ContentPreview;

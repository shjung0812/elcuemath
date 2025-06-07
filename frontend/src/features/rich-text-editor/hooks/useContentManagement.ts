// features/rich-text-editor/hooks/useContentManagement.ts
import { useState, useCallback, useEffect } from "react";
import { Quill } from "react-quill";

import {
  FetchSuccessResponse,
  SaveContentOptions,
  Content,
} from "../../../common/types/commonTypes";

import { MyDeltaType, PreviewHtmlContent } from "../types/editorTypes";
import {
  fetchContentsApi,
  saveContentApi,
  deleteContentApi,
} from "../api/contentApi"; // API 함수 임포트

const Delta = Quill.import("delta");
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html"; // <-- 이렇게 변경

interface UseContentManagementResult {
  contents: Content[];
  previewHtmlContents: PreviewHtmlContent[];
  editingContentId: string | number | null;
  setEditingContentId: React.Dispatch<
    React.SetStateAction<string | number | null>
  >;
  fetchContents: () => Promise<void>;
  saveOrUpdateContent: ({
    title,
    delta,
    editingContentId,
    isCreate,
  }: SaveContentOptions) => Promise<FetchSuccessResponse>;
  handleDeleteContent: (id: string | number) => Promise<void>;
}

export const useContentManagement = (): UseContentManagementResult => {
  const [contents, setContents] = useState<Content[]>([]);
  const [editingContentId, setEditingContentId] = useState<
    string | number | null
  >(null);
  const [previewHtmlContents, setPreviewHtmlContents] = useState<
    PreviewHtmlContent[]
  >([]);

  const convertDeltaToHtml = useCallback((deltaInput: string) => {
    if (!deltaInput) {
      return "<p>내용 없음</p>";
    }
    try {
      const converter = new QuillDeltaToHtmlConverter(
        new Delta(JSON.parse(deltaInput)).ops,
        {}
      );
      return converter.convert();
    } catch (e) {
      console.error("Error converting Delta to HTML:", e);
      return "<p>내용을 불러오는 데 실패했습니다.</p>";
    }
  }, []);

  const fetchContents = useCallback(async () => {
    try {
      const result = (await fetchContentsApi()) as FetchSuccessResponse;
      if (result.success) {
        // Sort the contents by 'updatedAt' in descending order (newest first)
        const sortedContents = result.data.sort((a: Content, b: Content) => {
          // Ensure updatedAt is treated as a Date for proper comparison
          const dateA = new Date(a.updated_at || 0).getTime(); // Use 0 if updatedAt is null/undefined
          const dateB = new Date(b.updated_at || 0).getTime();
          return dateB - dateA; // Descending order
        });

        setContents(sortedContents); // Set the sorted content

        const convertedHtmls = sortedContents.map((content: Content) => ({
          // Use sortedContents here
          id: content.id,
          html: convertDeltaToHtml(content.quill_content),
        }));
        setPreviewHtmlContents(convertedHtmls);
      } else {
        console.error("콘텐츠 불러오기 실패:", result.message);
        alert("콘텐츠 불러오기 실패: 서버 응답 오류.");
      }
    } catch (error: any) {
      console.error("콘텐츠 불러오기 중 오류 발생:", error);
      alert("콘텐츠 불러오기 중 네트워크 오류가 발생했습니다.");
    }
  }, [convertDeltaToHtml]); // Dependencies remain the same

  const saveOrUpdateContent = useCallback(
    async ({
      title,
      delta,
      editingContentId,
      isCreate,
    }: SaveContentOptions): Promise<FetchSuccessResponse> => {
      const result = await saveContentApi({
        title,
        delta,
        editingContentId,
        isCreate,
      });
      if (!result.success) {
        console.error("Delta 데이터 저장/업데이트 실패:", result.data);
        alert(`Delta 데이터 저장/업데이트에 실패했습니다: ${result.message}`);
      }
      return result;
    },
    []
  );

  const handleDeleteContent = useCallback(
    async (id: string | number) => {
      if (!window.confirm("정말로 이 콘텐츠를 삭제하시겠습니까?")) {
        return;
      }
      try {
        const result = await deleteContentApi(id);
        if (result.success) {
          alert("콘텐츠가 성공적으로 삭제되었습니다.");
          fetchContents();
        } else {
          console.error("콘텐츠 삭제 실패:", result.data);
          alert(`콘텐츠 삭제 실패: ${result.message}`);
        }
      } catch (error: any) {
        console.error("콘텐츠 삭제 중 오류 발생:", error);
        alert("콘텐츠 삭제 중 네트워크 오류가 발생했습니다.");
      }
    },
    [fetchContents]
  );

  // 초기 로드 시 콘텐츠 가져오기
  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  return {
    contents,
    previewHtmlContents,
    editingContentId,
    setEditingContentId,
    fetchContents,
    saveOrUpdateContent,
    handleDeleteContent,
  };
};

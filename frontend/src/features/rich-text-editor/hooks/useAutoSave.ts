// features/rich-text-editor/hooks/useAutoSave.ts
import { useState, useRef, useEffect, useCallback } from "react"; // useCallback 임포트 추가
import { MyDeltaType } from "../types/editorTypes";
import {
  FetchSuccessResponse,
  SaveContentOptions,
} from "../../../common/types/commonTypes";

const AUTO_SAVE_DEBOUNCE_DELAY = 1500; // 1.5 seconds

interface UseAutoSaveProps {
  title: string;
  currentDelta: MyDeltaType | null; // Quill Delta를 직접 받음
  editingContentId: string | number | null;
  saveOrUpdateContent: (
    options: SaveContentOptions
  ) => Promise<FetchSuccessResponse>;
  fetchContents: () => Promise<void>; // fetchContents도 필요 (저장 후 목록 업데이트)
}

interface UseAutoSaveResult {
  autoSaveStatus: { isSaving: boolean; message: string };
  setLastAutoSavedData: (data: {
    delta: MyDeltaType | null;
    title: string | null;
  }) => void;
  // 새로운 함수 추가: 외부에서 자동 저장 메시지를 제어
  setManualAutoSaveStatus: (message: string, isSaving?: boolean) => void;
}

export const useAutoSave = ({
  title,
  currentDelta,
  editingContentId,
  saveOrUpdateContent,
  fetchContents,
}: UseAutoSaveProps): UseAutoSaveResult => {
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<{
    isSaving: boolean;
    message: string;
  }>({ isSaving: false, message: "저장 대기 중" });
  const lastAutoSavedDataRef = useRef<{
    delta: MyDeltaType | null;
    title: string | null;
  } | null>(null);

  const setLastAutoSavedData = (data: {
    delta: MyDeltaType | null;
    title: string | null;
  }) => {
    lastAutoSavedDataRef.current = data;
  };

  // 외부에서 수동으로 자동 저장 상태 메시지를 설정하기 위한 함수
  // isSaving은 기본적으로 false로 설정 (메시지만 변경할 경우)
  const setManualAutoSaveStatus = useCallback(
    (message: string, isSaving: boolean = false) => {
      setAutoSaveStatus({ isSaving, message });
    },
    []
  );

  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // 새 글 작성 중이 아닐 때만 자동 저장 로직 실행 (로컬 저장/새 글 작성은 자동 저장 비활성화)
    // 이 로직은 `setManualAutoSaveStatus`로 대체하는 것이 더 좋습니다.
    // 하지만 현재 로직을 유지하면서, 외부 트리거에 의해 메시지가 덮어쓰여질 수 있도록 합니다.
    if (editingContentId === null) {
      setManualAutoSaveStatus("새 글 작성 중 (자동 저장 비활성)");
      return;
    }

    if (!title.trim() || !currentDelta) {
      setManualAutoSaveStatus("제목 또는 내용 없음 (자동 저장 대기)");
      return;
    }

    // 변경 사항 감지
    const hasDeltaChanged =
      JSON.stringify(currentDelta) !==
      JSON.stringify(lastAutoSavedDataRef.current?.delta);
    const hasTitleChanged = title !== lastAutoSavedDataRef.current?.title;

    if (
      !hasDeltaChanged &&
      !hasTitleChanged &&
      lastAutoSavedDataRef.current !== null
    ) {
      // 변경이 없더라도, 외부에서 메시지를 수동으로 변경한 경우가 아니라면 '변경 없음' 표시
      if (autoSaveStatus.message !== "수동 저장 중...") {
        // 수동 저장 중 메시지와 충돌 방지
        setAutoSaveStatus({ isSaving: false, message: "변경 없음" });
      }
      return;
    }

    setManualAutoSaveStatus("변경 사항 감지됨...");

    autoSaveTimeoutRef.current = setTimeout(async () => {
      console.log("자동 저장 시작 (Debounce)...");
      setAutoSaveStatus({ isSaving: true, message: "자동 저장 중..." });

      const result = await saveOrUpdateContent({
        title: title,
        delta: currentDelta,
        editingContentId: editingContentId,
        isCreate: false, // 자동 저장은 항상 업데이트
      });

      if (result.success) {
        console.log("자동 저장 성공:", result.data);
        lastAutoSavedDataRef.current = { delta: currentDelta, title: title };
        setAutoSaveStatus({
          isSaving: false,
          message: `자동 저장됨: ${new Date().toLocaleTimeString()}`,
        });
        fetchContents(); // 자동 저장 후 목록 갱신
      } else {
        console.error("자동 저장 실패:", result.data);
        setAutoSaveStatus({
          isSaving: false,
          message: `자동 저장 실패: ${result.message || "알 수 없는 오류"}`,
        });
      }
    }, AUTO_SAVE_DEBOUNCE_DELAY);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [
    title,
    currentDelta,
    editingContentId,
    saveOrUpdateContent,
    fetchContents,
    setManualAutoSaveStatus, // 이 함수도 의존성에 추가
    autoSaveStatus.message, // 메시지 충돌 방지 로직을 위해 추가
  ]);

  return { autoSaveStatus, setLastAutoSavedData, setManualAutoSaveStatus };
};

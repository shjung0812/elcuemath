// pages/EditorPage.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill"; // Quill.import("delta")를 위해 필요

// features/rich-text-editor에서 필요한 훅과 컴포넌트를 임포트
import {
  useEditorContent,
  useQuillToolbar,
  useContentManagement,
  useAutoSave,
  RichTextEditorContentEditor,
  RichTextEditorToolbar,
  RichTextEditorContentPreview,
  RichTextEditorContentList,
} from "../features/rich-text-editor";

// import { Content } from '../common/types/commonTypes'; // 필요하다면 공통 타입도 가져옴
interface Content {
  id: string | number;
  title: string;
  quill_content: string; // JSON.stringify된 델타 문자열
  preview_html?: string;
}

function EditorPage(): React.ReactElement {
  const titleInputRef = useRef<HTMLInputElement>(null); // 제목 입력 필드 Ref

  // 1. 에디터 콘텐츠 관련 훅
  const {
    value,
    setValue,
    title,
    setTitle,
    quillRef,
    handleChange,
    handleTitleChange,
    handleNewPost,
    handleEditContent: editContentFromHook, // 이름 충돌 방지
    copyToPlainText,
    getQuillDelta,
  } = useEditorContent();

  // 2. Quill 툴바 관련 훅
  const { modules, formats } = useQuillToolbar({
    quillRef,
    handleChange: setValue,
  });

  // 3. 콘텐츠 관리 관련 훅
  const {
    contents,
    previewHtmlContents,
    editingContentId,
    setEditingContentId,
    fetchContents,
    saveOrUpdateContent,
    handleDeleteContent,
  } = useContentManagement();

  // 4. 자동 저장 관련 훅
  const { autoSaveStatus, setLastAutoSavedData, setManualAutoSaveStatus } =
    useAutoSave({
      title,
      currentDelta: getQuillDelta(),
      editingContentId,
      saveOrUpdateContent,
      fetchContents,
    });

  // 미리보기 상태 (페이지에서 직접 관리)
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const togglePreview = useCallback(() => setShowPreview((prev) => !prev), []);

  // handleEditContent (App에서 orchestration)
  const handleEditContent = useCallback(
    (content: Content) => {
      editContentFromHook(content);
      setEditingContentId(content.id);
      setLastAutoSavedData({
        delta: new (Quill.import("delta"))(JSON.parse(content.quill_content)),
        title: content.title,
      });
      setManualAutoSaveStatus("저장 대기 중");

      // 목록 항목 클릭 시 제목 입력 필드에 초점
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    },
    [
      editContentFromHook,
      setEditingContentId,
      setLastAutoSavedData,
      setManualAutoSaveStatus,
    ]
  );

  // 수동 저장 핸들러 (페이지에서 조합)
  const handleSaveDelta = useCallback(
    async (isCreate: boolean) => {
      if (!quillRef.current) {
        console.error("Quill editor instance not available.");
        setManualAutoSaveStatus("저장 실패: 에디터 인스턴스 없음", false);
        return;
      }
      if (!title.trim()) {
        setManualAutoSaveStatus("저장 실패: 제목을 입력해주세요", false);
        return;
      }

      const delta = getQuillDelta();
      if (!delta) {
        setManualAutoSaveStatus("저장 실패: 에디터 내용 없음", false);
        return;
      }

      setManualAutoSaveStatus("수동 저장 중...", true);

      const result = await saveOrUpdateContent({
        title: title,
        delta: delta,
        editingContentId: editingContentId,
        isCreate,
      });

      if (result.success) {
        setManualAutoSaveStatus("수동 저장 완료");
        setLastAutoSavedData({ delta: delta, title: title });
        fetchContents();
        handleNewPost();
        setEditingContentId(null);
      } else {
        setManualAutoSaveStatus(
          `수동 저장 실패: ${result.message || "알 수 없는 오류"}`
        );
      }
    },
    [
      title,
      getQuillDelta,
      saveOrUpdateContent,
      editingContentId,
      setManualAutoSaveStatus,
      setLastAutoSavedData,
      fetchContents,
      handleNewPost,
      setEditingContentId,
    ]
  );

  // 새 글 작성 핸들러 (페이지에서 조합)
  const handleNewPostWrapper = useCallback(() => {
    handleNewPost();
    setEditingContentId(null);
    setLastAutoSavedData({ delta: null, title: null });
    setManualAutoSaveStatus("저장 대기 중");
    // 새 글 시작 시 제목 필드에 초점
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [
    handleNewPost,
    setEditingContentId,
    setLastAutoSavedData,
    setManualAutoSaveStatus,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans antialiased flex flex-col">
      {/* 툴바 컴포넌트 (페이지 상단에 고정) */}
      <RichTextEditorToolbar
        showPreview={showPreview}
        togglePreview={togglePreview}
        copyToPlainText={copyToPlainText}
        onSave={handleSaveDelta}
        onNewPost={handleNewPostWrapper}
        editingContentId={editingContentId}
        autoSaveStatus={autoSaveStatus} // autoSaveStatus 전달
      />

      <div className="flex-grow flex flex-col lg:flex-row gap-6 mt-4 max-h-[calc(100vh-170px)]">
        {" "}
        {/* 툴바 높이를 고려한 max-height */}
        {/* 콘텐츠 목록 컴포넌트 (좌측 패널) */}
        <RichTextEditorContentList
          contents={contents}
          previewHtmlContents={previewHtmlContents}
          onEditContent={handleEditContent}
          onDeleteContent={handleDeleteContent}
          editingContentId={editingContentId} // editingContentId 전달
        />
        {/* 에디터 및 미리보기 컴포넌트 (우측 패널) */}
        <div className="flex-grow flex flex-col gap-6 lg:w-3/4 w-full">
          {/* 에디터 컴포넌트 */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl flex-grow flex flex-col h-full">
            <RichTextEditorContentEditor
              title={title}
              handleTitleChange={handleTitleChange}
              value={value}
              handleChange={handleChange}
              quillRef={quillRef}
              modules={modules}
              formats={formats}
              autoSaveStatus={autoSaveStatus}
            />
          </div>

          {/* 미리보기 컴포넌트 */}
          <RichTextEditorContentPreview
            value={value}
            showPreview={showPreview}
          />
        </div>
      </div>
    </div>
  );
}

export default EditorPage;

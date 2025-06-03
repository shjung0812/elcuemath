// pages/EditorPage.tsx
import React, { useState, useEffect } from "react";
import Quill from "quill"; // Quill.import("delta")를 위해 필요
import "react-quill/dist/snow.css"; // Quill CSS도 필요하다면 여기에

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

function EditorPage(): React.ReactElement {
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
      // setManualAutoSaveStatus 추가
      title,
      currentDelta: getQuillDelta(),
      editingContentId,
      saveOrUpdateContent,
      fetchContents,
    });

  // 미리보기 상태 (페이지에서 직접 관리)
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const togglePreview = () => setShowPreview((prev) => !prev);

  // handleEditContent (App에서 orchestration)
  const handleEditContent = (content: any) => {
    editContentFromHook(content);
    setEditingContentId(content.id);
    setLastAutoSavedData({
      delta: new (Quill.import("delta"))(JSON.parse(content.quill_content)),
      title: content.title,
    });
    setManualAutoSaveStatus("저장 대기 중"); // 훅 함수를 사용하여 상태 업데이트
  };

  // 수동 저장 핸들러 (페이지에서 조합)
  const handleSaveDelta = async (isCreate: boolean) => {
    if (!quillRef.current) {
      console.error("Quill editor instance not available.");
      alert("Quill 에디터 인스턴스를 찾을 수 없습니다.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const delta = getQuillDelta();
    if (!delta) {
      alert("에디터 내용을 불러올 수 없습니다.");
      return;
    }

    setManualAutoSaveStatus("수동 저장 중...", true); // 훅 함수를 사용하여 상태 업데이트 (isSaving: true)

    const result = await saveOrUpdateContent({
      title: title,
      delta: delta,
      editingContentId: editingContentId,
      isCreate,
    });

    if (result.success) {
      alert(result.message);
      setLastAutoSavedData({ delta: delta, title: title });
      fetchContents();
      handleNewPost();
      setEditingContentId(null);
      setManualAutoSaveStatus("수동 저장 완료"); // 훅 함수를 사용하여 상태 업데이트
    } else {
      setManualAutoSaveStatus(
        `수동 저장 실패: ${result.message || "알 수 없는 오류"}`
      ); // 훅 함수를 사용하여 상태 업데이트
    }
  };

  // 새 글 작성 핸들러 (페이지에서 조합)
  const handleNewPostWrapper = () => {
    handleNewPost();
    setEditingContentId(null);
    setLastAutoSavedData({ delta: null, title: null });
    setManualAutoSaveStatus("저장 대기 중"); // 훅 함수를 사용하여 상태 업데이트
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-xl">
        {/* 툴바 컴포넌트 */}
        <RichTextEditorToolbar
          showPreview={showPreview}
          togglePreview={togglePreview}
          copyToPlainText={copyToPlainText}
          onSave={handleSaveDelta}
          onNewPost={handleNewPostWrapper}
          editingContentId={editingContentId}
        />

        <div
          className={`flex flex-col ${
            showPreview ? "lg:flex-row" : "justify-center"
          } gap-6`}
        >
          {/* 에디터 컴포넌트 */}
          <div
            className={`quill-editor-container text-xl ${
              showPreview ? "lg:w-1/2" : "w-full"
            } flex flex-col`}
          >
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

        {/* 콘텐츠 목록 컴포넌트 */}
        <RichTextEditorContentList
          contents={contents}
          previewHtmlContents={previewHtmlContents}
          onEditContent={handleEditContent}
          onDeleteContent={handleDeleteContent}
        />
      </div>
    </div>
  );
}

export default EditorPage;

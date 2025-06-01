import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
const Delta = Quill.import('delta')
type MyDeltaType = InstanceType<typeof Delta>; // Delta 클래스의 인스턴스 타입을 얻습니다.
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import ImageResize from 'quill-image-resize-module-react';
import { Content,FetchSuccessResponse,SaveContentOptions} from '../../types/fronttype';

import { fetchWithOutCSRF } from '../../../utils/requests';

// Quill에 ImageResize 모듈을 등록합니다.
Quill.register('modules/imageResize', ImageResize);


const AUTO_SAVE_DEBOUNCE_DELAY = 1500; // 1.5 seconds

  function App(): React.ReactElement { // 함수 컴포넌트의 반환 타입 지정



  const [value, setValue] = useState<string>(''); // Quill 에디터 내용 (HTML 문자열)
  const [title, setTitle] = useState<string>(''); // 콘텐츠 제목
  const [showPreview, setShowPreview] = useState<boolean>(false); // 미리보기 패널 토글
  const [contents, setContents] = useState<Content[]>([]); // 저장된 모든 콘텐츠 목록
  const [editingContentId, setEditingContentId] = useState<string | number | null>(null); // 편집 중인 콘텐츠 ID
  const [previewHtmlContents, setPreviewHtmlContents] = useState<{ id: number; html: string }[]>([]);
  // const [isAutoSaving, setIsAutoSaving] = useState(false); // 자동 저장 중 상태 - 이 상태는 autoSaveStatus로 대체됩니다.

  // Debounce 타이머 Ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 자동 저장 중 상태 및 메시지
  const [autoSaveStatus, setAutoSaveStatus] = useState<{ isSaving: boolean; message: string }>({ isSaving: false, message: '저장 대기 중' });
  // 마지막으로 성공적으로 자동 저장된 Delta를 추적 (불필요한 저장 방지)
const lastAutoSavedDataRef = useRef<{ delta: MyDeltaType | null; title: string | null } | null>(null);


  // QuillRef는 HTMLDivElement 또는 ReactQuill 인스턴스를 참조할 수 있으므로 타입을 명확히 지정
  const quillRef = useRef<ReactQuill | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null); // 미리보기 div 참조




  // Quill 에디터 내용 변경을 처리합니다.
  const handleChange = useCallback((newValue:string) => {
    setValue(newValue);
    setAutoSaveStatus({ isSaving: false, message: '변경 사항 감지됨...' });


  }, []);

  // 제목 입력 필드 변경을 처리합니다.
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setAutoSaveStatus({ isSaving: false, message: '변경 사항 감지됨...' });

  }, []);

  // 미리보기 패널의 가시성을 토글합니다.
  const togglePreview = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);

  
const convertDeltaToHtml = useCallback((deltaInput: string) => {
    if (!deltaInput) {
        return '<p>내용 없음</p>';
    }

    try {
        const converter = new QuillDeltaToHtmlConverter(new Delta(JSON.parse(deltaInput)).ops, {});

        return converter.convert();
    } catch (e) {
        console.error("Error converting Delta to HTML:", e);
        return '<p>내용을 불러오는 데 실패했습니다.</p>';
    }
}, []); // 의존성이 없으므로 한 번만 생성됩니다.

  // 에디터의 일반 텍스트 내용을 클립보드에 복사합니다.
  const copyToPlainText = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const plainText: string = editor.getText();
      try {
        // Modern Clipboard API 사용
        await navigator.clipboard.writeText(plainText);
        alert('텍스트가 클립보드에 복사되었습니다.');
      } catch (err: any) { // 에러 타입 명시
        console.error('텍스트 복사에 실패했습니다.', err);
        alert('텍스트 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);


  // Quill 툴바를 위한 사용자 정의 이미지 핸들러
  const imageHandler = useCallback(() => {
    if (!quillRef.current) {
      console.error("Quill editor instance not available.");
      return;
    }
    const editor = quillRef.current.getEditor();
    const savedRange = editor.getSelection(); // 현재 선택 범위 저장

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null; // null 체크 추가
      if (file && quillRef.current) {
        try {
          const imageUrl: string = "https://placehold.co/600x400/FF5733/FFFFFF?text=Placeholder+Image"; // 예시 플레이스홀더 이미지

          const currentEditor = quillRef.current.getEditor();
          currentEditor.focus(); // 삽입 전에 에디터에 포커스
          let rangeToUse = savedRange;
          if (!rangeToUse) {
            rangeToUse = currentEditor.getSelection(); // 저장된 선택 범위가 없으면 현재 선택 범위 가져오기
          }
          const insertAtIndex: number = rangeToUse ? rangeToUse.index : currentEditor.getLength(); // 선택 범위 또는 끝에 삽입
          currentEditor.insertEmbed(insertAtIndex, 'image', imageUrl, 'user'); // 이미지 삽입
          currentEditor.setSelection(insertAtIndex + 1, 0); // 삽입된 이미지 뒤로 커서 이동

          // 새로운 HTML 내용으로 React 상태 업데이트
          handleChange(currentEditor.root.innerHTML);
        } catch (error: any) { // 에러 타입 명시
          console.error('이미지 업로드 또는 삽입 실패:', error);
          alert(`이미지 처리 중 오류가 발생했습니다: ${error.message}`);
        }
      }
    };
  }, [handleChange]);

  const fetchContents = useCallback(async () => {
    try {
      const result: FetchSuccessResponse = await fetchWithOutCSRF({
        url: '/contents/getwriting',
        method: 'get',
      }) as FetchSuccessResponse;

      if (result.success) {
        const fetchedContents:Content[]= result.data
        setContents(fetchedContents); // 원본 Delta 객체를 포함하는 콘텐츠 스테이트 업데이트

        // fetchedContents를 순회하며 각 Delta를 HTML로 변환
        const convertedHtmls = fetchedContents.map(content => ({
          id: content.id,
          html: convertDeltaToHtml(content.quill_content), // 헬퍼 함수 사용
        }));
        setPreviewHtmlContents(convertedHtmls); // 변환된 HTML 스테이트 업데이트

      } else {
        console.error('콘텐츠 불러오기 실패: 응답이 성공적이지 않습니다.');
        alert('콘텐츠 불러오기 실패: 서버 응답 오류.');
      }
    } catch (error: any) {
      console.error('콘텐츠 불러오기 중 오류 발생:', error);
      alert('콘텐츠 불러오기 중 네트워크 오류가 발생했습니다.');
    }
  }, [convertDeltaToHtml]); // convertDeltaToHtml이 의존성이므로 포함

// handleNewPost 함수 수정
const handleNewPost = useCallback(() => {
    setTitle('');
    setValue('');
    setEditingContentId(null);
    lastAutoSavedDataRef.current = null; // 새 글 작성 시 마지막 저장 Delta 초기화
    setAutoSaveStatus({ isSaving: false, message: '저장 대기 중' }); // 상태 초기화
}, []);

  // 콘텐츠 저장 또는 업데이트를 처리합니다 (Delta 형식).
const saveOrUpdateContent = async ({ title, delta, editingContentId,isCreate }: SaveContentOptions): Promise<FetchSuccessResponse> => {
  const requestBody = {
    title: title,
    delta: delta,
  };

  try {
    let response: Response | FetchSuccessResponse;

    if (editingContentId&&!isCreate) {
      response = await fetchWithOutCSRF({
        url: `/contents/handlesavedelta/${editingContentId}`,
        method: 'put',
        body: requestBody
      });
    } else {
      response = await fetchWithOutCSRF({
        url: '/contents/savewriting',
        method: 'post',
        body: requestBody
      });
    }

    if (response instanceof Response) {
      const result = await response.json();
      if (response.ok) {
        return { success: true, message: `Delta 데이터가 성공적으로 ${editingContentId ? '업데이트' : '저장'}되었습니다.`, data: result };
      } else {
        return { success: false, message: result.message || response.statusText, data: result };
      }
    } else if ('success' in response) {
      if (response.success) {
        return { success: true, message: `Delta 데이터가 성공적으로 ${editingContentId ? '업데이트' : '저장'}되었습니다.`, data: response.data };
      } else {
        return { success: false, message: response.message || '알 수 없는 오류', data: response.data };
      }
    } else {
      // 예상치 못한 응답 형식 처리
      return { success: false, message: '알 수 없는 응답 형식', data: response };
    }
  } catch (error: any) {
    console.error('Delta 데이터 저장/업데이트 중 오류 발생:', error);
    return { success: false, message: 'Delta 데이터 저장/업데이트 중 네트워크 오류가 발생했습니다.' };
  }
};

// handleSaveDelta 함수 수정 (주석 처리됨)
const handleSaveDelta = useCallback(async (isCreate:Boolean) => {
    if (!quillRef.current) {
        console.error("Quill editor instance not available.");
        alert('Quill 에디터 인스턴스를 찾을 수 없습니다.');
        return;
    }

    if (!title.trim()) {
        alert('제목을 입력해주세요.');
        return;
    }

    const editor = quillRef.current.getEditor();
    const delta = editor.getContents();

    setAutoSaveStatus({ isSaving: true, message: '수동 저장 중...' }); // 수동 저장 시작 알림
    const result: FetchSuccessResponse = await saveOrUpdateContent({
        title: title,
        delta: delta,
        editingContentId: editingContentId,
        isCreate,
    });
    // 수동 저장 결과에 따라 상태 업데이트
    setAutoSaveStatus({ isSaving: false, message: result.success ? '수동 저장 완료' : '수동 저장 실패' });


    if (result.success) {
        alert(result.message);
        console.log('Delta 저장/업데이트 성공:', result.data);
        lastAutoSavedDataRef.current = { delta: delta, title: title };

        fetchContents();
        handleNewPost();
    } else {
        console.error('Delta 데이터 저장/업데이트 실패:', result.data);
        alert(`Delta 데이터 저장/업데이트에 실패했습니다: ${result.message}`);
    }
}, [title, editingContentId, saveOrUpdateContent, fetchContents, handleNewPost]);
  
// 자동 저장 debounce 로직
useEffect(() => {
    // 기존에 설정된 타이머가 있다면 취소
    if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
    }

    // 새로운 타이머 설정
    autoSaveTimeoutRef.current = setTimeout(async () => {
        if (!quillRef.current || !title.trim()) {
            console.log('자동 저장 스킵: 에디터 인스턴스 없거나 제목 없음.');
            setAutoSaveStatus({ isSaving: false, message: '저장 대기 중' });
            return;
        }

        const currentDelta = quillRef.current.getEditor().getContents();
        const currentTitle = title; // 현재 제목 가져오기

        // 변경 사항 감지 로직 개선: Delta 또는 제목 중 하나라도 변경되었는지 확인
        const hasDeltaChanged = JSON.stringify(currentDelta) !== JSON.stringify(lastAutoSavedDataRef.current?.delta);
        const hasTitleChanged = currentTitle !== lastAutoSavedDataRef.current?.title;

        if (!hasDeltaChanged && !hasTitleChanged && lastAutoSavedDataRef.current !== null) {
            console.log('내용 또는 제목 변경 없음, 자동 저장 스킵.');
            setAutoSaveStatus({ isSaving: false, message: '변경 없음' });
            return;
        }

        console.log('자동 저장 시작 (Debounce)...');
        setAutoSaveStatus({ isSaving: true, message: '자동 저장 중...' });

        fetchContents();

        if(editingContentId){

        const result = await saveOrUpdateContent({
            title: currentTitle, // 수정된 currentTitle 사용
            delta: currentDelta,
            editingContentId: editingContentId,
            isCreate:false
        });

        if (result.success) {
            console.log('자동 저장 성공:', result.data);
            // 성공 시 마지막 저장된 Delta와 Title 모두 업데이트
            lastAutoSavedDataRef.current = { delta: currentDelta, title: currentTitle };
            setAutoSaveStatus({ isSaving: false, message: `자동 저장됨: ${new Date().toLocaleTimeString()}` });
        } else {
            console.error('자동 저장 실패:', result.data);
            setAutoSaveStatus({ isSaving: false, message: `자동 저장 실패: ${result.message || '알 수 없는 오류'}` });
        }

        }else{
          return;
        }


    }, AUTO_SAVE_DEBOUNCE_DELAY);

    // 컴포넌트 언마운트 시 또는 의존성 변경 시 타이머 정리
    return () => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }
    };
}, [title, value, editingContentId, saveOrUpdateContent]); // 의존성 배열에 'value' 추가!


  // handleEditContent 함수 수정
// const handleEditContent = useCallback((content: Content) => {

//         console.log('fetchedContents', contents)

//     // setTitle(content.title);
//     // // 백엔드에서 받은 quill_content가 JSON string 형태라고 가정하고 Delta로 변환
//     // const deltaToLoad = new Delta(JSON.parse(content.quill_content));

//     // // ReactQuill에 Delta 객체를 직접 설정
//     // quillRef.current?.getEditor().setContents(deltaToLoad);
//     // // ReactQuill의 'value' prop은 HTML string을 기대하므로, Delta를 HTML로 변환하여 value 상태 업데이트
//     // setValue(quillRef.current?.getEditor().root.innerHTML || '');
//     // setEditingContentId(content.id);

//     // // 편집 시작 시, 불러온 Delta를 마지막 저장 Delta로 설정
//     // lastAutoSavedDataRef.current = deltaToLoad;
//     // setAutoSaveStatus({ isSaving: false, message: '저장 대기 중' }); // 상태 초기화
// }, []);

const handleEditContent = (content: Content) => {

        console.log('fetchedContents', contents)
        const savingContent=contents.find((item)=>item.id==content.id)
        console.log('savingContent',savingContent)
        const savingContents=contents.find((item)=>item.id==content.id)
        let savingTitle
        let savingQuill
        if(savingContents){
          savingTitle=savingContents.title
          savingQuill=savingContents.quill_content

        }else{
          return
        }
        
      setTitle(savingTitle);



    // setTitle(content.title);
    // // 백엔드에서 받은 quill_content가 JSON string 형태라고 가정하고 Delta로 변환
    const deltaToLoad = new Delta(JSON.parse(savingQuill));

    // ReactQuill에 Delta 객체를 직접 설정
    quillRef.current?.getEditor().setContents(deltaToLoad);
    // ReactQuill의 'value' prop은 HTML string을 기대하므로, Delta를 HTML로 변환하여 value 상태 업데이트
    setValue(deltaToLoad);
    setEditingContentId(content.id);

    // 편집 시작 시, 불러온 Delta를 마지막 저장 Delta로 설정
    lastAutoSavedDataRef.current = deltaToLoad;
    setAutoSaveStatus({ isSaving: false, message: '저장 대기 중' }); // 상태 초기화
};


  // 콘텐츠 항목을 삭제합니다.
  const handleDeleteContent = useCallback(async (id: string | number) => {
    if (!window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      return;
    }
    try {
      const response = await fetchWithOutCSRF({
        url: `/contents/deletewriting/${id}`,
        method: 'delete',
      });

      // fetchWithOutCSRF가 Promise<Response>를 반환할 경우
      if (response instanceof Response && response.ok) {
        alert('콘텐츠가 성공적으로 삭제되었습니다.');
        fetchContents();
        if (editingContentId === id) {
          handleNewPost();
        }
      } else if ('success' in response && response.success) { // fetchWithOutCSRF가 Promise<FetchSuccessResponse>를 반환할 경우
        alert('콘텐츠가 성공적으로 삭제되었습니다.');
        fetchContents();
        if (editingContentId === id) {
          handleNewPost();
        }
      } else {
        // 오류 처리
        const errorData = (response instanceof Response) ? await response.json() : response;
        console.error('콘텐츠 삭제 실패:', errorData);
        alert(`콘텐츠 삭제 실패: ${errorData.message || (response instanceof Response ? response.statusText : '알 수 없는 오류')}`);
      }
    } catch (error: any) { // 에러 타입 명시
      console.error('콘텐츠 삭제 중 오류 발생:', error);
      alert('콘텐츠 삭제 중 네트워크 오류가 발생했습니다.');
    }
 
  }, [editingContentId, fetchContents, handleNewPost]);


  // Quill 에디터 모듈 구성
  const modules = useMemo(() => ({ // React.useMemo 대신 useMemo 직접 사용
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['image'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    imageResize: {
      modules: ['Resize', 'DisplaySize', 'Toolbar'],
    }
  }), [imageHandler]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

    // 미리보기를 위한 MathJax 조판
    useEffect(() => {
      // window 객체에 MathJax가 존재함을 알리는 타입 단언
      if ((window as any).MathJax && showPreview && previewRef.current) {
        // MathJax의 typesetPromise 메서드 호출
        (window as any).MathJax.typesetPromise([previewRef.current])
          .catch((err: any) => console.log('MathJax typesetting error:', err));
      }
    }, [value, showPreview]);

  return (
<div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
          <button
            type="button"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={togglePreview}
          >
            {showPreview ? '에디터만 보기' : '에디터와 미리보기 같이 보기'}
          </button>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3">
            <button
              type="button"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={copyToPlainText}
            >
              텍스트로 복사
            </button>
            {/* HTML 복사 버튼 (주석 처리됨) */}
            {/* <button
              type="button"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={copyToHtml}
            >
              HTML로 복사
            </button> */}
            {/* Quill JSON 복사 버튼 (주석 처리됨) */}
            {/* <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={copyToJson}
            >
              Quill JSON 복사
            </button> */}
            {/* 업데이트/저장 버튼 (주석 처리됨) */}
            <button
              type="button"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={editingContentId?()=>{handleSaveDelta(false)}:()=>{handleSaveDelta(true)}}
            >
              {editingContentId ? '업데이트' : '저장'}
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleNewPost}
            >
              새 글 작성
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="contentTitle" className="block text-gray-800 text-base font-semibold mb-2">
            제목
          </label>
          <input
            type="text"
            id="contentTitle"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
{/* 자동 저장 상태 메시지 추가 */}
<p className="text-sm text-gray-600 mb-4 text-right">
  {autoSaveStatus.message} {autoSaveStatus.isSaving && <span className="animate-pulse">...</span>}
</p>

        <div className={`flex flex-col ${showPreview ? 'lg:flex-row' : 'justify-center'} gap-6`}>
          <div className={`quill-editor-container text-xl ${showPreview ? 'lg:w-1/2' : 'w-full'} flex flex-col`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Quill 에디터</h2>
            <ReactQuill
              ref={quillRef}
              value={value}
              onChange={handleChange}
              theme="snow"
              modules={modules}
              formats={[
                'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
                'header', 'list', 'script', 'indent', 'direction', 'size', 'color',
                'background', 'font', 'align', 'clean', 'image',
              ]}
              className="editor-big-font bg-gray-50 border border-gray-300 rounded-lg shadow-sm min-h-[300px] flex flex-col"
              style={{ flex: 1 }}
            />
          </div>

          {showPreview && (
            <div ref={previewRef} className="lg:w-1/2 mt-6 lg:mt-0 lg:pl-6 lg:border-l lg:border-gray-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">미리보기</h3>
              <div
                className="border border-gray-300 rounded-lg p-5 shadow-sm ql-editor bg-gray-50 min-h-[300px] overflow-auto"
                dangerouslySetInnerHTML={{ __html: value }}
              ></div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-5">저장된 콘텐츠 목록</h3>
          {contents.length === 0 ? (
            <p className="text-gray-600 text-lg text-center py-8">아직 저장된 콘텐츠가 없습니다. 새 글을 작성해보세요!</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => {
                        const previewHtml = previewHtmlContents.find(p => p.id === content.id)?.html || '<p>미리보기 준비 중...</p>';

              
             return  (
                <li
                  key={content.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between transition duration-300 ease-in-out hover:shadow-lg hover:border-blue-300"
                >
                  <div key={content.id}>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2 truncate">{content.title}</h4>
                          {/* previewHtmlContents 스테이트에서 가져온 HTML을 사용 */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: previewHtml }}></p>
                        </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => handleEditContent(content)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => handleDeleteContent(content.id)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              )
            })
                        
            }
            </ul>
          )}
        </div>
      </div>
    </div>)
  }
export default App;
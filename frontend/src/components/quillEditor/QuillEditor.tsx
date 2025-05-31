import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';

// 실제 fetchWithOutCSRF 유틸리티를 임포트합니다.
// 이 경로는 사용자 프로젝트의 실제 경로에 맞게 조정해야 합니다.
import { fetchWithOutCSRF } from '../../../utils/requests';

// Quill에 ImageResize 모듈을 등록합니다.
Quill.register('modules/imageResize', ImageResize);



function App(): React.ReactElement { // 함수 컴포넌트의 반환 타입 지정
  const [value, setValue] = useState<string>(''); // Quill 에디터 내용 (HTML 문자열)
  const [title, setTitle] = useState<string>(''); // 콘텐츠 제목
  const [showPreview, setShowPreview] = useState<boolean>(true); // 미리보기 패널 토글
  const [contents, setContents] = useState<Content[]>([]); // 저장된 모든 콘텐츠 목록
  const [editingContentId, setEditingContentId] = useState<string | number | null>(null); // 편집 중인 콘텐츠 ID

  // QuillRef는 HTMLDivElement 또는 ReactQuill 인스턴스를 참조할 수 있으므로 타입을 명확히 지정
  const quillRef = useRef<ReactQuill | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null); // 미리보기 div 참조

  // Quill 에디터 내용 변경을 처리합니다.
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  // 제목 입력 필드 변경을 처리합니다.
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  // 미리보기 패널의 가시성을 토글합니다.
  const togglePreview = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);

  // 에디터의 일반 텍스트 내용을 클립보드에 복사합니다.
  const copyToPlainText = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const plainText: string = editor.getText();
      try {
        const textarea = document.createElement('textarea');
        textarea.value = plainText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('텍스트가 클립보드에 복사되었습니다.');
      } catch (err: any) { // 에러 타입 명시
        console.error('텍스트 복사에 실패했습니다.', err);
        alert('텍스트 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);

  // 에디터의 HTML 내용을 클립보드에 복사합니다.
  const copyToHtml = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const htmlContent: string = editor.root.innerHTML;
      try {
        const textarea = document.createElement('textarea');
        textarea.value = htmlContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('HTML 내용이 클립보드에 복사되었습니다.');
      } catch (err: any) { // 에러 타입 명시
        console.error('HTML 복사에 실패했습니다.', err);
        alert('HTML 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);

  // 에디터의 Quill Delta (JSON) 내용을 클립보드에 복사합니다.
  const copyToJson = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const jsonContent: string = JSON.stringify(editor.getContents());
      try {
        const textarea = document.createElement('textarea');
        textarea.value = jsonContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Quill JSON (Delta) 내용이 클립보드에 복사되었습니다.');
      } catch (err: any) { // 에러 타입 명시
        console.error('JSON 복사에 실패했습니다.', err);
        alert('JSON 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
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

  // 백엔드에서 저장된 모든 콘텐츠를 가져옵니다.
  const fetchContents = useCallback(async () => {
    try {
      // fetchWithOutCSRF가 Promise<FetchSuccessResponse>를 반환한다고 가정
      const result = await fetchWithOutCSRF({
        url: '/contents/getwriting',
        method: 'get',
      }) as FetchSuccessResponse; // 타입 단언

      console.log('result', result);

      if (result.success) {
        setContents(result.data as Content[] || []); // 반환된 데이터가 Content[]임을 단언
      } else {
        // fetchWithOutCSRF가 성공 응답만 반환하고 에러는 throw 한다고 가정
        // 이 else 블록은 실행되지 않을 수 있습니다.
        console.error('콘텐츠 불러오기 실패: 응답이 성공적이지 않습니다.');
        alert('콘텐츠 불러오기 실패: 서버 응답 오류.');
      }
    } catch (error: any) { // 에러 타입 명시
      console.error('콘텐츠 불러오기 중 오류 발생:', error);
      alert('콘텐츠 불러오기 중 네트워크 오류가 발생했습니다.');
    }
  }, []);

  // 새 글 작성을 위해 에디터와 상태를 초기화합니다.
  const handleNewPost = useCallback(() => {
    setTitle('');
    setValue('');
    setEditingContentId(null);
  }, []);
  // 콘텐츠 저장 또는 업데이트를 처리합니다 (Delta 형식).
  const handleSaveDelta = useCallback(async () => {
    if (!quillRef.current) {
      console.error("Quill editor instance not available.");
      return;
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const editor = quillRef.current.getEditor();
    const delta: QuillDelta = editor.getContents(); // Delta 형식으로 콘텐츠 가져오기

    try {
      let response: Response | FetchSuccessResponse; // Response 또는 커스텀 SuccessResponse 타입
      const requestBody = {
        title: title,
        delta: delta.ops, // Quill Delta의 ops 배열만 보낼 수도 있습니다. 백엔드 요구사항에 따름
        // htmlContent: editor.root.innerHTML // 필요하다면 HTML 콘텐츠도 보낼 수 있습니다.
      };

      if (editingContentId) {
        response = await fetchWithOutCSRF({
          url: `/contents/updatewriting/${editingContentId}`,
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

      // fetchWithOutCSRF가 Promise<Response>를 반환할 경우
      if (response instanceof Response && response.ok) {
        const result = await response.json();
        alert(`Delta 데이터가 성공적으로 ${editingContentId ? '업데이트' : '저장'}되었습니다.`);
        console.log('Delta 저장/업데이트 성공:', result);
        fetchContents();
        handleNewPost();
      } else if ('success' in response && response.success) { // fetchWithOutCSRF가 Promise<FetchSuccessResponse>를 반환할 경우
        alert(`Delta 데이터가 성공적으로 ${editingContentId ? '업데이트' : '저장'}되었습니다.`);
        console.log('Delta 저장/업데이트 성공:', response);
        fetchContents();
        handleNewPost();
      } else {
        // 오류 처리: 응답이 Response 타입이지만 ok가 아니거나, FetchSuccessResponse 타입이지만 success가 false인 경우
        const errorData = (response instanceof Response) ? await response.json() : response; // 에러 데이터 추출 방식 조정
        console.error('Delta 데이터 저장/업데이트 실패:', errorData);
        alert(`Delta 데이터 저장/업데이트에 실패했습니다: ${errorData.message || (response instanceof Response ? response.statusText : '알 수 없는 오류')}`);
      }
    } catch (error: any) { // 에러 타입 명시
      console.error('Delta 데이터 저장/업데이트 중 오류 발생:', error);
      alert('Delta 데이터 저장/업데이트 중 네트워크 오류가 발생했습니다.');
    }
  }, [title, editingContentId, fetchContents, handleNewPost]);

  // 편집을 위해 선택된 콘텐츠를 에디터에 로드합니다.
  const handleEditContent = useCallback((content: Content) => {
    setTitle(content.title);
    // 백엔드에서 받은 quill_content가 HTML 문자열이라고 가정합니다.
    setValue(content.quill_content);
    setEditingContentId(content.id);

    // 만약 content.quill_content가 Delta 객체(JSON)라면:
    // const delta = typeof content.quill_content === 'string' ? JSON.parse(content.quill_content) : content.quill_content;
    // quillRef.current?.getEditor().setContents(delta);
    // setValue(quillRef.current?.getEditor().root.innerHTML || ''); // Delta를 HTML로 변환하여 value 상태 업데이트
  }, []);

  // 콘텐츠 항목을 삭제합니다.
  const handleDeleteContent = useCallback(async (id: string | number) => {
    if (!window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      return;
    }
    try {
      console.log('id', id);
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
        {/* 제어 버튼 섹션 */}
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
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={copyToHtml}
            >
              HTML로 복사
            </button>
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={copyToJson}
            >
              Quill JSON 복사
            </button>
            <button
              type="button"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleSaveDelta}
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

        {/* 제목 입력 필드 */}
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

        {/* 에디터 및 미리보기 섹션 */}
        <div className={`flex flex-col ${showPreview ? 'lg:flex-row' : 'justify-center'} gap-6`}>
          <div className={`quill-editor-container ${showPreview ? 'lg:w-1/2' : 'w-full'} flex flex-col`}>
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
              className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm min-h-[300px] flex flex-col"
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

        {/* 저장된 콘텐츠 목록 섹션 */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-5">저장된 콘텐츠 목록</h3>
          {contents.length === 0 ? (
            <p className="text-gray-600 text-lg text-center py-8">아직 저장된 콘텐츠가 없습니다. 새 글을 작성해보세요!</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => (
                <li
                  key={content.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between transition duration-300 ease-in-out hover:shadow-lg hover:border-blue-300"
                >
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2 truncate">{content.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: content.quill_content || '내용 없음' }}></p>
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
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
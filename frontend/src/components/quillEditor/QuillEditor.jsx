import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

// 실제 fetchWithOutCSRF 유틸리티를 임포트합니다.
// 이 경로는 사용자 프로젝트의 실제 경로에 맞게 조정해야 합니다.
import { fetchWithOutCSRF } from '../../../utils/requests';

// Quill에 ImageResize 모듈을 등록합니다.
Quill.register('modules/imageResize', ImageResize);

function App() {
  const [value, setValue] = useState(''); // Quill 에디터 내용 (HTML 문자열)
  const [title, setTitle] = useState(''); // 콘텐츠 제목
  const [showPreview, setShowPreview] = useState(true); // 미리보기 패널 토글
  const [contents, setContents] = useState([]); // 저장된 모든 콘텐츠 목록
  const [editingContentId, setEditingContentId] = useState(null); // 편집 중인 콘텐츠 ID (새 콘텐츠의 경우 null)

  const quillRef = useRef(null); // Quill 에디터 인스턴스 참조
  const previewRef = useRef(null); // 미리보기 div 참조

  // Quill 에디터 내용 변경을 처리합니다.
  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  // 제목 입력 필드 변경을 처리합니다.
  const handleTitleChange = useCallback((e) => {
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
      const plainText = editor.getText();
      try {
        // iframe 호환성을 위해 document.execCommand('copy')를 사용합니다.
        const textarea = document.createElement('textarea');
        textarea.value = plainText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('텍스트가 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('텍스트 복사에 실패했습니다.', err);
        alert('텍스트 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);

  // 에디터의 HTML 내용을 클립보드에 복사합니다.
  const copyToHtml = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const htmlContent = editor.root.innerHTML;
      try {
        // iframe 호환성을 위해 document.execCommand('copy')를 사용합니다.
        const textarea = document.createElement('textarea');
        textarea.value = htmlContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('HTML 내용이 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('HTML 복사에 실패했습니다.', err);
        alert('HTML 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);

  // 에디터의 Quill Delta (JSON) 내용을 클립보드에 복사합니다.
  const copyToJson = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const jsonContent = JSON.stringify(editor.getContents());
      try {
        // iframe 호환성을 위해 document.execCommand('copy')를 사용합니다.
        const textarea = document.createElement('textarea');
        textarea.value = jsonContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Quill JSON (Delta) 내용이 클립보드에 복사되었습니다.');
      } catch (err) {
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
      const file = input.files[0];
      if (file && quillRef.current) {
        try {
          // 실제 애플리케이션에서는 파일을 서버에 업로드하고 실제 URL을 받아야 합니다.
          // 여기서는 플레이스홀더 이미지를 사용합니다.
          const imageUrl = "https://placehold.co/600x400/FF5733/FFFFFF?text=Placeholder+Image"; // 예시 플레이스홀더 이미지

          const currentEditor = quillRef.current.getEditor();
          currentEditor.focus(); // 삽입 전에 에디터에 포커스
          let rangeToUse = savedRange;
          if (!rangeToUse) {
            rangeToUse = currentEditor.getSelection(); // 저장된 선택 범위가 없으면 현재 선택 범위 가져오기
          }
          const insertAtIndex = rangeToUse ? rangeToUse.index : currentEditor.getLength(); // 선택 범위 또는 끝에 삽입
          currentEditor.insertEmbed(insertAtIndex, 'image', imageUrl, 'user'); // 이미지 삽입
          currentEditor.setSelection(insertAtIndex + 1, 0); // 삽입된 이미지 뒤로 커서 이동

          // 새로운 HTML 내용으로 React 상태 업데이트
          handleChange(currentEditor.root.innerHTML);
        } catch (error) {
          console.error('이미지 업로드 또는 삽입 실패:', error);
          alert(`이미지 처리 중 오류가 발생했습니다: ${error.message}`);
        }
      }
    };
  }, [handleChange]);

  // 백엔드에서 저장된 모든 콘텐츠를 가져옵니다.
  const fetchContents = useCallback(async () => {
    try {
      const result = await fetchWithOutCSRF({
        url: '/contents/getwriting', // 모든 콘텐츠를 가져오는 백엔드 엔드포인트
        method: 'get',
      });


      if (result.success) {
        // 백엔드 응답 구조에 따라 'data' 키를 사용하거나 직접 배열을 사용합니다.
        setContents(result.data || []);
      } else {
        const errorData = await response.json();
        console.error('콘텐츠 불러오기 실패:', errorData);
        alert(`콘텐츠 불러오기 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('콘텐츠 불러오기 중 오류 발생:', error);
      alert('콘텐츠 불러오기 중 네트워크 오류가 발생했습니다.');
    }
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
    const delta = editor.getContents(); // Delta 형식으로 콘텐츠 가져오기
    // const htmlContent = editor.root.innerHTML; // 필요하다면 HTML 콘텐츠도 보낼 수 있습니다.

    try {
      let response;
      if (editingContentId) {
        // 기존 콘텐츠를 편집 중인 경우 PUT 요청을 보냅니다.
        response = await fetchWithOutCSRF({
          url: `/contents/updatewriting/${editingContentId}`, // 콘텐츠 업데이트 백엔드 엔드포인트
          method: 'put',
          body: {
            title: title,
            delta: delta,
            // htmlContent: htmlContent // 필요하다면
          }
        });
      } else {
        // 새 콘텐츠를 생성하는 경우 POST 요청을 보냅니다.
        response = await fetchWithOutCSRF({
          url: '/contents/savewriting', // 새 콘텐츠 저장 백엔드 엔드포인트
          method: 'post',
          body: {
            title: title,
            delta: delta,
            // htmlContent: htmlContent // 필요하다면
          }
        });
      }

      if (response.ok) {
        const result = await response.json();
        alert(`Delta 데이터가 성공적으로 ${editingContentId ? '업데이트' : '저장'}되었습니다.`);
        console.log('Delta 저장/업데이트 성공:', result);
        // 저장/업데이트 후 콘텐츠 목록을 다시 가져옵니다.
        fetchContents();
        // 에디터를 지우고 편집 상태를 초기화합니다.
        handleNewPost();
      } else {
        const errorData = await response.json();
        console.error('Delta 데이터 저장/업데이트 실패:', errorData);
        alert(`Delta 데이터 저장/업데이트에 실패했습니다: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Delta 데이터 저장/업데이트 중 오류 발생:', error);
      alert('Delta 데이터 저장/업데이트 중 네트워크 오류가 발생했습니다.');
    }
  }, [title, editingContentId, fetchContents]);

  // 편집을 위해 선택된 콘텐츠를 에디터에 로드합니다.
  const handleEditContent = useCallback((content) => {
    setTitle(content.title);
    // ReactQuill은 `value` prop에 HTML 문자열을 기대합니다.
    // 백엔드가 Delta를 저장하는 경우, HTML로 변환해야 할 수 있습니다.
    // 백엔드에서 htmlContent를 함께 제공한다고 가정합니다.
    setValue(new Quill(document.createElement('div')).setContents(content.quill_content));
    setEditingContentId(content.id);
  }, []);

  // 콘텐츠 항목을 삭제합니다.
  const handleDeleteContent = useCallback(async (id) => {
    // 사용자에게 삭제 확인 메시지를 표시합니다.
    // 실제 애플리케이션에서는 사용자 정의 모달 UI를 사용해야 합니다.
    if (!window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      return;
    }
    try {
      const response = await fetchWithOutCSRF({
        url: `/contents/deletewriting/${id}`, // 콘텐츠 삭제 백엔드 엔드포인트
        method: 'delete',
      });

      if (response.ok) {
        alert('콘텐츠가 성공적으로 삭제되었습니다.');
        fetchContents(); // 삭제 후 콘텐츠를 다시 가져옵니다.
        if (editingContentId === id) {
          handleNewPost(); // 삭제된 콘텐츠가 편집 중이었다면 에디터를 지웁니다.
        }
      } else {
        const errorData = await response.json();
        console.error('콘텐츠 삭제 실패:', errorData);
        alert(`콘텐츠 삭제 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('콘텐츠 삭제 중 오류 발생:', error);
      alert('콘텐츠 삭제 중 네트워크 오류가 발생했습니다.');
    }
  }, [editingContentId, fetchContents]);

  // 새 글 작성을 위해 에디터와 상태를 초기화합니다.
  const handleNewPost = useCallback(() => {
    setTitle('');
    setValue('');
    setEditingContentId(null);
  }, []);

  // Quill 에디터 모듈 구성
  const modules = React.useMemo(() => ({
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
    if (window.MathJax && showPreview && previewRef.current) {
      window.MathJax.typesetPromise([previewRef.current])
        .catch((err) => console.log('MathJax typesetting error:', err));
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
              style={{ flex: 1 }} // Quill이 사용 가능한 높이를 차지하도록 보장
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
                    {/* 백엔드에서 HTML 콘텐츠를 직접 받거나, Delta를 HTML로 변환하여 표시합니다. */}
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

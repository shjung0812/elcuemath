import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { fetchWithOutCSRF } from '../../../utils/requests';

Quill.register('modules/imageResize', ImageResize);

function QuillEditorWithImage() {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState(''); // <-- 1. title 상태 추가
  const [showPreview, setShowPreview] = useState(true);
  const quillRef = useRef(null);
  const previewRef = useRef(null);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  // <-- 2. title 입력 필드 핸들러 추가
  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const togglePreview = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);

  const copyToPlainText = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const plainText = editor.getText();
      try {
        await navigator.clipboard.writeText(plainText);
        alert('텍스트가 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('텍스트 복사에 실패했습니다.', err);
        alert('텍스트 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);

  const copyToHtml = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const htmlContent = editor.root.innerHTML;
      try {
        await navigator.clipboard.writeText(htmlContent);
        alert('HTML 내용이 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('HTML 복사에 실패했습니다.', err);
        alert('HTML 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);

  const copyToJson = useCallback(async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const jsonContent = JSON.stringify(editor.getContents());
      try {
        await navigator.clipboard.writeText(jsonContent);
        alert('Quill JSON (Delta) 내용이 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('JSON 복사에 실패했습니다.', err);
        alert('JSON 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    }
  }, []);

  const imageHandler = useCallback(() => {
    if (!quillRef.current) {
      console.error("Quill editor instance not available.");
      return;
    }
    const editor = quillRef.current.getEditor();
    const savedRange = editor.getSelection();

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file && quillRef.current) {
        try {
          const imageUrl = "https://whalse.elcue.org/whalse/whalsewaiting/0_errorwaitingphoto_1747367702285.jpg";
          const currentEditor = quillRef.current.getEditor();
          currentEditor.focus();
          let rangeToUse = savedRange;
          if (!rangeToUse) {
            rangeToUse = currentEditor.getSelection();
          }
          const insertAtIndex = rangeToUse ? rangeToUse.index : currentEditor.getLength();
          currentEditor.insertEmbed(insertAtIndex, 'image', imageUrl, 'user');
          const updatedHtml = currentEditor.root.innerHTML;
          handleChange(updatedHtml);
          currentEditor.setSelection(insertAtIndex + 1, 0);
        } catch (error) {
          console.error('이미지 업로드 또는 삽입 실패:', error);
          alert(`이미지 처리 중 오류가 발생했습니다: ${error.message}`);
        }
      }
    };
  }, [handleChange]);

  const handleSaveDelta = useCallback(async () => {
    if (!quillRef.current) {
      console.error("Quill editor instance not available.");
      return;
    }

    // <-- 3. 저장 시 title 유효성 검사 및 전송
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const editor = quillRef.current.getEditor();
    const delta = editor.getContents();
    const htmlContent = editor.root.innerHTML; // HTML 내용도 함께 보낼 경우

    try {
      const response = await fetchWithOutCSRF({
        url: '/contents/savewriting',
        method: 'post',
        body: {
          title: title, // <-- 4. title도 body에 추가
          delta: delta,
          // htmlContent: htmlContent // 필요하다면
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert('Delta 데이터가 성공적으로 저장되었습니다.');
        console.log('Delta 저장 성공:', result);
        // 저장 성공 후 필요한 로직 (예: 상태 초기화, 메시지 표시)을 추가할 수 있습니다.
        // setTitle(''); // 저장 후 제목 초기화
        // setValue(''); // 저장 후 에디터 내용 초기화
      } else {
        const errorData = await response.json();
        console.error('Delta 데이터 저장 실패:', errorData);
        alert(`Delta 데이터 저장에 실패했습니다: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Delta 데이터 저장 중 오류 발생:', error);
      alert('Delta 데이터 저장 중 네트워크 오류가 발생했습니다.');
    }
  }, [title]); // <-- title 상태가 변경될 때마다 handleSaveDelta를 다시 생성

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
    if (window.MathJax && showPreview && previewRef.current) {
      window.MathJax.typesetPromise([previewRef.current])
        .catch((err) => console.log('MathJax typesetting error:', err));
    }
  }, [value, showPreview]);

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={togglePreview}
        >
          {showPreview ? '에디터만 보기' : '에디터와 미리보기 같이 보기'}
        </button>
        <div>
          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
            onClick={copyToPlainText}
          >
            텍스트로 복사
          </button>
          <button
            type="button"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
            onClick={copyToHtml}
          >
            HTML로 복사
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
            onClick={copyToJson}
          >
            Quill JSON 복사
          </button>
          <button
            type="button"
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSaveDelta}
          >
            Delta로 저장
          </button>
        </div>
      </div>

      {/* <-- 5. 제목 입력 필드 추가 */}
      <div className="mb-4">
        <label htmlFor="contentTitle" className="block text-gray-700 text-sm font-bold mb-2">
          제목
        </label>
        <input
          type="text"
          id="contentTitle"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className={showPreview ? 'flex flex-row gap-8' : 'flex justify-center'}>
        <div className="quill-editor-container" style={{ width: showPreview ? '50%' : '100%' }}>
          <h2 className="text-xl font-semibold mb-2">Quill Editor</h2>
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
            className="bg-gray-50 border border-gray-300 rounded-md"
          />
        </div>

        {showPreview && (
          <div ref={previewRef} className="w-1/2 mt-6 pl-4 border-l border-gray-300">
            <h3 className="text-xl font-semibold mb-2">미리보기</h3>
            <div
              className="border rounded-md p-4 shadow-sm ql-editor bg-gray-50 min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: value }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuillEditorWithImage;
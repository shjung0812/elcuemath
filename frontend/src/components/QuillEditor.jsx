import React, { useState, useRef, useEffect,useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 에디터 스타일 (snow 테마)

function QuillEditor() {
  const [value, setValue] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const quillRef = useRef(null); // Quill 에디터 인스턴스에 접근하기 위한 ref
  const previewRef = useRef(null); // 미리보기 div에 대한 ref


  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    console.log('Editor content:', newValue);
  }, []);

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  const copyToPlainText = async () => {
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
  };

  const copyToHtml = async () => {
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
  };

  const copyToJson = async () => {
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
  };

  useEffect(() => {
    if (window.MathJax && showPreview && previewRef.current) {
      window.MathJax.typesetPromise([previewRef.current])
        .then(() => {
          console.log('MathJax typesetting complete.');
        })
        .catch((err) => console.log('MathJax typesetting error:', err));
    }
  }, [value, showPreview]);

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-800 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={togglePreview}
        >
          {showPreview ? '에디터만 보기' : '에디터와 미리보기 같이 보기'}
        </button>
        <div>
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-black font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
            onClick={copyToPlainText}
          >
            텍스트로 복사
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
            onClick={copyToHtml}
          >
            HTML로 복사
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={copyToJson}
          >
            Quill JSON 복사
          </button>
        </div>
      </div>

      <div className={showPreview ? 'flex flex-row gap-8' : 'flex justify-center'}>
        {/* <div className={showPreview ? 'w-1/2' : 'w-full'}> */}
        <div className="quill-editor-container">

          <h2>Quill Editor</h2>
          <ReactQuill
            ref={quillRef} // ref 연결
            value={value}
            onChange={handleChange}
            theme="snow"
            // theme={null} // 또는 'base'

            modules={{
              toolbar: [
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
              ],
            }}
            formats={[
              'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
              'header', 'list', 'script', 'indent', 'direction', 'size', 'color',
              'background', 'font', 'align', 'clean',
            ]}
          />
        </div>

        {showPreview && (
            <div ref={previewRef} className="w-1/2 mt-6">
            <h3>미리보기</h3>
            <div className="border rounded-md p-4 shadow-sm ql-editor" dangerouslySetInnerHTML={{ __html: value }}></div>
          </div>

          
        )}
      </div>

    </div>
  );
}

export default QuillEditor;
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 에디터 스타일 (snow 테마)

function QuillEditor() {
  const [value, setValue] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const handleChange = (newValue) => {
    setValue(newValue);
    console.log('Editor content:', newValue); // 에디터 내용 변화 감지
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
<button
  className="bg-blue-600 hover:bg-blue-800 text-green-300 font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
  onClick={togglePreview}
>
  {showPreview ? '에디터만 보기' : '에디터와 미리보기 같이 보기'}
</button>

      <div className={showPreview ? 'flex flex-row gap-8' : 'flex justify-center'}>
        <div className={showPreview ? 'w-1/2' : 'w-full'}>
          <h2>Quill Editor</h2>
          <ReactQuill
            value={value}
            onChange={handleChange}
            theme="snow"
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
          <div className="w-1/2 mt-6">
            <h3>미리보기</h3>
            <div className="border rounded-md p-4 shadow-sm" dangerouslySetInnerHTML={{ __html: value }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuillEditor;
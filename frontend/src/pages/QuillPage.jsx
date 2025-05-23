import React, { useState, useRef } from 'react';
import QuillEditor from '../components/quillEditor/QuillEditor';
import { Delta } from 'quill'; // Delta 타입 import

function QuillPage() {
  const [delta, setDelta] = useState(new Delta);
  const [value, setValue] = useState('');

  const handleContentChange = (htmlContent) => {
    // HTML 내용이 변경될 때 필요한 로직 (선택 사항)
    // console.log('HTML Content Changed:', htmlContent);
  };



  const handleSave = () => {
    if (delta) {
      console.log('저장할 Delta JSON (외부 버튼):', delta);
      // 여기에 실제 저장 로직 (API 호출, 로컬 스토리지 저장 등)을 구현합니다.
      alert('Delta JSON 내용이 저장되었습니다! (외부 버튼)');
    } else {
      alert('저장할 내용이 없습니다.');
    }
  };

  return (
    <div>
      <h1>나의 에디터 페이지 (외부 저장 버튼)</h1>
      <QuillEditor
        onContentChange={handleContentChange}
        setValue={setValue}
        value={value}

      />
      <button
        type="button"
        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
        onClick={handleSave}
      >
        Delta JSON으로 저장 (외부 버튼)
      </button>
      {/* ... 기타 UI 요소 ... */}
    </div>
  );
}

export default QuillPage;
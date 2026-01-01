import React, { useState, useRef } from "react";
import QuillEditor from '../components/quillEditor/QuillEditor';
import { Delta } from "quill"; // Delta 타입 import

function QuillPage() {
  return (
    <div>
      <h1>나의 에디터 페이지 </h1>
      <QuillEditor
      />
    </div>
  );
}

export default QuillPage;

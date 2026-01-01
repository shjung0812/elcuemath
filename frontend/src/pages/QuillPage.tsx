import React, { useState, useRef } from "react";
import QuillEditor from '../components/quillEditor/QuillEditor';
import { Delta } from "quill"; // Delta 타입 import

function QuillPage() {
  return (
    <div>

      <QuillEditor
      />
    </div>
  );
}

export default QuillPage;

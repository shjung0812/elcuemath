import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill'; // Quill 객체를 함께 임포트합니다.
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react'; // 설치한 모듈을 임포트합니다.

// ImageResize 모듈을 Quill에 등록합니다. 이 코드는 컴포넌트 외부, 파일 상단에 위치해야 합니다.
// true를 세 번째 인자로 전달하면, 다른 라이브러리에 의해 이미 등록된 경우 덮어쓰도록 허용할 수 있습니다.
Quill.register('modules/imageResize', ImageResize);

function QuillEditorWithImage() {
  const [value, setValue] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const quillRef = useRef(null);
  const previewRef = useRef(null);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    // console.log('Editor content updated via handleChange:', newValue);
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
    // imageResize 모듈 설정을 추가합니다.
    imageResize: {
      // parchment: Quill.import('parchment'), // quill-image-resize-module-react에서는 이 줄이 없어도 잘 동작하는 경우가 많습니다.
      modules: ['Resize', 'DisplaySize', 'Toolbar'], // 원하는 기능만 선택할 수 있습니다 (예: Resize만)
      // 핸들 스타일, 툴바 스타일 등도 여기서 커스터마이징 가능합니다.
      // 예: handles: 'all' (모든 핸들) 또는 ['nw', 'ne', 'se', 'sw'] (특정 핸들만)
      // displayStyles: {
      //   backgroundColor: 'black',
      //   border: 'none',
      //   color: 'white'
      // },
      // handleStyles: {
      //   backgroundColor: 'black',
      //   border: 'none',
      //   color: 'white',
      //   // width, height 등
      // },
      // toolbarStyles: {
      //   // 이미지 선택 시 나타나는 툴바 스타일
      // }
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
        </div>
      </div>

      <div className={showPreview ? 'flex flex-row gap-8' : 'flex justify-center'}>
        <div className="quill-editor-container" style={{ width: showPreview ? '50%' : '100%' }}>
          <h2 className="text-xl font-semibold mb-2">Quill Editor</h2>
          <ReactQuill
            ref={quillRef}
            value={value}
            onChange={handleChange}
            theme="snow"
            modules={modules} // 업데이트된 modules 객체를 전달합니다.
            formats={[
              'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
              'header', 'list', 'script', 'indent', 'direction', 'size', 'color',
              'background', 'font', 'align', 'clean', 'image',
              // imageResize 모듈이 사용하는 'width', 'height', 'style' 등의 포맷도 허용될 수 있도록
              // 명시적으로 추가하거나, Quill의 기본 동작에 맡길 수 있습니다.
              // 보통은 별도로 추가하지 않아도 잘 동작합니다.
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
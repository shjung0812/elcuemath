import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ReactQuill, { Quill } from "react-quill";
const Delta = Quill.import("delta");
type MyDeltaType = InstanceType<typeof Delta>; // Delta 클래스의 인스턴스 타입을 얻습니다.
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import ImageResize from "quill-image-resize-module-react";

import {
  Content,
  FetchSuccessResponse,
  SaveContentOptions,
} from "../../common/types/commonTypes";

import { fetchWithOutCSRF } from "../../common/utils/requests";

// Quill에 ImageResize 모듈을 등록합니다.
Quill.register("modules/imageResize", ImageResize);

const AUTO_SAVE_DEBOUNCE_DELAY = 1500; // 1.5 seconds

function App(): React.ReactElement {
  // 함수 컴포넌트의 반환 타입 지정

  const [value, setValue] = useState<string>(""); // Quill 에디터 내용 (HTML 문자열)
  const [title, setTitle] = useState<string>(""); // 콘텐츠 제목
  const [showPreview, setShowPreview] = useState<boolean>(false); // 미리보기 패널 토글
  const [contents, setContents] = useState<Content[]>([]); // 저장된 모든 콘텐츠 목록
  const [editingContentId, setEditingContentId] = useState<
    string | number | null
  >(null); // 편집 중인 콘텐츠 ID
  const [previewHtmlContents, setPreviewHtmlContents] = useState<
    { id: string | number; html: string }[]
  >([]);
  // const [isAutoSaving, setIsAutoSaving] = useState(false); // 자동 저장 중 상태 - 이 상태는 autoSaveStatus로 대체됩니다.

  // Debounce 타이머 Ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 자동 저장 중 상태 및 메시지
  const [autoSaveStatus, setAutoSaveStatus] = useState<{
    isSaving: boolean;
    message: string;
  }>({ isSaving: false, message: "저장 대기 중" });
  // 마지막으로 성공적으로 자동 저장된 Delta를 추적 (불필요한 저장 방지)
  const lastAutoSavedDataRef = useRef<{
    delta: MyDeltaType | null;
    title: string | null;
  } | null>(null);

  // QuillRef는 HTMLDivElement 또는 ReactQuill 인스턴스를 참조할 수 있으므로 타입을 명확히 지정
  const quillRef = useRef<ReactQuill | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null); // 미리보기 div 참조

  // Race Condition 방지를 위한 Refs
  const isCreatingRef = useRef(false);
  const editingContentIdRef = useRef<string | number | null>(null);

  // editingContentId가 변경될 때마다 Ref도 동기화
  useEffect(() => {
    editingContentIdRef.current = editingContentId;
  }, [editingContentId]);

  // Quill 에디터 내용 변경을 처리합니다.
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    setAutoSaveStatus({ isSaving: false, message: "변경 사항 감지됨..." });
  }, []);

  // 제목 입력 필드 변경을 처리합니다.
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      setAutoSaveStatus({ isSaving: false, message: "변경 사항 감지됨..." });
    },
    []
  );

  // 미리보기 패널의 가시성을 토글합니다.
  const togglePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  const convertDeltaToHtml = useCallback((deltaInput: string) => {
    if (!deltaInput) {
      return "<p>내용 없음</p>";
    }

    try {
      const converter = new QuillDeltaToHtmlConverter(
        new Delta(JSON.parse(deltaInput)).ops,
        {}
      );

      return converter.convert();
    } catch (e) {
      console.error("Error converting Delta to HTML:", e);
      return "<p>내용을 불러오는 데 실패했습니다.</p>";
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
        alert("텍스트가 클립보드에 복사되었습니다.");
      } catch (err: any) {
        // 에러 타입 명시
        console.error("텍스트 복사에 실패했습니다.", err);
        alert("텍스트 복사에 실패했습니다. 브라우저 설정을 확인해주세요.");
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

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null; // null 체크 추가
      if (file && quillRef.current) {
        try {
          const imageUrl: string =
            "https://placehold.co/600x400/FF5733/FFFFFF?text=Placeholder+Image"; // 예시 플레이스홀더 이미지

          const currentEditor = quillRef.current.getEditor();
          currentEditor.focus(); // 삽입 전에 에디터에 포커스
          let rangeToUse = savedRange;
          if (!rangeToUse) {
            rangeToUse = currentEditor.getSelection(); // 저장된 선택 범위가 없으면 현재 선택 범위 가져오기
          }
          const insertAtIndex: number = rangeToUse
            ? rangeToUse.index
            : currentEditor.getLength(); // 선택 범위 또는 끝에 삽입
          currentEditor.insertEmbed(insertAtIndex, "image", imageUrl, "user"); // 이미지 삽입
          currentEditor.setSelection(insertAtIndex + 1, 0); // 삽입된 이미지 뒤로 커서 이동

          // 새로운 HTML 내용으로 React 상태 업데이트
          handleChange(currentEditor.root.innerHTML);
        } catch (error: any) {
          // 에러 타입 명시
          console.error("이미지 업로드 또는 삽입 실패:", error);
          alert(`이미지 처리 중 오류가 발생했습니다: ${error.message}`);
        }
      }
    };
  }, [handleChange]);

  const fetchContents = useCallback(async () => {
    try {
      const result: FetchSuccessResponse = (await fetchWithOutCSRF({
        url: "/contents/getwriting",
        method: "get",
      })) as FetchSuccessResponse;

      if (result.success) {
        const fetchedContents: Content[] = result.data;
        // Sort by updated_at or created_at descending
        fetchedContents.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
          const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
          return dateB - dateA;
        });
        setContents(fetchedContents); // 원본 Delta 객체를 포함하는 콘텐츠 스테이트 업데이트

        // fetchedContents를 순회하며 각 Delta를 HTML로 변환
        const convertedHtmls = fetchedContents.map((content) => ({
          id: content.id,
          html: convertDeltaToHtml(content.quill_content), // 헬퍼 함수 사용
        }));
        setPreviewHtmlContents(convertedHtmls); // 변환된 HTML 스테이트 업데이트
      } else {
        console.error("콘텐츠 불러오기 실패: 응답이 성공적이지 않습니다.");
        alert("콘텐츠 불러오기 실패: 서버 응답 오류.");
      }
    } catch (error: any) {
      console.error("콘텐츠 불러오기 중 오류 발생:", error);
      alert("콘텐츠 불러오기 중 네트워크 오류가 발생했습니다.");
    }
  }, [convertDeltaToHtml]); // convertDeltaToHtml이 의존성이므로 포함

  // handleNewPost 함수 수정
  const handleNewPost = useCallback(() => {
    setTitle("");
    setValue("");
    setEditingContentId(null);
    editingContentIdRef.current = null; // Ref도 초기화
    lastAutoSavedDataRef.current = null; // 새 글 작성 시 마지막 저장 Delta 초기화
    setAutoSaveStatus({ isSaving: false, message: "저장 대기 중" }); // 상태 초기화
  }, []);

  // 콘텐츠 저장 또는 업데이트를 처리합니다 (Delta 형식).
  const saveOrUpdateContent = async ({
    title,
    delta,
    editingContentId,
  }: SaveContentOptions): Promise<FetchSuccessResponse> => {
    const requestBody = {
      title: title,
      delta: delta,
    };

    try {
      let response: Response | FetchSuccessResponse;

      if (editingContentId) {
        response = await fetchWithOutCSRF({
          url: `/contents/handlesavedelta/${editingContentId}`,
          method: "put",
          body: requestBody,
        });
      } else {
        response = await fetchWithOutCSRF({
          url: "/contents/savewriting",
          method: "post",
          body: requestBody,
        });
      }

      if (response instanceof Response) {
        const result = await response.json();
        if (response.ok) {
          return {
            success: true,
            message: `Delta 데이터가 성공적으로 ${editingContentId ? "업데이트" : "저장"
              }되었습니다.`,
            data: result.data || result,
          };
        } else {
          return {
            success: false,
            message: result.message || response.statusText,
            data: result,
          };
        }
      } else if ("success" in response) {
        if (response.success) {
          return {
            success: true,
            message: `Delta 데이터가 성공적으로 ${editingContentId ? "업데이트" : "저장"
              }되었습니다.`,
            data: response.data,
          };
        } else {
          return {
            success: false,
            message: response.message || "알 수 없는 오류",
            data: response.data,
          };
        }
      } else {
        // 예상치 못한 응답 형식 처리
        return {
          success: false,
          message: "알 수 없는 응답 형식",
          data: response,
        };
      }
    } catch (error: any) {
      console.error("Delta 데이터 저장/업데이트 중 오류 발생:", error);
      return {
        success: false,
        message: "Delta 데이터 저장/업데이트 중 네트워크 오류가 발생했습니다.",
      };
    }
  };

  // handleSaveDelta 함수 수정 (주석 처리됨)
  // const handleSaveDelta = useCallback(async () => {
  //     if (!quillRef.current) {
  //         console.error("Quill editor instance not available.");
  //         alert('Quill 에디터 인스턴스를 찾을 수 없습니다.');
  //         return;
  //     }

  //     if (!title.trim()) {
  //         alert('제목을 입력해주세요.');
  //         return;
  //     }

  //     const editor = quillRef.current.getEditor();
  //     const delta = editor.getContents();

  //     setAutoSaveStatus({ isSaving: true, message: '수동 저장 중...' }); // 수동 저장 시작 알림
  //     const result: FetchSuccessResponse = await saveOrUpdateContent({
  //         title: title,
  //         delta: delta,
  //         editingContentId: editingContentId
  //     });
  //     // 수동 저장 결과에 따라 상태 업데이트
  //     setAutoSaveStatus({ isSaving: false, message: result.success ? '수동 저장 완료' : '수동 저장 실패' });

  //     if (result.success) {
  //         alert(result.message);
  //         console.log('Delta 저장/업데이트 성공:', result.data);
  //         lastAutoSavedDeltaRef.current = delta; // 수동 저장 시에도 마지막 저장 Delta 업데이트
  //         fetchContents();
  //         handleNewPost();
  //     } else {
  //         console.error('Delta 데이터 저장/업데이트 실패:', result.data);
  //         alert(`Delta 데이터 저장/업데이트에 실패했습니다: ${result.message}`);
  //     }
  // }, [title, editingContentId, saveOrUpdateContent, fetchContents, handleNewPost]);

  // Perform Save Function (Serial Queue Pattern)
  const performSave = async (currentTitle: string, currentDelta: any, currentId: string | number | null) => {
    // 1. 이미 저장 중이라면 스킵 (하지만 변경사항이 있으므로 나중에 다시 시도해야 함? - Debounce가 처리해줌)
    if (isCreatingRef.current) {
      console.log("이미 저장 프로세스 진행 중... 스킵");
      return;
    }

    isCreatingRef.current = true;
    setAutoSaveStatus({ isSaving: true, message: "자동 저장 중..." });

    try {
      const result = await saveOrUpdateContent({
        title: currentTitle,
        delta: currentDelta,
        editingContentId: currentId,
        isCreate: !currentId,
      });

      if (result.success) {
        console.log("자동 저장 성공:", result.data);
        const savedContent: Content = result.data;

        // 성공 시 상태 업데이트
        if (!currentId) {
          setEditingContentId(savedContent.id);
          editingContentIdRef.current = savedContent.id;
        }

        setContents(prevContents => {
          const index = prevContents.findIndex(c => c.id === savedContent.id);
          if (index !== -1) {
            const newContents = [...prevContents];
            newContents[index] = savedContent;
            newContents.sort((a, b) => { // 최신순 정렬 유지
              const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
              const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
              return dateB - dateA;
            });
            return newContents;
          } else {
            return [savedContent, ...prevContents];
          }
        });

        setPreviewHtmlContents(prev => {
          const newHtml = convertDeltaToHtml(savedContent.quill_content);
          const index = prev.findIndex(p => p.id === savedContent.id);
          if (index !== -1) {
            const newPreviews = [...prev];
            newPreviews[index] = { id: savedContent.id, html: newHtml };
            return newPreviews;
          } else {
            return [{ id: savedContent.id, html: newHtml }, ...prev];
          }
        });

        lastAutoSavedDataRef.current = {
          delta: currentDelta,
          title: currentTitle,
        };
        setAutoSaveStatus({
          isSaving: false,
          message: `자동 저장됨: ${new Date().toLocaleTimeString()}`,
        });

      } else {
        console.error("자동 저장 실패:", result.data);
        setAutoSaveStatus({
          isSaving: false,
          message: `자동 저장 실패: ${result.message || "알 수 없는 오류"}`,
        });
      }
    } catch (e) {
      console.error("Save Error", e);
      setAutoSaveStatus({ isSaving: false, message: "오류 발생" });
    } finally {
      isCreatingRef.current = false;
    }
  };

  // 자동 저장 debounce 로직
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      // 1. 유효성 검사
      if (!quillRef.current || !title.trim()) {
        setAutoSaveStatus({ isSaving: false, message: "저장 대기 중" });
        return;
      }

      const currentDelta = quillRef.current.getEditor().getContents();
      const currentTitle = title;

      // 2. Ref에서 최신 ID 가져오기
      let currentId = editingContentIdRef.current;

      // 3. 변경 사항 확인
      const hasDeltaChanged =
        JSON.stringify(currentDelta) !==
        JSON.stringify(lastAutoSavedDataRef.current?.delta);
      const hasTitleChanged =
        currentTitle !== lastAutoSavedDataRef.current?.title;

      if (!hasDeltaChanged && !hasTitleChanged && lastAutoSavedDataRef.current !== null) {
        return;
      }

      // 4. 저장 실행
      performSave(currentTitle, currentDelta, currentId);

    }, AUTO_SAVE_DEBOUNCE_DELAY);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, value, editingContentId]);


  // handleEditContent 함수 수정
  const handleEditContent = useCallback((content: Content) => {
    setTitle(content.title);
    // 백엔드에서 받은 quill_content가 JSON string 형태라고 가정하고 Delta로 변환
    const deltaToLoad = new Delta(JSON.parse(content.quill_content));

    // ReactQuill에 Delta 객체를 직접 설정
    quillRef.current?.getEditor().setContents(deltaToLoad);
    // ReactQuill의 'value' prop은 HTML string을 기대하므로, Delta를 HTML로 변환하여 value 상태 업데이트
    setValue(quillRef.current?.getEditor().root.innerHTML || "");
    setEditingContentId(content.id);

    // 편집 시작 시, 불러온 Delta를 마지막 저장 Delta로 설정
    lastAutoSavedDataRef.current = deltaToLoad;
    setAutoSaveStatus({ isSaving: false, message: "저장 대기 중" }); // 상태 초기화
  }, []);

  // 콘텐츠 항목을 삭제합니다.
  const handleDeleteContent = useCallback(
    async (id: string | number) => {
      if (!window.confirm("정말로 이 콘텐츠를 삭제하시겠습니까?")) {
        return;
      }
      try {
        const response = await fetchWithOutCSRF({
          url: `/contents/deletewriting/${id}`,
          method: "delete",
        });

        // fetchWithOutCSRF가 Promise<Response>를 반환할 경우
        if (response instanceof Response && response.ok) {
          alert("콘텐츠가 성공적으로 삭제되었습니다.");
          fetchContents();
          if (editingContentId === id) {
            handleNewPost();
          }
        } else if ("success" in response && response.success) {
          // fetchWithOutCSRF가 Promise<FetchSuccessResponse>를 반환할 경우
          alert("콘텐츠가 성공적으로 삭제되었습니다.");
          fetchContents();
          if (editingContentId === id) {
            handleNewPost();
          }
        } else {
          // 오류 처리
          const errorData =
            response instanceof Response ? await response.json() : response;
          console.error("콘텐츠 삭제 실패:", errorData);
          alert(
            `콘텐츠 삭제 실패: ${errorData.message ||
            (response instanceof Response
              ? response.statusText
              : "알 수 없는 오류")
            }`
          );
        }
      } catch (error: any) {
        // 에러 타입 명시
        console.error("콘텐츠 삭제 중 오류 발생:", error);
        alert("콘텐츠 삭제 중 네트워크 오류가 발생했습니다.");
      }
    },
    [editingContentId, fetchContents, handleNewPost]
  );

  // Quill 에디터 모듈 구성
  const modules = useMemo(
    () => ({
      // React.useMemo 대신 useMemo 직접 사용
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
          ["image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    [imageHandler]
  );

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // 미리보기를 위한 MathJax 조판
  useEffect(() => {
    // window 객체에 MathJax가 존재함을 알리는 타입 단언
    if ((window as any).MathJax && showPreview && previewRef.current) {
      // MathJax의 typesetPromise 메서드 호출
      (window as any).MathJax.typesetPromise([previewRef.current]).catch(
        (err: any) => console.log("MathJax typesetting error:", err)
      );
    }
  }, [value, showPreview]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased overflow-hidden">
      {/* Left Sidebar: Saved Contents List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-20">
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            저장된 글
          </h3>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition duration-200"
            onClick={handleNewPost}
          >
            새 글
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {contents.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">
              저장된 글이 없습니다.
            </p>
          ) : (
            contents.map((content) => {
              const previewHtml =
                previewHtmlContents.find((p) => p.id === content.id)?.html ||
                "<p>로딩 중...</p>";

              return (
                <div
                  key={content.id}
                  className={`group relative border-b border-gray-100 p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${editingContentId === content.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                  onClick={() => handleEditContent(content)}
                >
                  <h4 className="font-semibold text-gray-900 mb-1 truncate text-sm pr-10">
                    {content.title || "제목 없음"}
                  </h4>
                  <div
                    className="text-gray-500 text-xs line-clamp-1 h-4 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  ></div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteContent(content.id); }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs bg-white/80 hover:bg-red-50 px-2 py-0.5 rounded border border-gray-200 hover:border-red-200 transition-all duration-200 shadow-sm"
                  >
                    삭제
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Main Area: Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-white p-4 shadow-sm z-10 border-b border-gray-200 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              id="contentTitle"
              className="flex-1 text-xl font-bold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent border-b-2 border-transparent focus:border-blue-500 transition-colors py-1"
              placeholder="제목을 입력하세요..."
              value={title}
              onChange={handleTitleChange}
            />

            <div className="flex items-center gap-2">
              {/* Status Message */}
              <span className="text-xs text-gray-500 mr-2 flex items-center">
                {autoSaveStatus.isSaving && <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></span>}
                {autoSaveStatus.message}
              </span>

              <button
                type="button"
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-1.5 px-3 rounded-md text-sm transition-colors"
                onClick={copyToPlainText}
              >
                텍스트 복사
              </button>
              <button
                type="button"
                className={`font-medium py-1.5 px-3 rounded-md text-sm transition-colors border ${showPreview ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                onClick={togglePreview}
              >
                {showPreview ? "미리보기 끄기" : "미리보기"}
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            <div className={`flex flex-col ${showPreview ? "lg:flex-row" : ""} gap-6 h-full min-h-[500px]`}>
              {/* Editor */}
              <div className={`flex flex-col ${showPreview ? "lg:w-1/2" : "w-full"} bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden`}>
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center">
                  <h2 className="text-sm font-semibold text-gray-600">에디터</h2>
                </div>
                <ReactQuill
                  ref={quillRef}
                  value={value}
                  onChange={handleChange}
                  theme="snow"
                  modules={modules}
                  formats={[
                    "bold", "italic", "underline", "strike", "blockquote", "code-block",
                    "header", "list", "script", "indent", "direction", "size",
                    "color", "background", "font", "align", "clean", "image",
                  ]}
                  className="flex-1 flex flex-col"
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                />
                {/* ReactQuill customization note: .ql-container should use flex-1 */}
                <style>{`
                            .quill { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
                            .ql-container { flex: 1; overflow-y: auto; font-size: 1.1rem; }
                            .ql-editor { min-height: 100%; }
                         `}</style>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="lg:w-1/2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center">
                    <h2 className="text-sm font-semibold text-gray-600">미리보기</h2>
                  </div>
                  <div
                    ref={previewRef}
                    className="flex-1 p-5 overflow-auto prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: value }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import io from 'socket.io-client';

const SharedCanvas = forwardRef(({ roomId, width = 800, height = 600, isActive = true, socket: propSocket, userRole = 'student', fixedWidth, fixedHeight }, ref) => {
    // 캔버스 Refs
    const teacherCanvasRef = useRef(null);
    const studentCanvasRef = useRef(null);
    const tempCanvasRef = useRef(null);

    // Context Refs
    const teacherCtxRef = useRef(null);
    const studentCtxRef = useRef(null);
    const tempCtxRef = useRef(null);

    const socketRef = useRef(null);
    const contentRef = useRef(null);
    const lastRemotePos = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [problemContent, setProblemContent] = useState({ text: null, image: null });

    // Pen Color State
    const [penColor, setPenColor] = useState('white'); // Default White
    const [isEraser, setIsEraser] = useState(false);
    const [lineWidthScale, setLineWidthScale] = useState(1);

    // Mentor Mode State
    // activeLayer: 'teacher' | 'temp' | 'student' (for erasing student work)
    const [activeLayer, setActiveLayer] = useState('teacher');

    // MathJax 렌더링 함수
    const typesetMath = useCallback(() => {
        if (window.MathJax?.typesetPromise && contentRef.current) {
            window.MathJax.typesetPromise([contentRef.current]).catch(err => console.error('MathJax error:', err));
        }
    }, []);

    // 텍스트/이미지 변경 시 MathJax 실행
    useEffect(() => {
        typesetMath();
    }, [problemContent, typesetMath]);

    useImperativeHandle(ref, () => ({
        showProblem: (data) => {
            setProblemContent(data);
            emitData({ type: 'problem_content', content: data });
        },
        addImage: (url) => {
            const data = { text: null, image: url };
            setProblemContent(data);
            emitData({ type: 'problem_content', content: data });
        },
        clearCanvas: () => {
            // Clear all canvases
            if (teacherCtxRef.current) teacherCtxRef.current.clearRect(0, 0, width, height);
            if (studentCtxRef.current) studentCtxRef.current.clearRect(0, 0, width, height);
            if (tempCtxRef.current) tempCtxRef.current.clearRect(0, 0, width, height);

            setProblemContent({ text: null, image: null });
            emitData({ type: 'clear' });
        }
    }));

    // 소켓 전송 공통 함수
    const emitData = (payload) => {
        if (socketRef.current?.connected) {
            // Add sender ID to payload to filter echo
            const dataWithId = { ...payload, from: socketRef.current.id };
            socketRef.current.emit('canvpos', { roomid: roomId, data: dataWithId });
        }
    };

    // 소켓 초기화 및 이벤트 바인딩
    useEffect(() => {
        const socket = propSocket || io('/draw', {
            transports: ['polling', 'websocket'],
            upgrade: true,
            reconnection: true
        });

        socketRef.current = socket;

        const onConnect = () => {
            setIsConnected(true);
            if (roomId) socket.emit('joinRoom', roomId);
        };

        const onCanvPos = (data) => {
            if (!data?.data) return;
            const { type, content, url, layer, color, from, isEraser: remoteIsEraser } = data.data;

            // Ignore events sent by self to prevent flickering/overwriting local state
            if (from === socket.id) return;

            if (type === 'problem_content') setProblemContent(content);
            else if (type === 'clear') {
                if (teacherCtxRef.current) teacherCtxRef.current.clearRect(0, 0, width, height);
                if (studentCtxRef.current) studentCtxRef.current.clearRect(0, 0, width, height);
                if (tempCtxRef.current) tempCtxRef.current.clearRect(0, 0, width, height);
                setProblemContent({ text: null, image: null });
            }
            else if (type === 'clear_layer') {
                // Clear specific layer based on the 'layer' property from server
                if (layer === 'teacher' && teacherCtxRef.current) teacherCtxRef.current.clearRect(0, 0, width, height);
                if (layer === 'student' && studentCtxRef.current) studentCtxRef.current.clearRect(0, 0, width, height);
                if (layer === 'temp' && tempCtxRef.current) tempCtxRef.current.clearRect(0, 0, width, height);
            }
            else if (type === 'image') setProblemContent({ text: null, image: url });
            else drawRemoteLine({ ...data.data, color, isEraser: remoteIsEraser });
        };

        socket.on('connect', onConnect);
        socket.on('canvpos', onCanvPos);
        socket.on('disconnect', () => setIsConnected(false));

        if (socket.connected) onConnect();

        return () => {
            socket.off('connect', onConnect);
            socket.off('canvpos', onCanvPos);
            socket.off('disconnect');
            if (!propSocket) socket.disconnect();
        };
    }, [roomId, propSocket, width, height, userRole]);

    // 캔버스 설정
    useEffect(() => {
        const initCanvas = (ref, ctxRef, color = 'black') => {
            const canvas = ref.current;
            if (canvas) {
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.lineCap = 'round';
                ctx.strokeStyle = color;
                ctx.lineWidth = 2 * lineWidthScale;
                ctxRef.current = ctx;
            }
        };

        // Initialize with defaults (dynamic colors handle actual drawing)
        initCanvas(teacherCanvasRef, teacherCtxRef, 'white');
        // Student also draws White locally (translated to Blue remotely)
        initCanvas(studentCanvasRef, studentCtxRef, 'white');
        initCanvas(tempCanvasRef, tempCtxRef, '#00E676');

    }, [width, height, userRole]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!e.shiftKey) return;

            // 1. Color Shortcuts (Shift + 1-6) - Available to ALL
            // Use e.code to handle Shift+Number correctly
            switch (e.code) {
                case 'Digit1': setPenColor('black'); setIsEraser(false); return;
                case 'Digit2': setPenColor('red'); setIsEraser(false); return;
                case 'Digit3': setPenColor('blue'); setIsEraser(false); return;
                case 'Digit4': setPenColor('yellow'); setIsEraser(false); return;
                case 'Digit5': setPenColor('pink'); setIsEraser(false); return;
                case 'Digit6': setPenColor('orange'); setIsEraser(false); return;
                case 'Equal': setLineWidthScale(prev => prev * 2); return; // Shift + + (Double width)
                case 'Minus': setLineWidthScale(prev => Math.max(0.25, prev / 2)); return; // Shift + - (Halve width)
            }

            // 2. Eraser Shortcuts (Shift + q) - Available to ALL
            if (e.code === 'KeyQ') {
                setIsEraser(true);
                setLineWidthScale(1); // Reset width
                if (userRole === 'mentor') setActiveLayer('teacher'); // Mentor default erase: Teacher Layer
                return;
            }

            // 3. Functional Shortcuts (Modes/Pens)
            if (e.code === 'KeyS') {
                // Shift + s: Main Pen (White)
                setPenColor('white');
                setIsEraser(false);
                setLineWidthScale(1); // Reset width
                if (userRole === 'mentor') {
                    setActiveLayer('teacher');
                    // Clear Temp Canvas (Auto-clear when switching back to main)
                    if (tempCtxRef.current) tempCtxRef.current.clearRect(0, 0, width, height);
                    emitData({ type: 'clear_layer', layer: 'temp' });
                }
            }
            else if (e.code === 'KeyR') {
                // Shift + r: Sub Pen (Red)
                setPenColor('red');
                setIsEraser(false);
                setLineWidthScale(1); // Reset width
                if (userRole === 'mentor') {
                    setActiveLayer('teacher');
                }
            }

            // 4. Mentor Exclusive Shortcuts
            if (userRole === 'mentor') {
                if (e.code === 'KeyY') {
                    // Shift + y: Aux Layer (Green)
                    setActiveLayer('temp');
                    setPenColor('#00E676'); // Bright Green
                    setIsEraser(false);
                    setLineWidthScale(1); // Reset width
                }
                else if (e.code === 'KeyT') {
                    // Shift + t: Erase Student Layer
                    setIsEraser(true);
                    setLineWidthScale(1); // Reset width
                    setActiveLayer('student');
                }
                else if (e.code === 'KeyE') {
                    // Shift + e: Clear Teacher Layer
                    if (teacherCtxRef.current) teacherCtxRef.current.clearRect(0, 0, width, height);
                    emitData({ type: 'clear_layer', layer: 'teacher' });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [userRole, width, height, roomId, activeLayer]);


    const getMousePos = (e, canvasRef) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / (rect.width / width),
            y: (e.clientY - rect.top) / (rect.height / height)
        };
    };

    const drawRemoteLine = (data) => {
        let ctx = null;

        // Select context based on the 'layer' property in data
        if (data.layer === 'teacher') ctx = teacherCtxRef.current;
        else if (data.layer === 'student') ctx = studentCtxRef.current;
        else if (data.layer === 'temp') ctx = tempCtxRef.current;

        if (!ctx) return;

        // Apply Eraser or Color Settings
        // Use remote lineWidth if provided, otherwise fallback to defaults
        const currentLineWidth = data.lineWidth || (data.isEraser ? 20 : 2);

        if (data.isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = currentLineWidth;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = currentLineWidth;
            const strokeColor = data.color || 'white';
            ctx.strokeStyle = strokeColor;
        }

        if (data.type === 'start') {
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
            lastRemotePos.current = { x: data.x, y: data.y };
        } else if (data.type === 'drag') {
            if (!lastRemotePos.current) ctx.beginPath();
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
            lastRemotePos.current = { x: data.x, y: data.y };
        } else if (data.type === 'end') {
            ctx.closePath();
            lastRemotePos.current = null;
            // Reset context to default
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = 2 * lineWidthScale; // Maintain local scale
        }
    };

    const startDrawing = (e) => {
        if (!isActive) return;

        let targetCtx = null;
        let targetCanvas = null;
        let currentLayer = '';

        if (userRole === 'mentor') {
            if (activeLayer === 'teacher') {
                targetCtx = teacherCtxRef.current;
                targetCanvas = teacherCanvasRef;
                currentLayer = 'teacher';
            } else if (activeLayer === 'temp') {
                targetCtx = tempCtxRef.current;
                targetCanvas = tempCanvasRef;
                currentLayer = 'temp';
            } else if (activeLayer === 'student') {
                // Special case: Mentor Erasing Student Layer
                targetCtx = studentCtxRef.current;
                targetCanvas = studentCanvasRef;
                currentLayer = 'student';
            }
        } else {
            // Student always draws on student layer
            targetCtx = studentCtxRef.current;
            targetCanvas = studentCanvasRef;
            currentLayer = 'student';
        }

        if (!targetCtx || !targetCanvas) return;

        // Calculate current line width based on mode and scale
        const baseWidth = isEraser ? 20 : 2;
        const currentLineWidth = baseWidth * lineWidthScale;

        // Apply Eraser or Pen Settings
        if (isEraser) {
            targetCtx.globalCompositeOperation = 'destination-out';
            targetCtx.lineWidth = currentLineWidth;
        } else {
            targetCtx.globalCompositeOperation = 'source-over';
            targetCtx.lineWidth = currentLineWidth;
            targetCtx.strokeStyle = penColor;
        }

        const { x, y } = getMousePos(e, targetCanvas);
        targetCtx.beginPath();
        targetCtx.moveTo(x, y);
        setIsDrawing(true);

        // Emit start event with layer AND color
        // If color is 'white' (Main Pen), send as 'Bright Blue' (#00B0FF) to remote
        const colorToSend = penColor === 'white' ? '#00B0FF' : penColor;
        emitData({ x, y, type: 'start', layer: currentLayer, color: colorToSend, isEraser, lineWidth: currentLineWidth });
    };

    const draw = (e) => {
        if (!isActive || !isDrawing) return;

        let targetCtx = null;
        let targetCanvas = null;
        let currentLayer = '';

        if (userRole === 'mentor') {
            if (activeLayer === 'teacher') {
                targetCtx = teacherCtxRef.current;
                targetCanvas = teacherCanvasRef;
                currentLayer = 'teacher';
            } else if (activeLayer === 'temp') {
                targetCtx = tempCtxRef.current;
                targetCanvas = tempCanvasRef;
                currentLayer = 'temp';
            } else if (activeLayer === 'student') {
                targetCtx = studentCtxRef.current;
                targetCanvas = studentCanvasRef;
                currentLayer = 'student';
            }
        } else {
            targetCtx = studentCtxRef.current;
            targetCanvas = studentCanvasRef;
            currentLayer = 'student';
        }

        // Re-apply settings (safety)
        const baseWidth = isEraser ? 20 : 2;
        const currentLineWidth = baseWidth * lineWidthScale;

        if (isEraser) {
            targetCtx.globalCompositeOperation = 'destination-out';
            targetCtx.lineWidth = currentLineWidth;
        } else {
            targetCtx.globalCompositeOperation = 'source-over';
            targetCtx.lineWidth = currentLineWidth;
            targetCtx.strokeStyle = penColor;
        }

        const { x, y } = getMousePos(e, targetCanvas);
        targetCtx.lineTo(x, y);
        targetCtx.stroke();

        const colorToSend = penColor === 'white' ? '#00B0FF' : penColor;
        emitData({ x, y, type: 'drag', layer: currentLayer, color: colorToSend, isEraser, lineWidth: currentLineWidth });
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        let currentLayer = activeLayer;
        if (userRole === 'student') currentLayer = 'student';

        emitData({ type: 'end', layer: currentLayer });
    };

    // Helper for pointer events
    const getPointerEvents = (layer) => {
        if (!isActive) return 'none';
        if (userRole === 'student') {
            return layer === 'student' ? 'auto' : 'none';
        }
        // Mentor
        if (activeLayer === 'teacher') {
            return layer === 'teacher' ? 'auto' : 'none';
        } else {
            return layer === 'temp' ? 'auto' : 'none';
        }
    };

    // Helper for background styles
    const getBackgroundStyle = () => {
        const baseColor = '#1b5e20'; // Dark Green (Chalkboard)
        if (userRole === 'mentor') {
            return {
                backgroundColor: baseColor,
                // Lighter grid lines
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            };
        }
        return { backgroundColor: baseColor };
    };

    return (
        <div
            className="relative border border-gray-500 shadow-lg overflow-hidden"
            style={{
                ...getBackgroundStyle(),
                width: fixedWidth || '100%',
                height: fixedHeight || '100%'
            }}
        >
            {/* 1. Content Layer (Z-Index 0) */}
            <div ref={contentRef} className="absolute inset-0 z-0 flex p-12 pointer-events-none text-left">
                {problemContent.text && (
                    <div
                        className="text-white text-2xl font-sans leading-relaxed text-left"
                        style={{ width: problemContent.image ? '70%' : '100%' }}
                        dangerouslySetInnerHTML={{ __html: problemContent.text }}
                    />
                )}
                {problemContent.image && (
                    <div
                        className={`flex items-start ${problemContent.text ? 'justify-center pl-4' : 'justify-start'}`}
                        style={{ width: problemContent.text ? '30%' : '100%' }}
                    >
                        <img
                            src={problemContent.image}
                            alt="Problem"
                            className="max-w-full h-auto object-contain bg-white p-2 rounded"
                            onLoad={typesetMath}
                        />
                    </div>
                )}
            </div>

            {/* 2. Student Layer (Z-Index 10) */}
            <canvas
                ref={studentCanvasRef}
                onMouseDown={userRole === 'student' ? startDrawing : undefined}
                onMouseMove={userRole === 'student' ? draw : undefined}
                onMouseUp={userRole === 'student' ? endDrawing : undefined}
                onMouseLeave={userRole === 'student' ? endDrawing : undefined}
                className="cursor-crosshair block absolute inset-0 z-10"
                style={{
                    width: fixedWidth || '100%',
                    height: fixedHeight || '100%',
                    backgroundColor: 'transparent',
                    pointerEvents: getPointerEvents('student')
                }}
            />

            {/* 3. Teacher Layer (Z-Index 20) */}
            <canvas
                ref={teacherCanvasRef}
                onMouseDown={userRole === 'mentor' ? startDrawing : undefined}
                onMouseMove={userRole === 'mentor' ? draw : undefined}
                onMouseUp={userRole === 'mentor' ? endDrawing : undefined}
                onMouseLeave={userRole === 'mentor' ? endDrawing : undefined}
                className="cursor-crosshair block absolute inset-0 z-20"
                style={{
                    width: fixedWidth || '100%',
                    height: fixedHeight || '100%',
                    backgroundColor: 'transparent',
                    pointerEvents: getPointerEvents('teacher')
                }}
            />

            {/* 4. Temp Layer (Z-Index 30) - Shared Auxiliary Pen */}
            <canvas
                ref={tempCanvasRef}
                onMouseDown={userRole === 'mentor' ? startDrawing : undefined}
                onMouseMove={userRole === 'mentor' ? draw : undefined}
                onMouseUp={userRole === 'mentor' ? endDrawing : undefined}
                onMouseLeave={userRole === 'mentor' ? endDrawing : undefined}
                className="cursor-crosshair block absolute inset-0 z-30"
                style={{
                    width: fixedWidth || '100%',
                    height: fixedHeight || '100%',
                    backgroundColor: 'transparent',
                    pointerEvents: getPointerEvents('temp')
                }}
            />

            {!isActive && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-10 flex items-center justify-center pointer-events-none z-40">
                    <span className="text-gray-500 font-bold bg-white px-2 py-1 rounded opacity-50 shadow-sm">View Only</span>
                </div>
            )}
        </div>
    );
});

export default SharedCanvas;
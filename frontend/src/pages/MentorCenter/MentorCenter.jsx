import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import SharedCanvas from '../../components/SharedCanvas';

const MentorCenter = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [activeStudent, setActiveStudent] = useState(null);
    const [students, setStudents] = useState([]); // List of connected students
    const [showStudentList, setShowStudentList] = useState(true); // Toggle for Session Control Panel
    const [cmsTree, setCmsTree] = useState([]); // CMS Hierarchical Data
    const [expandedNodes, setExpandedNodes] = useState({}); // Toggles for CMS Tree
    const [selectedR1, setSelectedR1] = useState(null); // Selected R1 Node
    const [problemDetails, setProblemDetails] = useState([]); // Problems for selected R1
    const [canvasDimensions, setCanvasDimensions] = useState({ width: '100%', height: '100%' }); // Fixed Canvas Dimensions


    // WebRTC State (NEW)
    const [drawSocket, setDrawSocket] = useState(null); // The Main Communication Socket
    const [isDrawSocketConnected, setIsDrawSocketConnected] = useState(false);

    // Legacy Socket (Presence Only - /vdrg)
    const [videoSocket, setVideoSocket] = useState(null);

    // Main Socket (Presence - /)
    const [mainSocket, setMainSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // List of [userid, peerid] from server

    // Calculate Fixed Canvas Size on Mount (16:9)
    useEffect(() => {
        const calculateFixedSize = () => {
            const padding = 32; // p-4 (16px * 2)
            const availableWidth = window.innerWidth - padding;
            const availableHeight = window.innerHeight - padding;

            let width = availableWidth;
            let height = width * (9 / 16);

            if (height > availableHeight) {
                height = availableHeight;
                width = height * (16 / 9);
            }

            console.log("Setting Fixed Canvas Size:", width, height);
            setCanvasDimensions({
                width: `${width}px`,
                height: `${height}px`
            });
        };

        calculateFixedSize();
        // Intentionally NO resize listener to keep size fixed effectively "freezing" it.
    }, []);

    // Fetch Initial Data (CMS Tree, Students)
    useEffect(() => {
        const fetchInitData = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/migration/mentor/init-data');
                if (!res.ok) throw new Error('Failed to fetch init data');
                const json = await res.json();

                console.log("Init Data:", json);

                setData(json);
                if (json.students) setStudents(json.students);
                if (json.cps) setCmsTree(json.cps);

                setLoading(false);
            } catch (err) {
                console.error("Init Error:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        fetchInitData();
    }, []);

    // Data Ref for Socket Listeners (Avoid Stale Closures)
    const dataRef = useRef(data);
    useEffect(() => { dataRef.current = data; }, [data]);

    // Initialize Video Socket on Mount
    const menteeSocketIdRef = useRef(null);
    const [menteeSocketId, setMenteeSocketId] = useState(null);

    // --- 1. Video Socket (/vdrg) Initialization ---
    useEffect(() => {
        const socket = io('/vdrg', {
            transports: ['polling', 'websocket'],
            path: '/socket.io'
        });
        setVideoSocket(socket);

        const onConnect = () => {
            console.log('Video Socket Connected:', socket.id);
            // Register
            const userData = dataRef.current;
            if (userData && userData.userinfo) {
                socket.emit('vdrgsocketidregister', {
                    socketid: socket.id,
                    username: userData.userinfo.username,
                    mentorid: userData.userinfo.username,
                    position: 3
                });
            }
        };

        const onReRegistrationCheck = (a) => {
            console.log('Reregistration Check:', a);
            if (a.menteesocketid) {
                menteeSocketIdRef.current = a.menteesocketid;
                setMenteeSocketId(a.menteesocketid);
                console.log("Mentee Socket ID Updated:", a.menteesocketid);
            }
            const userData = dataRef.current;
            if (userData && userData.userinfo) {
                socket.emit('vdrgreregistrationserviceresponse', {
                    socketid: socket.id,
                    username: userData.userinfo.username,
                    mentorid: userData.userinfo.username,
                    position: 'wrssmentor'
                });
            }
        };

        socket.on('connect', onConnect);
        socket.on('vdrgreregistrationservicecheck', onReRegistrationCheck);

        return () => {
            socket.off('connect', onConnect);
            socket.off('vdrgreregistrationservicecheck', onReRegistrationCheck);
            socket.disconnect();
        };
    }, []);

    // --- 2. Draw Socket (/draw) Initialization ---
    useEffect(() => {
        const socket = io('/draw', {
            transports: ['polling', 'websocket'],
            upgrade: true,
            reconnection: true
        });
        setDrawSocket(socket);

        socket.on('connect', () => {
            console.log('[Mentor] Draw Socket Connected:', socket.id);
            setIsDrawSocketConnected(true);
        });

        return () => {
            socket.disconnect();
            setIsDrawSocketConnected(false);
        };
    }, []);

    // --- 3. Main Socket (/) Initialization for Presence ---
    useEffect(() => {
        const socket = io('/', {
            transports: ['polling', 'websocket']
        });
        setMainSocket(socket);

        const onConnect = () => {
            console.log('[Mentor] Main Socket Connected');
            socket.emit('mucminitialstatus'); // Request initial list
        };

        const onMucmResIdSent = (data) => {
            // data.csts is array of [userid, peerid]
            console.log('[Mentor] Online Users Updated:', data.csts);
            setOnlineUsers(data.csts || []);
        };

        socket.on('connect', onConnect);
        socket.on('mucmresidsent', onMucmResIdSent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('mucmresidsent', onMucmResIdSent);
            socket.disconnect();
        };
    }, []);

    // Helper to check if student is online
    const isStudentOnline = (studentUsername) => {
        // onlineUsers is array of [username, peerid]
        return onlineUsers.some(user => user[0] === studentUsername);
    };

    // Filtered Students (Assigned AND Online)
    const activeStudents = students.filter(s => isStudentOnline(s.username));

    // --- Student Homework Data ---
    const [studentHomeworks, setStudentHomeworks] = useState({});
    const [studentClassHistory, setStudentClassHistory] = useState({}); // New: Class History (Blue Bar)
    const [expandedSolutions, setExpandedSolutions] = useState({}); // Toggle state for solution visibility
    const [homeworkDateRange, setHomeworkDateRange] = useState(3); // Default 3 days

    useEffect(() => {
        if (!activeStudent) {
            setStudentHomeworks({});
            setStudentClassHistory({});
            setExpandedSolutions({});
            return;
        }

        const fetchHomework = async () => {
            try {
                const daysParam = homeworkDateRange === 'all' ? 'all' : homeworkDateRange;
                const res = await fetch(`/api/migration/mentor/student-homework?studentId=${activeStudent.username}&days=${daysParam}`);
                if (res.ok) {
                    const json = await res.json();

                    // Process Homework (Red Bar)
                    const hwMap = {};
                    json.homeworks?.forEach(h => {
                        if (!hwMap[h.prbid]) {
                            hwMap[h.prbid] = [];
                        }
                        hwMap[h.prbid].push(h.mpicid);
                    });
                    setStudentHomeworks(hwMap);

                    // Process Class History (Blue Bar)
                    const classMap = {};
                    json.classHistory?.forEach(h => {
                        const cleanId = h.prbid ? h.prbid.trim() : '';
                        if (cleanId) classMap[cleanId] = true;
                    });
                    setStudentClassHistory(classMap);



                    // Reset expansions when data changes (optional, but safer)
                    setExpandedSolutions({});
                    console.log("Loaded student data - Homework:", Object.keys(hwMap).length, "Class:", Object.keys(classMap).length);
                }
            } catch (e) {
                console.error("Failed to fetch student homeworks:", e);
            }
        };

        fetchHomework();
    }, [activeStudent, homeworkDateRange]);

    const toggleSolutions = (prbid) => {
        setExpandedSolutions(prev => ({
            ...prev,
            [prbid]: !prev[prbid]
        }));
    };

    const getCounts = (r1) => {
        if (!r1.prblist) return { hw: 0, ch: 0 };
        const ids = r1.prblist.split(',').map(s => s.trim()).filter(s => s);
        let hw = 0;
        let ch = 0;
        ids.forEach(id => {
            if (studentHomeworks[id]) hw++;
            if (studentClassHistory[id]) ch++;
        });
        return { hw, ch };
    };

    const getR2Counts = (r2) => {
        let totalHw = 0;
        let totalCh = 0;
        if (r2.children) {
            r2.children.forEach(r1 => {
                const counts = getCounts(r1);
                totalHw += counts.hw;
                totalCh += counts.ch;
            });
        }
        return { hw: totalHw, ch: totalCh };
    };

    const getR3Counts = (r3) => {
        let totalHw = 0;
        let totalCh = 0;
        if (r3.children) {
            r3.children.forEach(r2 => {
                const counts = getR2Counts(r2);
                totalHw += counts.hw;
                totalCh += counts.ch;
            });
        }
        return { hw: totalHw, ch: totalCh };
    };

    // --- 4. Fetch Problems when R1 is selected ---
    useEffect(() => {
        if (!selectedR1) {
            setProblemDetails([]);
            return;
        }

        const fetchProblems = async () => {
            try {
                const res = await fetch(`/api/migration/mentor/problems?r1_id=${selectedR1.cptid}`);
                if (!res.ok) throw new Error('Failed to fetch problems');
                const json = await res.json();
                console.log('Fetched Problems:', json.problems);
                setProblemDetails(json.problems || []);
            } catch (err) {
                console.error('Error fetching problems:', err);
                setProblemDetails([]);
            }
        };

        fetchProblems();
    }, [selectedR1]);

    // MathJax Typesetting for Session Control (Problems & CMS Tree)
    useEffect(() => {
        if (window.MathJax?.typesetPromise) {
            window.MathJax.typesetPromise().catch(err => console.error('MathJax typeset error:', err));
        }
    }, [problemDetails, showStudentList, cmsTree, expandedNodes]);

    // Used for SharedCanvas
    const sharedCanvasRef = useRef(null);

    const handleSendProblem = async (problem) => {
        console.log("Sending problem:", problem);

        // Record history if a student is selected
        if (activeStudent) {
            try {
                await fetch('/api/migration/mentor/share-problem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: activeStudent.username,
                        problemId: problem.prbid
                    })
                });
            } catch (err) {
                console.error("Failed to record history:", err);
            }
        }

        if (sharedCanvasRef.current) {
            // Send to SharedCanvas (which emits to socket and updates local display)
            // Remove backticks (`), which wrap content in the legacy DB
            const cleanText = problem.prbkorean ? problem.prbkorean.replaceAll('`', '') : null;

            sharedCanvasRef.current.showProblem({
                text: cleanText,
                image: problem.prbpickor || null
            });
            setShowStudentList(false); // Auto-close session control
        }
    };

    // UI Helpers
    const toggleNode = (nodeId) => {
        setExpandedNodes(prev => ({
            ...prev,
            [nodeId]: !prev[nodeId]
        }));
    };

    // Keyboard Shortcuts (Shift + F)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
                console.log('Toggling Session Control');
                setShowStudentList(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden relative">
            {/* 1. Shared Canvas Layer - Centered & Fitted */}
            <div className="flex-1 relative z-10 flex items-center justify-center bg-gray-200 overflow-hidden p-4">
                <div
                    className="relative bg-white shadow-2xl"
                    style={{
                        ...canvasDimensions,
                        // Removed maxWidth/maxHeight to ensure size stays fixed even if window shrinks
                        overflow: 'hidden' // Optional: ensure content doesn't spill out visibly if something weird happens
                    }}
                >
                    <SharedCanvas
                        ref={sharedCanvasRef}
                        roomId={activeStudent ? activeStudent.username : 'waiting-room'}
                        userRole="mentor"
                        socket={drawSocket}
                        username={data?.userinfo?.username || 'Mentor'}
                        width={1920}
                        height={1080}
                        fixedWidth={canvasDimensions.width}
                        fixedHeight={canvasDimensions.height}
                    />
                </div>
            </div>


            {/* 2. Session Control Panel (Layer) - Toggled by Shift+F */}
            {
                showStudentList && (
                    <div className="absolute top-0 right-0 h-full w-[60%] bg-gray-900 bg-opacity-95 text-white border-l border-gray-700 shadow-2xl z-50 flex flex-col backdrop-blur-sm">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                            <h2 className="text-2xl font-bold text-purple-400">Session Control</h2>
                            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">Shift + F to close</span>
                        </div>

                        <div className="flex-1 overflow-hidden flex">

                            {/* LEFT COLUMN: Hierarchical CMS Browser */}
                            <div className="w-1/2 flex flex-col border-r border-gray-700 bg-gray-800/50">
                                <div className="p-4 border-b border-gray-700 bg-gray-800 font-bold text-gray-300">CMS Library</div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {cmsTree.map((r3) => (
                                        <div key={r3.r3id} className="space-y-1">
                                            {/* R3 Node */}
                                            <div
                                                className="font-bold text-yellow-500 cursor-pointer hover:bg-gray-700 p-1 rounded flex items-center transition-colors select-none"
                                                onClick={() => toggleNode(r3.r3id)}
                                            >
                                                <span className="mr-2 text-xs">{expandedNodes[r3.r3id] ? '▼' : '▶'}</span>
                                                {r3.listinfo}
                                                {(() => {
                                                    const counts = getR3Counts(r3);
                                                    if (counts.hw > 0 || counts.ch > 0) {
                                                        return (
                                                            <span className="text-xs ml-2 font-bold">
                                                                (<span className="text-red-400">{counts.hw}</span>
                                                                {counts.hw > 0 && counts.ch > 0 && ', '}
                                                                <span className="text-blue-400">{counts.ch}</span>)
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>

                                            {/* R2 Nodes */}
                                            {expandedNodes[r3.r3id] && r3.children && r3.children.map(r2 => (
                                                <div key={r2.r2id} className="ml-4 space-y-1">
                                                    {/* R2 Node */}
                                                    <div
                                                        className="font-semibold text-blue-300 cursor-pointer hover:bg-gray-700 p-1 rounded flex items-center text-sm transition-colors select-none"
                                                        onClick={() => toggleNode(`${r3.r3id}-${r2.r2id}`)}
                                                    >
                                                        <span className="mr-2 text-xs">{expandedNodes[`${r3.r3id}-${r2.r2id}`] ? '▼' : '▶'}</span>
                                                        {r2.r2listinfo?.replaceAll('`', '')}
                                                        {(() => {
                                                            const counts = getR2Counts(r2);
                                                            if (counts.hw > 0 || counts.ch > 0) {
                                                                return (
                                                                    <span className="text-xs ml-2 font-bold">
                                                                        (<span className="text-red-400">{counts.hw}</span>
                                                                        {counts.hw > 0 && counts.ch > 0 && ', '}
                                                                        <span className="text-blue-400">{counts.ch}</span>)
                                                                    </span>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                    </div>

                                                    {/* R1 Leaf Nodes */}
                                                    {expandedNodes[`${r3.r3id}-${r2.r2id}`] && r2.children && r2.children.map(r1 => (
                                                        <div
                                                            key={r1.cptid}
                                                            className={`ml-6 p-2 text-sm cursor-pointer rounded hover:bg-gray-700 border border-transparent transition-all select-none ${selectedR1 && selectedR1.cptid === r1.cptid ? 'bg-gray-700 border-purple-500 text-white' : 'text-gray-400'}`}
                                                            onClick={() => setSelectedR1(r1)}
                                                        >
                                                            {r1.listinfo?.replaceAll('`', '')}
                                                            {(() => {
                                                                const counts = getCounts(r1);
                                                                if (counts.hw > 0 || counts.ch > 0) {
                                                                    return (
                                                                        <span className="text-xs ml-2 font-bold">
                                                                            (<span className="text-red-400">{counts.hw}</span>
                                                                            {counts.hw > 0 && counts.ch > 0 && ', '}
                                                                            <span className="text-blue-400">{counts.ch}</span>)
                                                                        </span>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Context (Students & Problems) */}
                            <div className="w-1/2 flex flex-col h-full">

                                {/* TOP: Active Students */}
                                <div className="h-[20%] flex flex-col border-b border-gray-700">
                                    <h3 className="p-2 font-semibold text-xs text-gray-300 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                                        <span>Active Students ({activeStudents.length})</span>
                                        <select
                                            className="bg-gray-700 text-white text-[10px] rounded px-1 border border-gray-600 focus:outline-none focus:border-purple-500"
                                            value={homeworkDateRange}
                                            onChange={(e) => setHomeworkDateRange(e.target.value)}
                                        >
                                            <option value="1">1 Day</option>
                                            <option value="3">3 Days</option>
                                            <option value="7">7 Days</option>
                                            <option value="15">15 Days</option>
                                            <option value="30">30 Days</option>
                                            <option value="60">60 Days</option>
                                            <option value="90">90 Days</option>
                                            <option value="120">120 Days</option>
                                            <option value="180">180 Days</option>
                                            <option value="360">360 Days</option>
                                            <option value="all">All</option>
                                        </select>
                                    </h3>
                                    <div className="flex-1 overflow-y-auto p-1 space-y-1">
                                        {activeStudents.length > 0 ? (
                                            activeStudents.map((student, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => setActiveStudent(student)}
                                                    className={`p-1 px-2 cursor-pointer rounded border transition-all flex justify-between items-center ${activeStudent && activeStudent.username === student.username
                                                        ? 'bg-purple-900/50 border-purple-500'
                                                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <span className="font-bold text-xs">{student.DisplayName} ({student.username})</span>
                                                    <div className="flex items-center">
                                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${activeStudent && activeStudent.username === student.username ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                                                        <button
                                                            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const url = `/renv/mentor/call/${student.username}`;
                                                                console.log("Attempting to open:", url);
                                                                setActiveStudent(student);
                                                                const win = window.open(url, '_blank', 'width=1280,height=720,scrollbars=yes,resizable=yes');
                                                                if (!win) alert("Pop-up blocked! Please allow pop-ups for this site.");
                                                            }}
                                                        >
                                                            Connect
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-xs p-2 text-center">No active students found.</div>
                                        )}
                                    </div>
                                </div>

                                {/* BOTTOM: Problem List */}
                                <div className="flex-1 flex flex-col bg-gray-900/50 min-h-0">
                                    <h3 className="p-4 font-semibold text-gray-300 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                                        <span>Problem List</span>
                                        {selectedR1 && <span className="text-xs text-blue-400 max-w-[200px] truncate">{selectedR1.listinfo?.replaceAll('`', '')}</span>}
                                    </h3>
                                    <div className="flex-1 overflow-y-auto p-4 min-h-0">
                                        {selectedR1 ? (
                                            <div className="space-y-4">
                                                {problemDetails.length > 0 ? (
                                                    problemDetails.map((prob, idx) => {
                                                        const hasHomework = !!studentHomeworks[prob.prbid];
                                                        const hasClassHistory = !!studentClassHistory[prob.prbid];

                                                        // Fallback background for visual confirmation? No, use bottom bars.

                                                        return (
                                                            <div key={idx} className={`p-4 bg-gray-800 border border-gray-700 rounded text-sm hover:border-gray-500 transition-colors relative pb-6`}
                                                                onClick={() => handleSendProblem(prob)}
                                                            >
                                                                {/* Bars Container at Bottom */}
                                                                <div className="absolute bottom-0 left-0 right-0 h-2 flex">
                                                                    {/* Red Bar Indicator for Homework */}
                                                                    {hasHomework && (
                                                                        <div
                                                                            className={`h-full bg-red-500 cursor-pointer hover:bg-red-400 transition-colors ${hasClassHistory ? 'w-1/2' : 'w-full'} rounded-bl ${!hasClassHistory ? 'rounded-br' : ''}`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleSolutions(prob.prbid);
                                                                            }}
                                                                            title="Homework: Click to toggle solutions"
                                                                        ></div>
                                                                    )}

                                                                    {/* Blue Bar Indicator for Class History */}
                                                                    {hasClassHistory && (
                                                                        <div
                                                                            className={`h-full bg-blue-500 cursor-default transition-colors ${hasHomework ? 'w-1/2' : 'w-full'} rounded-br ${!hasHomework ? 'rounded-bl' : ''}`}
                                                                            title="Shared in Class"
                                                                        ></div>
                                                                    )}
                                                                </div>

                                                                <div className="flex justify-between items-start mb-2 group-hover:text-white">
                                                                    <span></span>
                                                                    <button
                                                                        className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500"
                                                                        onClick={(e) => { e.stopPropagation(); handleSendProblem(prob); }}
                                                                    >
                                                                        Send
                                                                    </button>
                                                                </div>

                                                                {/* Problem Text (HTML) */}
                                                                {prob.prbkorean && (
                                                                    <div
                                                                        className="text-gray-300 mb-2 prose prose-invert max-w-none text-sm pointer-events-none"
                                                                        dangerouslySetInnerHTML={{ __html: prob.prbkorean.replaceAll('`', '') }}
                                                                    />
                                                                )}

                                                                {/* Problem Image */}
                                                                {prob.prbpickor && (
                                                                    <div className="mt-2 text-center pointer-events-none">
                                                                        <img
                                                                            src={prob.prbpickor}
                                                                            alt={`Problem ${prob.prbid}`}
                                                                            className="max-w-full h-auto rounded border border-gray-600 mx-auto bg-white"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* Student Solution Images (Toggled) */}
                                                                {expandedSolutions[prob.prbid] && studentHomeworks[prob.prbid] && (
                                                                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                                                                        <div className="text-xs text-red-400 font-bold mb-2">Student Solutions ({studentHomeworks[prob.prbid].length}):</div>
                                                                        {studentHomeworks[prob.prbid].map((mpicid, i) => (
                                                                            <div key={i} className="bg-gray-900/50 p-2 rounded">
                                                                                <div className="text-[10px] text-gray-500 mb-1">Attempt {studentHomeworks[prob.prbid].length - i}</div>
                                                                                <img
                                                                                    src={`/usernote/mmcphomework/${mpicid}`}
                                                                                    alt={`Solution ${i + 1}`}
                                                                                    className="max-w-full h-auto rounded border border-red-500/50 mx-auto bg-white"
                                                                                    onError={(e) => {
                                                                                        e.target.style.display = 'none';
                                                                                        e.target.parentNode.innerHTML += '<span class="text-red-400 text-xs">Image load failed</span>';
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-gray-500">Loading problems or list is empty...</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 italic text-center mt-10">
                                                Select a category (R1) from the left to view problems.
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                )}
        </div>
    );
};

export default MentorCenter;

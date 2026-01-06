import React, { useEffect, useState, useRef } from 'react';
import SharedCanvas from '../../components/SharedCanvas';
import { io } from 'socket.io-client';

const StudentCenter = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: '100%', height: '100%' }); // Fixed Canvas Dimensions


    // WebRTC & Socket State
    const [drawSocket, setDrawSocket] = useState(null);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [callType, setCallType] = useState('video'); // 'video' | 'audio'
    const [callStatus, setCallStatus] = useState('idle'); // idle, connected

    // Streams & Refs
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const peerConnectionRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const pendingOfferRef = useRef(null);

    // Draggable Widget Refs
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const [videoWidgetPos, setVideoWidgetPos] = useState({
        x: window.innerWidth - 220,
        y: window.innerHeight - 150
    });

    // Video Widget Visibility State
    const [showVideoWidget, setShowVideoWidget] = useState(false);

    // Refs for safe access inside socket listeners
    const dataRef = useRef(data);
    const callTypeRef = useRef('video');

    // Calculate Fixed Canvas Size on Mount (16:9)
    useEffect(() => {
        const calculateFixedSize = () => {
            // Student might want full screen or with padding.
            // Using small padding to ensure it fits comfortably without scrollbars initially if possible
            const padding = 32;
            const availableWidth = window.innerWidth - padding;
            const availableHeight = window.innerHeight - padding;

            let width = availableWidth;
            let height = width * (9 / 16);

            if (height > availableHeight) {
                height = availableHeight;
                width = height * (16 / 9);
            }

            console.log("Setting Student Fixed Canvas Size:", width, height);
            setCanvasDimensions({
                width: `${width}px`,
                height: `${height}px`
            });
        };

        calculateFixedSize();
    }, []);


    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        callTypeRef.current = callType;
    }, [callType]);

    useEffect(() => {
        if (localStream || remoteStream) {
            setShowVideoWidget(true);
        }
    }, [localStream, remoteStream]);

    useEffect(() => {
        if (!drawSocket) return;

        const handleEndCall = () => {
            console.log('[Student] Call Ended by Mentor');
            // 1. Stop Streams immediately
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            setRemoteStream(null);
            setCallStatus('idle');

            // 2. Hide Widget UI immediately
            setShowVideoWidget(false);
        };

        drawSocket.on('end_call', handleEndCall);

        return () => {
            drawSocket.off('end_call', handleEndCall);
        };
    }, [drawSocket, localStream]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/migration/student/init-data');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                setData(result);
            } catch (e) {
                if (e.message.includes('401')) window.location.href = '/login';
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Initialize Draw Socket
    useEffect(() => {
        const socket = io('/draw', {
            transports: ['polling', 'websocket'],
            upgrade: true,
            reconnection: true
        });
        setDrawSocket(socket);

        socket.on('connect', () => {
            console.log('[Student] Draw Socket Connected');
        });

        return () => socket.disconnect();
    }, []);

    // --- Main Socket for Presence (Correct Implementation) ---
    useEffect(() => {
        const socket = io('/', {
            transports: ['polling', 'websocket']
        });

        socket.on('connect', () => {
            console.log('[Student] Main Socket Connected');
            if (data?.userinfo) {
                // Register presence
                socket.emit('mucmpeeridsent', {
                    userid: data.userinfo.username,
                    peerid: socket.id
                });
            }
        });

        return () => socket.disconnect();
    }, [data]);

    // --- WebRTC Signaling Logic (Dependent on drawSocket) ---
    useEffect(() => {
        if (!drawSocket) return;

        const autoAcceptCall = async (offerData) => {
            console.log('[Student] Auto-accepting call...');
            const userInfo = dataRef.current?.userinfo;
            if (!userInfo) {
                console.error('User info missing, cannot accept');
                return;
            }

            setCallStatus('connected');
            setIsIncomingCall(false);

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: callTypeRef.current === 'video',
                    audio: true
                });
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                peerConnectionRef.current = pc;

                stream.getTracks().forEach(track => pc.addTrack(track, stream));

                pc.ontrack = (event) => {
                    const remote = event.streams[0];
                    setRemoteStream(remote);
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
                };

                // Monitor Connection State
                pc.oniceconnectionstatechange = () => {
                    if (['disconnected', 'failed', 'closed'].includes(pc.iceConnectionState)) {
                        setCallStatus('idle');
                        stream.getTracks().forEach(track => track.stop());

                        if (peerConnectionRef.current) {
                            peerConnectionRef.current.close();
                            peerConnectionRef.current = null;
                        }
                        setRemoteStream(null);
                        setLocalStream(null);
                        setShowVideoWidget(false);
                    }
                };

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        drawSocket.emit('webrtc_signal', {
                            roomid: userInfo.username,
                            signal: { candidate: event.candidate }
                        });
                    }
                };

                // Set Remote Desc (Offer)
                await pc.setRemoteDescription(new RTCSessionDescription(offerData));

                // Create Answer
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                // Send Answer
                drawSocket.emit('webrtc_signal', {
                    roomid: userInfo.username,
                    signal: { type: 'answer', sdp: answer.sdp }
                });

            } catch (err) {
                console.error('Auto Accept Error:', err);
                setCallStatus('idle');
            }
        };

        const onWebrtcSignal = async (data) => {
            console.log('[Student] Received Signal:', data);
            if (data.type === 'offer') {
                console.log('[Student] Received Offer - Auto Accepting');
                pendingOfferRef.current = data;
                autoAcceptCall(data);
            } else if (data.candidate) {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
            }
        };

        const onCallRequest = (data) => {
            console.log('[Student] Incoming Call:', data);
            setCallType(data.type);
            callTypeRef.current = data.type;
            setIsIncomingCall(true); // Keeping state tracking for debug/future use
        };

        drawSocket.on('webrtc_signal', onWebrtcSignal);
        drawSocket.on('call_request', onCallRequest);

        return () => {
            drawSocket.off('webrtc_signal', onWebrtcSignal);
            drawSocket.off('call_request', onCallRequest);
        };
    }, [drawSocket]);

    // Attach streams to video elements when available/rendered
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, showVideoWidget]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, showVideoWidget]);

    // Effect to join room specifically when data is loaded and socket is ready
    useEffect(() => {
        if (drawSocket && data?.userinfo) {
            drawSocket.emit('joinRoom', data.userinfo.username);
        }
    }, [drawSocket, data]);


    if (loading) return <div className="p-4">Loading Student Center...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!data) return null;

    const { userinfo } = data;

    return (
        <div className="h-screen w-screen bg-cover bg-center overflow-hidden relative flex items-center justify-center" style={{ backgroundImage: 'url("/backgroundimage/milkyway.jpg")' }}>
            <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"></div>

            {/* Main Canvas Area */}
            <div
                className="relative bg-white shadow-2xl flex items-center justify-center"
                style={{
                    ...canvasDimensions,
                    overflow: 'hidden'
                }}
            >
                {userinfo && (
                    <SharedCanvas
                        roomId={userinfo.username}
                        userRole="student"
                        width={1920}
                        height={1080}
                        isActive={true}
                        socket={drawSocket}
                        fixedWidth={canvasDimensions.width}
                        fixedHeight={canvasDimensions.height}
                    />
                )}
            </div>



            {/* Video Widget (Identical to Mentor) */}
            {showVideoWidget && (
                <div
                    className="absolute z-40 bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-700 flex flex-col"
                    style={{
                        left: videoWidgetPos.x,
                        top: videoWidgetPos.y,
                        width: '200px',
                        cursor: 'move'
                    }}
                    onMouseDown={(e) => {
                        isDragging.current = true;
                        dragOffset.current = {
                            x: e.clientX - videoWidgetPos.x,
                            y: e.clientY - videoWidgetPos.y
                        };
                    }}
                    onMouseMove={(e) => {
                        if (isDragging.current) {
                            setVideoWidgetPos({
                                x: e.clientX - dragOffset.current.x,
                                y: e.clientY - dragOffset.current.y
                            });
                        }
                    }}
                    onMouseUp={() => isDragging.current = false}
                    onMouseLeave={() => isDragging.current = false}
                >
                    {/* Remote Video */}
                    <div className="relative bg-gray-900 aspect-video">
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white bg-gray-800 text-xs">
                                Call Ended
                            </div>
                        )}
                    </div>
                    {/* Local Video */}
                    {localStream && (
                        <div className="absolute bottom-2 right-2 w-14 h-8 bg-black border border-white rounded shadow">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentCenter;

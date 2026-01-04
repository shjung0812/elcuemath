import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import ConnectionModal from './ConnectionModal';

const MentorCallWindow = () => {
    const { studentId } = useParams(); // Retrieves the student's username/ID from URL
    const [drawSocket, setDrawSocket] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // Call State
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(true); // Open immediately

    // WebRTC Refs
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const peerConnectionRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);

    // Initialize Socket (/draw)
    useEffect(() => {
        const socket = io('/draw', {
            transports: ['polling', 'websocket'],
            upgrade: true,
            reconnection: true
        });
        setDrawSocket(socket);

        socket.on('connect', () => {
            console.log('[MentorCallWindow] Connected to /draw:', socket.id);
            setIsSocketConnected(true);
            if (studentId) {
                console.log('Joining room:', studentId);
                socket.emit('joinRoom', studentId);
            }
        });

        const handleBeforeUnload = () => {
            socket.emit('end_call', { roomid: studentId });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            socket.disconnect();
        };
    }, []);

    // Signaling Listener
    useEffect(() => {
        if (!drawSocket) return;

        const handleSignal = async (data) => {
            if (!peerConnectionRef.current) return;
            try {
                if (data.type === 'answer') {
                    console.log('Received Answer');
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
                } else if (data.candidate) {
                    console.log('Received Candidate');
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
            } catch (e) {
                console.error('Signaling Error:', e);
            }
        };

        drawSocket.on('webrtc_signal', handleSignal);
        return () => drawSocket.off('webrtc_signal', handleSignal);
    }, [drawSocket]);

    const startCall = async (type) => {
        if (!studentId || !drawSocket) {
            alert("Socket not ready or missing Student ID");
            return;
        }
        setCallStatus('calling');
        setIsConnectionModalOpen(false);

        try {
            // 1. Get User Media
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true
            });
            setLocalStream(stream);

            // 2. Create PeerConnection
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            peerConnectionRef.current = pc;

            // 3. Add Tracks
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            // 4. Remote Track Handler
            pc.ontrack = (event) => {
                const remote = event.streams[0];
                setRemoteStream(remote);
            };

            // 5. ICE Candidate Handler
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    drawSocket.emit('webrtc_signal', {
                        roomid: studentId,
                        signal: { candidate: event.candidate }
                    });
                }
            };

            // 6. Create Offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // 7. Send Call Request & Offer
            drawSocket.emit('call_request', { roomid: studentId, type });
            drawSocket.emit('webrtc_signal', {
                roomid: studentId,
                signal: { type: 'offer', sdp: offer.sdp }
            });

        } catch (err) {
            console.error('Failed to start call:', err);
            setCallStatus('idle');
            alert('Call failed: ' + err.message);
        }
    };

    const endCall = () => {
        if (studentId && drawSocket) {
            drawSocket.emit('end_call', { roomid: studentId });
        }

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

        // Re-open modal instead of closing window
        setIsConnectionModalOpen(true);
    };

    // Attach streams to video elements when available
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-900 text-white overflow-hidden relative">
            {/* Modal for initial selection */}
            <ConnectionModal
                isOpen={isConnectionModalOpen}
                onClose={() => window.close()}
                onSelect={startCall}
            />

            <div className="flex-1 relative bg-black flex items-center justify-center">
                {/* Remote Video (Main) */}
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="text-gray-500">
                        {callStatus === 'calling' ? 'Calling...' : 'Waiting for connection...'}
                    </div>
                )}

                {/* Local Video (PIP) */}
                {localStream && (
                    <div className="absolute top-4 right-4 w-48 aspect-video bg-gray-800 border-2 border-white rounded-lg overflow-hidden shadow-lg z-10">
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

            {/* Controls - Floating Overlay */}
            {!isConnectionModalOpen && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                        onClick={endCall}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-transform transform hover:scale-105 border-2 border-white/20"
                    >
                        End Call
                    </button>
                </div>
            )}
        </div>
    );
};

export default MentorCallWindow;

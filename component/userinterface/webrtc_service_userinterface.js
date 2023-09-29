


let selected_device_video = '';
let selected_device_autioinput = '';
let selected_device_autiooutput = '';
async function selectDevices() {
    const devicelist = await navigator.mediaDevices.enumerateDevices();
    var comunicationaudioinputdiv = document.getElementById('communicationaudioinput');
    var comunicationaudiooutputdiv = document.getElementById('communicationaudiooutput');
    var comunicationvideodiv = document.getElementById('communicationvideo');


    const videoDeviceList = devicelist.filter(item => item.kind == 'videoinput');
    videoDeviceList.forEach(videodevice => {
        selected_device_video = videodevice.deviceId;

        var fdiv = document.createElement('button');
        fdiv.innerHTML = videodevice.label;
        fdiv.className = 'videoinput';
        comunicationvideodiv.appendChild(fdiv);
        fdiv.onclick = function (k) {
            return function () {
                selected_device_video = k;
                document.cookie = 'selected_device_video=' + k;
            }
        }(videodevice.deviceId)

    })

    const audioinputDeviceList = devicelist.filter(item => item.kind == 'audioinput');
    audioinputDeviceList.forEach(audioinputdevice => {
        selected_device_audioinput = audioinputdevice.deviceId;

        var fdiv = document.createElement('button');
        fdiv.innerHTML = audioinputdevice.label;
        fdiv.className = 'videoinput';
        comunicationaudioinputdiv.appendChild(fdiv);
        fdiv.onclick = function (k) {
            return function () {
                selected_device_audioinput = k;
                document.cookie = 'selected_device_audioinput=' + k;

            }
        }(audioinputdevice.deviceId)

    })

    const audiooutputDeviceList = devicelist.filter(item => item.kind == 'audiooutput');
    audiooutputDeviceList.forEach(audiooutputdevice => {
        selected_device_audiooutput = audiooutputdevice.deviceId;

        var fdiv = document.createElement('button');
        fdiv.innerHTML = audiooutputdevice.label;
        fdiv.className = 'videoinput';
        comunicationaudiooutputdiv.appendChild(fdiv);
        fdiv.onclick = function (k) {
            return function () {
                selected_device_audiooutput = k;
                document.cookie = 'selected_device_audiooutput=' + k;
            }
        }(audiooutputdevice.deviceId)

    })

}
selectDevices();
function getCookie(cookieName) {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === cookieName) {
            return value;
        }
    }
    return null; // 해당하는 쿠키가 없을 경우 null 반환
}



var ices;
var stream;

async function RTCGo() {
    const equipmentSettingStatus = await everythingReady();
    if (equipmentSettingStatus.equipcheck[2]) {// if video is allowed

        if (username == 'eupium') {
            var constraints = {
                'video': false,
                'audio': true
            }

        } else {
            const audioinputdeviceid = getCookie('selected_device_audioinput')
            const videodeviceid = getCookie('selected_device_video')
            var constraints = {
                video: videodeviceid ? { deviceId: videodeviceid } : true,
                audio: audioinputdeviceid ? { deviceId: audioinputdeviceid } : true
            };
        }
    } else { //if video is not allowed
        audioinputdeviceid = getCookie('selected_device_audioinput')

        var constraints = {
            'video': false,
            'audio': audioinputdeviceid ? { 'deviceId': audioinputdeviceid } : true
        }
    }


    //socket.emit('fortabletreport',{msglist:'RTCGo before mentee Media play',username:username,modecheck:'webrtc',usertype:'mentee'});
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
        socket.emit('fortabletreport', { msglist: 'Connection Process[2] - Successful user media play', username: username, modecheck: 'webrtc', usertype: 'mentee' });


    } catch {
        alert('미디어 장비를 찾을 수 없습니다. 좌측 상단의 버튼을 눌러 카메라 및 마이크를 허용해 주세요. 만약 허용했다면, 다른 프로그램이 카메라와 마이크를 사용하고 있을 가능성이 있습니다.  해당 프로그램을 꺼주세요.');
        socket.emit('fortabletreport', { msglist: 'Connection Process[1.5] - error Occurred and Failed at Openning mentee user media ', username: username, modecheck: 'webrtc', usertype: 'mentee' });

    }



    stream.getAudioTracks()[0].onended = function (event) {
        socket.emit('fortabletreport', { msglist: 'stream - onended', username: username, modecheck: 'webrtc', usertype: 'mentee' });
    };



    function onLeave() {
        remoteVideo.srcObject = null;
        //peerConnection.close();
        //peerConnection.onicecandidate = null;

        peerConnection = null;

        peerConnection = new RTCPeerConnection(configuration);

        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        });
    }


    function stringifyRTCPeerConnection(rtcPeerConnection) {
        const properties = [];
        for (const prop in rtcPeerConnection) {
            if (rtcPeerConnection.hasOwnProperty(prop)) {
                properties.push(`${prop}: ${rtcPeerConnection[prop]}`);
            }
        }
        return `{ ${properties.join(', ')} }`;
    }

}


var peerConnection;
socket.emit('communicationready');
socket.on('communicationreadyafter', async function (a) {
    await RTCGo();
    var configuration = { iceServers: a.iceservers };
    peerConnection = new RTCPeerConnection(configuration);


    stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
    });

    peerConnection.onconnectionstatechange = function (event) {
        switch (peerConnection.connectionState) {
            case "connected":
                console.log('connected');
                socket.emit('fortabletreport', { msglist: 'onconnectionstatechange - connected', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                // videoRaising('sharepaperoptionbox')
                break;
            case "disconnected":
                console.log('disconnected');
                socket.emit('fortabletreport', { msglist: 'onconnectionstatechange - disconnected', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                //onLeave();
                videoDown();
                break;
            case "new":
                console.log('new');
                socket.emit('fortabletreport', { msglist: 'onconnectionstatechange - new', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                break;
            case "checking":
                console.log('checking');
                socket.emit('fortabletreport', { msglist: 'onconnectionstatechange - checking', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                break;
            case "completed":
                socket.emit('fortabletreport', { msglist: 'onconnectionstatechange - completed', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                console.log('completed');
                break;
            case "closed":
                console.log('closed');
                socket.emit('fortabletreport', { msglist: 'onconnectionstatechange - closed', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                break;
            case "failed":
                console.log('failed');
                socket.emit('fortabletreport', { msglist: 'onconnectionstatechange - failed', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                //peerConnection.restartIce();
                break;


        }
    }

    peerConnection.onicecandidate = (e) => {
        console.log('onicecandidate ', e);
        if (mentorinfo.wrssmentorconnectionstate == 1) {//wrssmentor first;
            socket.emit('webrtctoservernewicecandidate', { destination: 'tocaller', newicecandidate: e.candidate, mentorsocketid: mentorinfo.wrssmentorsocketid });
            socket.emit('fortabletreport', { msglist: 'Connection Process[8] - ICE Exchange', username: username, modecheck: 'webrtc', usertype: 'mentee' });
        } else {
            socket.emit('webrtctoservernewicecandidate', { destination: 'tocaller', newicecandidate: e.candidate, mentorsocketid: mentorinfo.mentorsocketid });
            socket.emit('fortabletreport', { msglist: 'Connection Process[8] - ICE Exchange', username: username, modecheck: 'webrtc', usertype: 'mentee' });
        }
    };

    socket.on('webrtctorespondernewicecandidate', async function (a) {
        if (a.newicecandidate) {
            console.log(a.newicecandidate, 'responder');
            await peerConnection.addIceCandidate(a.newicecandidate);
            socket.emit('fortabletreport', { msglist: 'Connection Process[9] - ICE Exchange', username: username, modecheck: 'webrtc', usertype: 'mentee' });
        }
    });


    const remoteVideo = document.getElementById('mentorvideo');
    peerConnection.addEventListener('track', (event) => {
        remoteStream.addTrack(event.track);


        // const remoteVideo = document.getElementById('mentorvideo');
        // console.log(remoteVideo.style.visibility);
        // if (remoteVideo.style.visibility == 'hidden' || remoteVideo.style.visibility == '') {
        //     remoteVideo.style.visibility = 'visible';
        // }
    
        // remoteVideo.srcObject = remoteStream;

        // const selfVideo = document.getElementById('selfvideo');
        // if (selfVideo.style.visibility == 'hidden' || selfVideo.style.visibility == '') {
        //     selfVideo.style.visibility = 'visible';
        // }
        // selfVideo.srcObject = stream;


        videoRaising('sharepaperoptionbox')
        console.log(remoteStream, 'remoteStream')
        socket.emit('fortabletreport', { msglist: 'Connection Process[10] - Mentor Track Arrived', username: username, modecheck: 'webrtc', usertype: 'mentee' });


        const audiooutputdeviceid = getCookie('selected_device_audiooutput')
        console.log('audiooutputdeviceid')
        console.log(audiooutputdeviceid)
        console.log(remoteStream.getAudioTracks())
        if (audiooutputdeviceid == null) {

        } else {
            console.log('here in audiooutputdeviceid')
            remoteStream.getAudioTracks()[0].applyConstraints({ audioOutput: { deviceId: audiooutputdeviceid } });

        }



        remoteStream.getAudioTracks()[0].onended = function () {
            socket.emit('fortabletreport', { msglist: 'remoteStream ended', username: username, modecheck: 'webrtc', usertype: 'mentee' });
        }

    });




    socket.on('webrtcservertoresponder', async (message) => {
        if (message.offer) {
            socket.emit('fortabletreport', { msglist: 'Connection Process[3] - Mentor offer arrived', username: username, modecheck: 'webrtc', usertype: 'mentee' });
            if (message.mentormode == 'wrss') {
                try {

                    try {

                        //- // 변경된 SDP 출력
                        const webrtcsdp = message.offer.sdp.split('\n')
                            .map(l => l.trim())
                            .join('\r\n');


                        // 원래 형식인 CRLF로 복구한 SDP 데이터
                        const sdpDataRestored = { ...message.offer, sdp: webrtcsdp };
                        socket.emit('fortabletreport', { msglist: 'received sdp : ' + webrtcsdp.length, username: username, modecheck: 'webrtc', usertype: 'mentee' });

                        // await peerConnection.setRemoteDescription(new RTCSessionDescription(sdpDataRestored));
                        await peerConnection.setRemoteDescription(sdpDataRestored);
                        socket.emit('fortabletreport', { msglist: 'Connection Process[4] mentor sdp Setted', username: username, modecheck: 'webrtc', usertype: 'mentee' });

                        // 원격 설명을 성공적으로 설정한 경우에 수행할 작업
                    } catch (error) {
                        if (error instanceof RTCError) {
                            if (error.errorDetail === 'sdp-syntax-error') {
                                console.error('SDP syntax error detected on line ' + error.sdpLineNumber);
                                // 해당 SDP에 구문 오류가 있을 때 처리할 내용
                                socket.emit('fortabletreport', { msglist: 'Unexpected Error When Mentor Offer Setted ' + error.message, username: username, modecheck: 'webrtc', usertype: 'mentee' });


                            } else {
                                console.error('An RTCError occurred: ' + error.message);
                                socket.emit('fortabletreport', { msglist: 'Unexpected Error When Mentor Offer Setted ' + error.message, username: username, modecheck: 'webrtc', usertype: 'mentee' });


                                // 다른 RTCError 상황에 대한 처리
                            }
                        } else if (error instanceof DOMException && error.name === 'TypeError') {
                            console.error('TypeError: ' + error.message);
                            socket.emit('fortabletreport', { msglist: 'Unexpected Error When Mentor Offer Setted ' + error.message, username: username, modecheck: 'webrtc', usertype: 'mentee' });


                            // RTCSessionDescription 객체를 생성할 때 발생한 TypeError 처리
                        } else {
                            console.error('An unexpected error occurred: ' + error.message);
                            socket.emit('fortabletreport', { msglist: 'Unexpected Error When Mentor Offer Setted ' + error.message, username: username, modecheck: 'webrtc', usertype: 'mentee' });

                            // 다른 예외 상황에 대한 처리
                        }
                    }


                    const answer = await peerConnection.createAnswer();
                    socket.emit('fortabletreport', { msglist: 'Connection Process[5] - Mentee Offer Created', username: username, modecheck: 'webrtc', usertype: 'mentee' });

                    await peerConnection.setLocalDescription(answer);
                    socket.emit('fortabletreport', { msglist: 'Connection Process[6] - Mentee Offer Setted', username: username, modecheck: 'webrtc', usertype: 'mentee' });

                    socket.emit('webrtcrespondertoserver', { answer: answer, mentorsocketid: mentorinfo.wrssmentorsocketid });
                    socket.emit('fortabletreport', { msglist: 'Connection Process[7] - Mentee Offer Sended to Mentor', username: username, modecheck: 'webrtc', usertype: 'mentee' });
                } catch (e) {
                    socket.emit('fortabletreport', { msglist: 'Error Occurred: ' + e.message, username: username, modecheck: 'webrtc', usertype: 'mentee' });
                }


            } else {
            }

        }
    });




});

function videoRaising(container) {
    /*	
    var mentorvideobox = document.getElementById('mentorvideobox');

    if(mentorvideobox!== null ){
        mentorvideobox.remove();
    }*/


    removeByclassname("videobutton")
    var mentorvideocontroltop = document.createElement('div');
    mentorvideocontroltop.id = 'mentorvideocontroltop';
    mentorvideocontroltop.className = 'videobutton'
    var topbutton = document.createElement('button');
    topbutton.innerHTML = '비디오를 위로 이동';
    topbutton.onclick = function () { moveVideobox("up") };
    mentorvideocontroltop.appendChild(topbutton);
    var sharepaperoptionbox = document.getElementById('sharepaperoptionbox');
    // sharepaperoptionbox.appendChild(mentorvideocontroltop); //ios에서 이 기능을 실행하면 아예 다운되는 지점.


    var mentorvideocontroldown = document.createElement('div');
    mentorvideocontroldown.id = 'mentorvideocontroldown';
    mentorvideocontroldown.className = 'videobutton';
    var downbutton = document.createElement('button');
    downbutton.innerHTML = '비디오를 아래로 이동';
    downbutton.onclick = function () { moveVideobox("down") };
    mentorvideocontroldown.appendChild(downbutton);
    // sharepaperoptionbox.appendChild(mentorvideocontroldown);




    const remoteVideo = document.getElementById('mentorvideo');
    console.log(remoteVideo.style.visibility);
    if (remoteVideo.style.visibility == 'hidden' || remoteVideo.style.visibility == '') {
        remoteVideo.style.visibility = 'visible';
    }

    remoteVideo.srcObject = remoteStream;
    console.log('video up and sender stream is connected');




    //only show mentee self video when mentor video connected
    var rtrack = remoteStream.getTracks();
    console.log(rtrack);
    var chk = 0;
    for (var ia = 0; ia < rtrack.length; ia++) {
        if (rtrack[ia].kind == 'video') {
            chk = 1;
            break;
        }
    }
    if (chk == 1) {
        const selfVideo = document.getElementById('selfvideo');
        if (selfVideo.style.visibility == 'hidden' || selfVideo.style.visibility == '') {
            selfVideo.style.visibility = 'visible';
        }

        selfVideo.srcObject = stream;
    }

}


alert('anspage');


window.onload=function(){
	var peer= new Peer();
	var socket = io();

	peer.on('open',function(peerid){
		socket.emit('peeridsent',peerid);
		console.log(peerid);
				
	});

	console.log(window.isSecureContext);
	peer.on('call',function(call){



		if(navigator.mediaDevices){			
		navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
			call.answer(stream);
			
			call.on('stream', function(remoteStream){
				var video = document.querySelector('video');
				video.srcObject = remoteStream;
				video.onloadedmetadata = function(e){
					video.play();
				}
				alert('Here it comes!');
			});
		}).catch(function(err){
			alert('Error Comes..T.T');
			console.log( err);
		});
		}else {
			console.log(navigator);
			console.log(navigator.mediaDevices);
		}
	});
}

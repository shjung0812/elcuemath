 var video = document.querySelector('video');
//                                  video.srcObject = remoteStream;
 //      video.onloadedmetadata = function(e){
var peer = new Peer();
function ConnectToAns(){
	function hasGetUserMedia(){
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia)
	}
	
	if(hasGetUserMedia()){
		//var getUserMedia=navigator.getUserMedia;
		//var getUserMedia=navigator.mediaDevices.getUserMedia;
		var constraints = {
			video:{ width:{ideal:4086},height:{ideal:2106}},audio:true
		};

		constraints={audio:true}
		navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
		//navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(function(stream){

			var call=peer.call(plistj[plistj.length-1],stream);
			call.on('stream',function(remoteStream){
				var video = document.querySelector('video');
				video.srcObject = remoteStream;
				video.onloadedmetadata = function(e){
					video.play();
				}

				
			});
	
		}).catch(function(err){
			console.log('is error :' + err);
		});
	}else{
		alert('getUserMedia() is not supported in your browser');
	}
}

window.onload=function(){
	
	alert(plistj[plistj.length-1]);


}

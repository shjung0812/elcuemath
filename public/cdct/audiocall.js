

var peer = new Peer();

window.onload=function(){
	var socket = io();
	peer.on('open',function(id){
		socket.emit('peeridsent',id);
	});
	
}


var peer= new Peer();
window.onload = function(){

	peer.on('open',function(id){
		var p=document.createElement('p');
		p.innerHTML= 'my peer id is : ' + id;
		document.body.appendChild(p);




		peer.on('connection', function(conn){
			alert('connected!');
			var p=document.createElement('p');
			p.innerHTML= conn.peer
			document.body.appendChild(p);


		});


	});


}

function myfunction(){
	var idcon=document.getElementById('schid').value;
	var msgcon=document.getElementById('msg').value;

	var conn = peer.connect(idcon);
	conn.send(msgcon);
	/*
	conn.on('open',function(){

		conn.on('data',function(data){
			console.log('Received', data);
		})
		

	});*/




	
	
}

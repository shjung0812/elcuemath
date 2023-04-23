var fs=require('fs');
var path=require('./prismpath.json');
var plc=require(path.prismbin+'plangcho');
var mbs=require(path.prismbin+'mathbasic');
var sf=require(path.prismbin+'serverflow');


var username='king0422'
sf.getinfodb('select * from rdcthistory where username="'+username+'" and numid>= 46681',function(a){

	for(var ia=0; ia<a.length; ia++){
		var data=a[ia].username+','+a[ia].prbid+','+a[ia].resultcode+','+a[ia].createdate+','+a[ia].hisopt+','+a[ia].rconnum+','+a[ia].cptinfo+','+a[ia].evalprb+'##';
		//if(ia!=a.length-1){
			//var data=a[ia].username+','+a[ia].prbid+','+a[ia].resultcode+','+a[ia].createdate+','+a[ia].hisopt+','+a[ia].rconnum+','+a[ia].cptinfo+','+a[ia].evalprb+'##';
		//}else{
			//var data=a[ia].username+','+a[ia].prbid+','+a[ia].resultcode+','+a[ia].createdate+','+a[ia].hisopt+','+a[ia].rconnum+','+a[ia].cptinfo+','+a[ia].evalprb;
		//}
			fs.appendFile('write_rdcthistory_to_txt.txt',data,function(err){
				if (err) throw err;
				console.log('data appended');
			});
	}
});

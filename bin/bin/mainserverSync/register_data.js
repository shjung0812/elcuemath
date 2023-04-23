var path=require('./prismpath.json');
var plc=require(path.prismbin+'plangcho');
var mbs=require(path.prismbin+'mathbasic');
var sf=require(path.prismbin+'serverflow');

var fs=require('fs');
fs.readFile('write_rdcthistory_to_txt.txt','utf8',function(err,data){
	var dataline=data.split('##');
	for(var ia=0; ia<dataline.length-1; ia++){

		var dataeach=dataline[ia].split(',');
	var register = {username:dataeach[0],prbid:dataeach[1], resultcode:null,createdate:dataeach[3],hisopt:dataeach[4],rconnum:null,cptinfo:dataeach[6],evalprb:null};

	sf.getinfodb_par('insert into rdcthistory SET ?',register,function(err,result){
	//	console.log(register);
	});

	}
});

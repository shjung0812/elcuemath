var path=require('./prismpath.json');
var mb=require(path.prismbin+'mathbasic');
module.exports={

prbvariable:function(arglist){
var i=0;
var argrand=[];
var argnum=arglist.length;
while (i<argnum){
argrand[i]=module.exports.randrange(arglist[i][0],arglist[i][1],arglist[i][2]);
i=i+1;
}
return [argrand,module.exports.randint(1,4)];
},




randint:function(min,max){ //randint는 min과 max가 포함된다. 즉 min, max 모두 random으로 나온다. 
var randomnumber=Math.floor(Math.random()*(max-min+1))+min;
return randomnumber;
},
randrange:function(min,max,inter){
var _=require('underscore');
var inrange=_.range(1, Math.floor(((max-min)*1./inter)+1));
var randin=module.exports.randint(1,inrange.length);
var rst=inter*(randin-1)+min;
return rst;
},
AnsFuncc:function(arglist,prbcon){
var mm;
if (!prbcon){
	mm=module.exports.prbvariable(arglist);	
}else{
	var itercheck=0;
	var Ch=0;
	while(!Ch){
		mm=module.exports.prbvariable(arglist);	
		var varl=arglist.length;
		var ii=0;

		if (varl==1){
		ca=mm[0][0];
		}else if(varl==2){
		ca=mm[0][0];
		cb=mm[0][1];
		}else if (varl==3){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		}
		else if (varl==4){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		cd=mm[0][3];
		}else if (varl==5){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		cd=mm[0][3];
		ce=mm[0][4];
		}else if (varl==6){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		cd=mm[0][3];
		ce=mm[0][4];
		cf=mm[0][5];
		}else if (varl ==7){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		cd=mm[0][3];
		ce=mm[0][4];
		cf=mm[0][5];
		cg=mm[0][6];
		}else if (varl ==8){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		cd=mm[0][3];
		ce=mm[0][4];
		cf=mm[0][5];
		cg=mm[0][6];
		ch=mm[0][7];
		}else if (varl==9){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		cd=mm[0][3];
		ce=mm[0][4];
		cf=mm[0][5];
		cg=mm[0][6];
		ch=mm[0][7];
		ci=mm[0][8];
		}else if (varl==10){
		ca=mm[0][0];
		cb=mm[0][1];
		cc=mm[0][2];
		cd=mm[0][3];
		ce=mm[0][4];
		cf=mm[0][5];
		cg=mm[0][6];
		ch=mm[0][7];
		ci=mm[0][8];
		cj=mm[0][9];
		}
	
		if(eval(prbcon)){Ch=0}else{Ch=1;};
		if (itercheck>1000){
			console.log('terminated abnormally becaouse of overflow in loop for prbCon checking ');
			process.exit();
		} else{
			itercheck=itercheck+1;
		}
	}
}

return mm;
}
};

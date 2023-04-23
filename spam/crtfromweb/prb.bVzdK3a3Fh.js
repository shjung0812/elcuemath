
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` A: 3바퀴, B: 3바퀴 `;
	var cho2=` A: 4바퀴, B: 2바퀴 `;
	var cho3=` A: 3바퀴, B: 6바퀴 `;
	var ans=` A: 5바퀴, B: 4바퀴 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
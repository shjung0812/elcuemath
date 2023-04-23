
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` x의 계수: -0.2, y의 계수: 0.3 `;
	var cho2=` x의 계수: 0.3, y의 계수: -0.5 `;
	var cho3=` x의 계수: 0.3, y의 계수: 0.2 `;
	var ans=` x의 계수: -0.3, y의 계수: 0.5 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
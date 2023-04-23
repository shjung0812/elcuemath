
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 평균: 3.9권, 중앙값:1.2권 `;
	var cho2=` 평균: 4.2권, 중앙값:1.5권 `;
	var cho3=` 평균: 3.9권, 중앙값:1.2권 `;
	var ans=` 평균: 4.1권, 중앙값:1.5권 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
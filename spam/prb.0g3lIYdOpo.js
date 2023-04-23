
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (ㄱ)의 과정을 인수분해한다고 한다.  `;
	var cho2=` (ㄴ)의 과정을 전개한다고 한다.  `;
	var cho3=` \\(4xy\\)는 \\(8x^{2}y, \\; -4xy\\)의 공통인수다.  `;
	var ans=` (ㄴ)의 과정에서 결합법칙이 이용된다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
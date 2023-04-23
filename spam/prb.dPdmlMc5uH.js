
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a=3, b=4\\) `;
	var cho2=` 그런 a, b는 존재하지 않는다.  `;
	var cho3=` \\(a=1, b=-1\\) `;
	var ans=` \\(a=b\\) 인 모든 실수 a, b `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
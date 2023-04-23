
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 모든 무한소수는 순환소수이다.  `;
	var cho2=` 모든 유리수는 유한소수로 나타낼 수 있다.  `;
	var cho3=` 모든 무리수는 유리수 이다.  `;
	var ans=` 모든 순환 소수는 유리수이다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
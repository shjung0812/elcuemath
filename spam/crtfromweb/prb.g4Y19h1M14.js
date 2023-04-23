
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 1에 가장 가까운 유리수를 찾을 수 있다.  `;
	var cho2=` 서로다른 두 무리수 사이에는 무리수만 있다.  `;
	var cho3=` \\(\\frac{1}{12}\\)과 \\(\\frac{7}{12}\\) 사이에는 5개의 유리수가 있다.  `;
	var ans=` 실수 중에서 유리수이면서 동시에 무리수인 수는 없다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
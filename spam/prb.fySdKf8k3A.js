
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 2와 3 사이에는 무수히 많은 무리수가 있다.  `;
	var cho2=` \\(\\sqrt{2}\\)와 \\(\\sqrt{3}\\) 사이에는 무수히 많은 유리수가 있다.  `;
	var cho3=` 모든 실수는 각각 수직선 위의 한 점에 대응한다.  `;
	var ans=` 서로 다른 두 정수 사이에는 무수히 많은 정수가 있다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
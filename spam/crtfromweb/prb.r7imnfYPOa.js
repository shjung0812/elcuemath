
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 원점을 지난다.  `;
	var cho2=` 점 \\((2, \\; 2a)\\)를 지난다.  `;
	var cho3=` \\(a\\)의 절댓값이 클수록 원점에 가깝다.  `;
	var ans=` \\(a>0\\)이면 \\(x>0\\)인 범위에서 \\(x\\)의 값이 증가할 때, \\(y\\)의 값은 감소한다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
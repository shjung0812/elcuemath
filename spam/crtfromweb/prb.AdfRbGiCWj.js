
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 위로 볼록한 포물선이다.  `;
	var cho2=` 원점을 지난다.  `;
	var cho3=` x > 1 일 때, x의 값이 증가하면 y의 값은 감소한다.  `;
	var ans=` 함수값의 범위는 \\(y \\geq 3\\)이다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` x 축과의 교점의 좌표는 (-1, 0), (5, 0) `;
	var cho2=` 함수값의 범위는 \\(y \\leq 9 \\)이다.  `;
	var cho3=` 꼭짓점의 좌표는 (2, 9)이다.  `;
	var ans=` x > 2 일 때, x의 값이 증가하면 y의 값도 증가한다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
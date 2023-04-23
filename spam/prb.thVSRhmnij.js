
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` y절편은 -1이다.  `;
	var cho2=` 일차함수 y=2x의 그래프와 평행하다.  `;
	var cho3=` 점 (-1, 1)을 지난다.  `;
	var ans=` 제 4사분면을 지나지 않는다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a>0\\)일 때, 아래로 볼록하다.  `;
	var cho2=` 축의 방정식은 \\(x=0\\)이다.  `;
	var cho3=` y축에 대칭인 포물선이다. `;
	var ans=` \\(a<0\\)일 때, 함수값의 범위는 \\(y\\geq 0\\)이다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
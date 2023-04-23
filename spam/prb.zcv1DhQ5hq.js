
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 두점 (2, -3), (-2, 3)은 같은 사분면 위에 있다. `;
	var cho2=` 점 (-4, 0)은 y축 위에 있다. `;
	var cho3=` 점(1, 5)는 제 2사분면 위에 있다.  `;
	var ans=` (0,-1)은 어느 사분면에도 속하지 않는다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` x살인 영미의 나이는 y살인 은정이의 나이보다 3살 적다.  \\(\\Rightarrow x=y-3\\) `;
	var cho2=` 100원짜리 동전 x개와 500원짜리 동전 y개를 합하면 3700원이다. \\(\\Rightarrow 100x+500y=3700\\) `;
	var cho3=` 토끼 x마리와 오리 y마리의 다이의 수의 합이 36이다. \\(\\Rightarrow 4x+2y=36\\) `;
	var ans=` x의 3배는 y의 2배보다 4만큼 더 크다. \\(\\Rightarrow 3x+4=2y\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
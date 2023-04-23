
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=`  만족시키는 x, y는 무한히 많이 존재한다.  `;
	var cho2=` \\(x=1, y=2\\) `;
	var cho3=` \\(x=0, y=-1\\) `;
	var ans=` 만족시키는 x, y는 존재하지 않는다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
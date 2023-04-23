
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` x=-3 일 때 최댓값 -1 을 갖는다.  `;
	var cho2=` \\(x=-\\frac{3}{2}\\)일 때, 최솟값 -1을 갖는다.  `;
	var cho3=` x=3일 때, 최댓값 -1을 갖는다.  `;
	var ans=` x=-3 일 때, 최솟값 -1을 갖는다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
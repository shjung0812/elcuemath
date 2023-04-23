
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` x와 y의 순서쌍은 무한히 많다. `;
	var cho2=`  \\(x=4, \\; y=\\frac{5}{2}\\)  `;
	var cho3=`  \\(x=-2, \\; y=\\frac{1}{2}\\)  `;
	var ans=`  \\(x=3, \\; y=\\frac{3}{2}\\)  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
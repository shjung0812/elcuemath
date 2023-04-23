
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-3 \\leq a \\leq 1\\) `;
	var cho2=` \\(-3 \\leq a \\leq 4\\) `;
	var cho3=` \\(0 \\leq a \\leq 4\\) `;
	var ans=` \\(-1 \\leq a \\leq 3\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-5 \\leq a \\leq 4\\) `;
	var cho2=` \\(-3 \\leq a \\leq 6\\) `;
	var cho3=` \\(-1 \\leq a \\leq 8\\) `;
	var ans=` \\(-4 \\leq a \\leq 5\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
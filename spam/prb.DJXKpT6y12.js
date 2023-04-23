
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\{x|-5 \\leq x < -2 \\text{ 또는 } \\; 3 \\leq x \\leq 5\\}\\) `;
	var cho2=` \\(\\{x|-2 \\leq x \\leq 3\\}\\) `;
	var cho3=` \\(\\varnothing\\) `;
	var ans=` \\(\\{x|-5 \\leq x \\leq -2 \\text{ 또는 } \\; 3 \\leq x \\leq 5\\}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
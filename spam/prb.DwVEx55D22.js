
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(0=\\log_4 1\\) `;
	var cho2=` \\(\\frac{1}{2} = \\log_4 10\\) `;
	var cho3=` \\(\\left( \\frac{1}{3} \\right)^{-4} = 81 \\) `;
	var ans=` \\(2=\\log_4 16\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
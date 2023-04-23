
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\left( \\frac{1}{10}\\right)^{6} \\) `;
	var cho2=` \\(10^{4}\\) `;
	var cho3=` \\(10^{6}\\) `;
	var ans=` \\(\\left( \\frac{1}{10}\\right)^{4} \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
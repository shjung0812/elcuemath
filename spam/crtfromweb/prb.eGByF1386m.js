
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\left( \\frac{5}{4}\\right)^{9}\\) `;
	var cho2=` \\(\\left( \\frac{5}{4}\\right)^{8}\\) `;
	var cho3=` \\(\\left( \\frac{5}{4}\\right)^{12}\\) `;
	var ans=` \\(\\left( \\frac{5}{4}\\right)^{10}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(+\\frac{3}{20}, -\\frac{3}{20}\\) `;
	var cho2=` \\(+\\left( \\frac{3}{20} \\right) ^{2}, - \\left( \\frac{3}{20} \\right) ^{2}\\) `;
	var cho3=` \\(+\\sqrt{\\left( \\frac{3}{20} \\right) ^{2}}, - \\sqrt{\\left( \\frac{3}{20} \\right) ^{2}}\\) `;
	var ans=` \\(+\\sqrt{\\frac{3}{20}}, -\\sqrt{\\frac{3}{20}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\left(-2\\right) \\div \\left(-10 \\right) \\times \\left( -15\\right) = -3\\) `;
	var cho2=` \\(\\left(+2\\right) \\times \\left(-8 \\right) \\div \\left( +4\\right) = -4\\) `;
	var cho3=` \\(\\left(-\\frac{12}{5}\\right) \\times \\left(-9 \\right) \\div \\left( -3\\right)^{2} = \\frac{12}{5}\\) `;
	var ans=` \\(\\left(-\\frac{4}{5}\\right) \\div \\left(+\\frac{7}{12} \\right) \\times \\left( -\\frac{7}{4}\\right) = \\frac{4}{15}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(0 \\leq \\theta < \\frac{\\pi}{3}\\) 또는 \\(\\frac{5}{6} \\pi < \\theta < 2 \\pi\\) `;
	var cho2=` \\(\\frac{1}{6} \\pi \\leq \\theta < \\frac{\\pi}{2}\\) 또는 \\(\\frac{5}{6} \\pi < \\theta < 2 \\pi\\) `;
	var cho3=` \\(0 \\leq \\theta < \\frac{\\pi}{6}\\) 또는 \\(\\frac{4}{6} \\pi < \\theta < \\frac{5}{6} \\pi\\) `;
	var ans=` \\(0 \\leq \\theta < \\frac{\\pi}{6}\\) 또는 \\(\\frac{5}{6} \\pi < \\theta < 2 \\pi\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
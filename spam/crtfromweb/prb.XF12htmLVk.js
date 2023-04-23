
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((x-\\frac{\\sqrt{3}}{3})^{2}+(y-\\frac{\\sqrt{3}}{3})^{2} =\\frac{1}{3}\\) `;
	var cho2=` \\(x^{2}+(y-\\frac{\\sqrt{3}}{3})^{2} =\\frac{1}{9}\\) `;
	var cho3=` \\((x-\\frac{\\sqrt{3}}{3})^{2}+(y-\\frac{\\sqrt{3}}{3})^{2} =\\frac{1}{9}\\) `;
	var ans=` \\(x^{2}+(y-\\frac{\\sqrt{3}}{3})^{2} =\\frac{1}{3}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
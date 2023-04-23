
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{9x^{3}}{y^{2}}\\) `;
	var cho2=` \\(\\frac{18y^{4}}{x^{2}}\\) `;
	var cho3=` \\(\\frac{18x^{4}}{y^{4}}\\) `;
	var ans=` \\(\\frac{18x^{4}}{y^{2}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
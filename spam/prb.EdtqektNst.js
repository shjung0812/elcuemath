
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-\\frac{x^{2}}{16y^{8}}\\) `;
	var cho2=` \\(-\\frac{x^{12}}{8y^{4}}\\) `;
	var cho3=` \\(\\frac{x^{6}}{8y^{8}}\\) `;
	var ans=` \\(\\frac{x^{12}}{16y^{8}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{8}{9x^{2}y^{5}}\\) `;
	var cho2=` \\(\\frac{8}{9xy^{4}}\\) `;
	var cho3=` \\(\\frac{2}{9x^{2}y^{5}}\\) `;
	var ans=` \\(\\frac{8}{9xy^{5}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
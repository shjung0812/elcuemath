
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{a^{3}}{b^{5}}\\) `;
	var cho2=` \\(\\frac{a^{5}}{b^{4}}\\) `;
	var cho3=` \\(\\frac{a^{6}}{b^{3}}\\) `;
	var ans=` \\(\\frac{a^{5}}{b^{3}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
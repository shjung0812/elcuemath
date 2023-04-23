
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{2^{98}}{3^{100}}\\) `;
	var cho2=` \\(\\frac{2^{100}}{3^{99}}\\) `;
	var cho3=` \\(\\frac{2^{101}}{3^{99}}\\) `;
	var ans=` \\(\\frac{2^{99}}{3^{100}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
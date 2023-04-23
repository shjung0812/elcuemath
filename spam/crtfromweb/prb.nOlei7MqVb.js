
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-2a^{2}b^{3}+1a+4\\frac{6}{b}\\) `;
	var cho2=` \\(-2a^{2}b^{3}-1a-4\\frac{6}{b}\\) `;
	var cho3=` \\(-3a^{2}b^{3}-3a+\\frac{6}{b}\\) `;
	var ans=` \\(-4a^{2}b^{3}+3a+\\frac{6}{b}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
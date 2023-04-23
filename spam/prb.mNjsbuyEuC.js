
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{1}{4}x^{4}+\\frac{2}{3}x^{3}-\\frac{1}{2}x^{2}-3x+C\\) `;
	var cho2=` \\(x^{4}+\\frac{2}{3}x^{3}-\\frac{1}{2}x^{2}+3x+C\\) `;
	var cho3=` \\(x^{3}+2x^{2}-x+C\\) `;
	var ans=` \\(\\frac{1}{4}x^{4}+\\frac{2}{3}x^{3}-\\frac{1}{2}x^{2}+3x+C\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
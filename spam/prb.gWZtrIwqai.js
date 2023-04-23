
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{5(x^{2}+1)}{x(x-3)(x+2)(x-2)}\\) `;
	var cho2=` \\(\\frac{6(x^{2}+x+1)}{x(x+3)(x+4)(x+2)}\\) `;
	var cho3=` \\(\\frac{6(x^{2}+x-1)}{(x-1)(x+3)(x+1)(x+4)}\\) `;
	var ans=` \\(\\frac{6(x^{2}+x-1)}{x(x+3)(x+1)(x-2)}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
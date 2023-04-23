
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{\\pi}{3}, \\frac{2}{3} \\pi\\) `;
	var cho2=` \\(\\frac{\\pi}{4}, \\frac{3}{4} \\pi\\) `;
	var cho3=` \\(\\frac{\\pi}{3}, \\frac{3}{4} \\pi\\) `;
	var ans=` \\(\\frac{\\pi}{6}, \\frac{5}{6} \\pi\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(4^{-\\frac{1}{2}} = \\frac{1}{2}\\) `;
	var cho2=` \\(4^{\\frac{1}{8}} = \\sqrt[4]{2}\\) `;
	var cho3=` \\(8^{-\\frac{3}{2}} = \\left( \\frac{1}{\\sqrt{2}} \\right)^{9} \\) `;
	var ans=` \\(4^{-\\frac{3}{2}} = \\frac{1}{8}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
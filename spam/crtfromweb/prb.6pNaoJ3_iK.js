
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{\\pi}{6} < \\theta < \\frac{1}{2} \\pi\\) `;
	var cho2=` \\(\\frac{\\pi}{6} < \\theta < \\frac{3}{4} \\pi\\) `;
	var cho3=` \\(\\frac{\\pi}{5} < \\theta < \\frac{4}{5} \\pi\\) `;
	var ans=` \\(\\frac{\\pi}{4} < \\theta < \\frac{3}{4} \\pi\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{7\\pi}{6} -3\\) `;
	var cho2=` \\(3-\\frac{\\pi}{3}\\) `;
	var cho3=` \\(3-\\frac{\\pi}{6} \\) `;
	var ans=` \\(\\frac{4\\pi}{3} -3\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
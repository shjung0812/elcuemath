
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) \\(\\frac{93}{228}\\) (2) \\(\\frac{139}{228}\\) `;
	var cho2=` (1) \\(\\frac{93}{228}\\) (2) \\(\\frac{137}{228}\\) `;
	var cho3=` (1) \\(\\frac{91}{228}\\) (2) \\(\\frac{139}{228}\\) `;
	var ans=` (1) \\(\\frac{91}{228}\\) (2) \\(\\frac{137}{228}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
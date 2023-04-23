
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\Big( \\frac{5}{3}, \\frac{8}{3}\\Big)\\) `;
	var cho2=` \\(\\Big( \\frac{7}{4}, \\frac{13}{4}\\Big)\\) `;
	var cho3=` \\((2, 3)\\) `;
	var ans=` \\(\\Big( \\frac{8}{5}, \\frac{17}{5}\\Big)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
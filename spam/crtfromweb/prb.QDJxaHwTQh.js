
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\Big(\\frac{1}{4}, \\frac{31}{16} \\Big)\\) `;
	var cho2=` \\(\\Big( \\frac{1}{3}, \\frac{17}{9}Big)\\) `;
	var cho3=` \\(\\Big( \\frac{5}{4}, \\frac{7}{16}Big)\\) `;
	var ans=` \\((1, 1)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
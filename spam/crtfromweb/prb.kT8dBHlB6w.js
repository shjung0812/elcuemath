
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a=\\frac{1}{4}, \\; b=-\\frac{3}{2}\\) `;
	var cho2=` \\(a=-\\frac{9}{4}, \\; b=\\frac{5}{2}\\) `;
	var cho3=` \\(a=\\frac{1}{4}, \\; b=-\\frac{3}{4}\\) `;
	var ans=` \\(a=\\frac{9}{4}, \\; b=-\\frac{3}{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
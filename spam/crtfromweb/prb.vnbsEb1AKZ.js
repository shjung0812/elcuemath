
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y=\\frac{8}{3}x - \\frac{4}{5}\\) `;
	var cho2=` \\(y=\\frac{4}{5}x + \\frac{8}{3}\\) `;
	var cho3=` \\(y=\\frac{8}{3}x - 20\\) `;
	var ans=` \\(y=\\frac{8}{3}x + \\frac{5}{4}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
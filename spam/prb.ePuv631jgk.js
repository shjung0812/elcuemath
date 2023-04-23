
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-\\frac{5}{2} < y < -\\frac{13}{8}\\) `;
	var cho2=` \\(-3 < y < -1\\) `;
	var cho3=` \\(-3 < y < -\\frac{15}{8}\\) `;
	var ans=` \\(-2 < y < -\\frac{11}{8}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
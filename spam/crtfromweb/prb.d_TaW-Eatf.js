
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-\\frac{7}{2} \\leq x \\leq 1.7\\) `;
	var cho2=` \\(-\\frac{7}{2} < x < 1.7\\) `;
	var cho3=` \\(-\\frac{7}{2} < x \\leq 1.7\\) `;
	var ans=` \\(-\\frac{7}{2} \\leq x < 1.7\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
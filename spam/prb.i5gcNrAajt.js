
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-1 < k < -\\frac{1}{3} \\) 또는 \\(0 < k < 1\\) `;
	var cho2=` \\(-\\frac{1}{3} < k  < 0\\) 또는 \\(0 < k < 1\\) `;
	var cho3=` \\(-1 < k < 0\\) 또는 \\(0 < k < \\frac{1}{3}\\) `;
	var ans=` \\(k < -1\\) 또는 \\(k > \\frac{1}{3}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
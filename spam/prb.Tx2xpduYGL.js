
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x \\leq -4\\) 또는 \\(x \\geq 3\\) `;
	var cho2=` \\(x \\leq -2\\) 또는 \\(x \\geq 2\\) `;
	var cho3=` \\(-4 \\leq x \\leq 3\\) `;
	var ans=` \\(x \\leq -2\\) 또는 \\(x \\geq 3\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
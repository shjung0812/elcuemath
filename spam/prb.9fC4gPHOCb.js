
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a \\leq 2\\) 또는 \\(a \\geq 4\\) `;
	var cho2=` \\(a \\leq 0\\) 또는 \\(a \\geq 2\\) `;
	var cho3=` \\(a \\leq -1\\) 또는 \\(a \\geq 1\\) `;
	var ans=` \\(a \\leq 1\\) 또는 \\(a \\geq 3\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
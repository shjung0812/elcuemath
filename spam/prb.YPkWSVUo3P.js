
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x < 15, \\; \\; x < -1\\) `;
	var cho2=` \\(x \\leq 15, \\; \\; x > -1\\) `;
	var cho3=` \\(x \\geq 15, \\; \\; x \\leq -1\\) `;
	var ans=` \\(x \\geq 15, \\; \\; x \\geq -1\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
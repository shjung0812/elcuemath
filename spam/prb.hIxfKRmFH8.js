
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(k \\leq -2\\) 또는 \\(k > -1\\) `;
	var cho2=` \\(k \\leq 5\\) 또는 \\(k > 7\\) `;
	var cho3=` \\(k \\leq -3\\) 또는 \\(k > 2\\) `;
	var ans=` \\(k \\leq -5\\) 또는 \\(k > -4\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
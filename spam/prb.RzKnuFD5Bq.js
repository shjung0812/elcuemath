
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(17x + 2 > 10\\) `;
	var cho2=` \\(17x + 10 \\geq 2\\) `;
	var cho3=` \\(17x + 10 \\leq 2\\) `;
	var ans=` \\(17x + 2 \\geq 10\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
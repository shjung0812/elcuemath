
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(7x-5 \\geq 8x+4\\) `;
	var cho2=` \\(7x+5 > 4x-8\\) `;
	var cho3=` \\(7x-5 \\leq 4x-8\\) `;
	var ans=` \\(7x-5 > 4x+8\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
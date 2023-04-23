
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(2x-11 \\leq 7x-16\\) `;
	var cho2=` \\(3x+4 \\geq 5x+6\\) `;
	var cho3=` \\(2x-1 \\leq x-2\\) `;
	var ans=` \\(4x+7 \\geq 2-x\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
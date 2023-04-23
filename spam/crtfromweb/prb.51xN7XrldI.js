
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(4x^{2}-12x+9 = (2x- \\Box)^{2}\\) `;
	var cho2=` \\(16x^{2}-9y^{2}=(4x+ \\Box y ) (4x-3y)\\) `;
	var cho3=` \\(2x^{2}+7x+ \\Box = (2x+1)(x+3) \\) `;
	var ans=` \\(x^{2}-\\Box x +3 = (x-1)(x-3)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
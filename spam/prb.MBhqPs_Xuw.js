
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x^{2}+16x+64 = (x+8)^{2}\\) `;
	var cho2=` \\(x^{2 } -25 = (x+5)(x-5)\\) `;
	var cho3=` \\(3x^{2}+xy-10y^{2} = (x+2y)(3x-5y)\\) `;
	var ans=` \\(4x^{2}+4x-15 = (x-3)(4x+5)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
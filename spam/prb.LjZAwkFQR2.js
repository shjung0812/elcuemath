
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x^{2}-16x+64 = (x-8)^{2}\\) `;
	var cho2=` \\(a^{2}+a+\\frac{1}{4} = \\left( 3a-b \\right)^{2} \\) `;
	var cho3=` \\(9a^{2}-6ab+b^{2}= (3a-b)^{2}\\) `;
	var ans=` \\(16x^{2}-16xy+4y^{2}=(4x-y)^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\left( \\frac{1}{5}b + \\frac{3000}{a} \\right) \\) 원 `;
	var cho2=` \\(\\left( \\frac{1}{5}a - \\frac{3000}{7b} \\right) \\) 원 `;
	var cho3=` \\(\\left( \\frac{2}{5}a + \\frac{3000a}{b} \\right) \\) 원 `;
	var ans=` \\(\\left( \\frac{2}{5}a + \\frac{3000}{b} \\right) \\) 원 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
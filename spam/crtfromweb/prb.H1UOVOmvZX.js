
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a^{2}\\)의 계수 : 2, b의 계수 : \\(\\frac{1}{8}\\) `;
	var cho2=` \\(a^{2}\\)의 계수 : -1, b의 계수 : \\(-\\frac{1}{4}\\) `;
	var cho3=` \\(a^{2}\\)의 계수 : -2, b의 계수 : \\(\\frac{1}{8}\\) `;
	var ans=` \\(a^{2}\\)의 계수 : 1, b의 계수 : \\(-\\frac{1}{8}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
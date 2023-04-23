
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) \\(a \\leq 2\\), (2) \\( x=\\frac{1}{2a}\\), (3) 최대값: \\(2a+\\frac{5}{4}\\) 최솟값:\\(\\frac{1}{4}\\) `;
	var cho2=` (1) \\(a \\leq 1\\), (2) \\( x=\\frac{1}{3a}\\), (3) 최대값: \\(3a+\\frac{5}{4}\\) 최솟값:\\(\\frac{1}{4}\\) `;
	var cho3=` (1) \\(a \\leq 1\\), (2) \\( x=\\frac{3}{2a}\\), (3) 최대값: \\(a-\\frac{5}{4}\\) 최솟값:\\(\\frac{1}{4}\\) `;
	var ans=` (1) \\(a \\leq 1\\), (2) \\( x=\\frac{1}{2a}\\), (3) 최대값: \\(a+\\frac{5}{4}\\) 최솟값:\\(\\frac{1}{4}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
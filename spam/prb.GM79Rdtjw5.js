
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\left( \\frac{4}{xy} + \\frac{1}{2}\\right)\\) 시간 `;
	var cho2=` \\(\\left( \\frac{4}{5} + \\frac{x}{y}\\right)\\) 시간 `;
	var cho3=` \\(\\left( \\frac{1}{x} - \\frac{1}{y}\\right)\\) 시간 `;
	var ans=` \\(\\left( \\frac{4}{x} + \\frac{1}{y}\\right)\\) 시간 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
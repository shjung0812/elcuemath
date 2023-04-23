
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\left( 2, \\frac{1}{3}\\right) \\) `;
	var cho2=` \\(\\left( -3, -\\frac{1}{2}\\right) \\) `;
	var cho3=` \\(\\left( -6, -1\\right) \\) `;
	var ans=` \\(\\left( 4, \\frac{3}{2}\\right) \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
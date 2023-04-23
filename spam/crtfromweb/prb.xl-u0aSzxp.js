
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(f(\\alpha) > 0, \\; f(\\beta) > 0, \\; f(\\gamma)< 0\\) `;
	var cho2=` \\(f(\\alpha) < 0, \\; f(\\beta) > 0, \\; f(\\gamma) > 0\\) `;
	var cho3=` \\(f(\\alpha) < 0, \\; f(\\beta) < 0, \\; f(\\gamma) > 0\\) `;
	var ans=` \\(f(\\alpha) < 0, \\; f(\\beta) > 0, \\; f(\\gamma)< 0\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1)2:7, (2) \\(\\frac{52}{7} \\; cm\\) `;
	var cho2=` (1)1:4, (2) \\(\\frac{53}{7} \\; cm\\) `;
	var cho3=` (1)3:11, (2) \\(\\frac{50}{7} \\; cm\\) `;
	var ans=` (1)3:10, (2) \\(\\frac{50}{7} \\; cm\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
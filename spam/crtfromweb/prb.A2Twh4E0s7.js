
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(4\\sqrt{3} \\pi \\) `;
	var cho2=` \\(\\frac{14\\sqrt{3}}{3} \\pi \\) `;
	var cho3=` \\(\\frac{16\\sqrt{3}}{3} \\pi \\) `;
	var ans=` \\(\\frac{8\\sqrt{3}}{3} \\pi \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
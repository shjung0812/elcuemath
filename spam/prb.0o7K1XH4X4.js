
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(6 \\pi \\; cm\\) `;
	var cho2=` \\(\\frac{55}{9} \\pi \\; cm\\) `;
	var cho3=` \\(\\frac{19}{3} \\pi \\; cm\\) `;
	var ans=` \\(\\frac{56}{9} \\pi \\; cm\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
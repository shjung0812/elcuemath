
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{bc}{a+b}\\) `;
	var cho2=` \\(\\frac{6bc}{a+b}\\) `;
	var cho3=` \\(\\frac{a+b}{6bc}\\) `;
	var ans=` \\(\\frac{2b+3c}{a+b}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
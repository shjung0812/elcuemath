
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{9}{4}x+\\frac{3}{2}y\\) `;
	var cho2=` \\(\\frac{11}{3}x-\\frac{5}{2}y\\) `;
	var cho3=` \\(\\frac{5}{4}x+\\frac{1}{3}y\\) `;
	var ans=` \\(\\frac{11}{4}x+\\frac{1}{2}y\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
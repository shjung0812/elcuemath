
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{225}{27} \\pi \\) `;
	var cho2=` \\(\\frac{256}{31} \\pi \\) `;
	var cho3=` \\(\\frac{225}{31} \\pi \\) `;
	var ans=` \\(\\frac{256}{27} \\pi \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
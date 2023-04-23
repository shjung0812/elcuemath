
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{11}{10} - \\frac{3}{10}i\\) `;
	var cho2=` \\(\\frac{9}{10} + \\frac{5}{10}i\\) `;
	var cho3=` \\(\\frac{11}{10} - \\frac{5}{10}i\\) `;
	var ans=` \\(\\frac{9}{10} - \\frac{3}{10}i\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
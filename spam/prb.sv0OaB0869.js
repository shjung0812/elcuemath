
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{\\sqrt{3}+\\sqrt{11}}{5}\\) `;
	var cho2=` \\(\\frac{\\sqrt{13}+\\sqrt{5}}{25}\\) `;
	var cho3=` \\(\\frac{2\\sqrt{5}-\\sqrt{15}}{5}\\) `;
	var ans=` \\(\\frac{\\sqrt{5}+\\sqrt{15}}{5}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
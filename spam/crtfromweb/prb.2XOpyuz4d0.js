
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 첫째항: \\(\\frac{5}{4}\\), 공비: \\(\\frac{1}{16}\\) `;
	var cho2=` 첫째항: \\(\\frac{5}{4}\\), 공비: \\(\\frac{3}{16}\\) `;
	var cho3=` 첫째항: \\(\\frac{3}{4}\\), 공비: \\(\\frac{3}{16}\\) `;
	var ans=` 첫째항: \\(\\frac{3}{4}\\), 공비: \\(\\frac{1}{16}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
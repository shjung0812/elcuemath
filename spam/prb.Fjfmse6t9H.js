
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) \\(\\frac{23}{4} \\pi\\), (2) \\(\\frac{25}{4} \\pi + \\frac{23}{2}\\) `;
	var cho2=` (1) \\(\\frac{25}{4} \\pi\\), (2) \\(\\frac{23}{4} \\pi + \\frac{25}{2}\\) `;
	var cho3=` (1) \\(\\frac{23}{4} \\pi\\), (2) \\(\\frac{25}{4} \\pi + \\frac{19}{2}\\) `;
	var ans=` (1) \\(\\frac{25}{4} \\pi\\), (2) \\(\\frac{25}{4} \\pi + \\frac{21}{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
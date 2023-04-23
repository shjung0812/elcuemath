
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a-4 \\leq b-4 \\Rightarrow a < b\\) `;
	var cho2=` \\(12a > 12b \\Rightarrow a \\geq b\\) `;
	var cho3=` \\(a+3 > b+3 \\Rightarrow a \\geq b\\) `;
	var ans=` \\(-\\frac{a}{6} \\geq -\\frac{b}{6} \\Rightarrow a \\leq b\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
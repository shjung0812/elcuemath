
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((\\frac{x}{50} \\times 100) \\; g\\) `;
	var cho2=` \\((\\frac{100}{x} \\times 50) \\; g\\) `;
	var cho3=` \\((\\frac{50}{x} \\times 100) \\; g\\) `;
	var ans=` \\((\\frac{x}{100} \\times 50) \\; g\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
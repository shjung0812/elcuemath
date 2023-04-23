
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a=-\\frac{2}{5}, \\; b=\\frac{2}{5}\\) `;
	var cho2=` \\(a=-\\frac{9}{5}, \\; b=\\frac{9}{5}\\) `;
	var cho3=` \\(a=-\\frac{11}{5}, \\; b=\\frac{11}{5}\\) `;
	var ans=` \\(a=-\\frac{8}{5}, \\; b=\\frac{8}{5}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
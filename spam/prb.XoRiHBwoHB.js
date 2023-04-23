
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x=-\\frac{13}{7}, \\; y=-\\frac{11}{14}\\) `;
	var cho2=` \\(x=\\frac{15}{7}, \\; y=\\frac{11}{14}\\) `;
	var cho3=` \\(x=\\frac{13}{7}, \\; y=-\\frac{13}{14}\\) `;
	var ans=` \\(x=-\\frac{15}{7}, \\; y=\\frac{13}{14}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
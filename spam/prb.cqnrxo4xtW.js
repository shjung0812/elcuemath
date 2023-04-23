
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-\\sqrt{2} \\times \\sqrt{8} = -4\\) `;
	var cho2=` \\(\\sqrt{5} \\times \\sqrt{11} = \\sqrt{55}\\) `;
	var cho3=` \\(\\sqrt{\\frac{3}{4}} \\times 2 \\sqrt{\\frac{7}{6}} = 2\\sqrt{\\frac{7}{8}}\\) `;
	var ans=` \\(\\sqrt{\\frac{5}{2}} \\times \\sqrt{\\frac{6}{5}}=3\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
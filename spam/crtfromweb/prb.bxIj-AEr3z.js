
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sin A = \\frac{\\sqrt{5}}{5}, \\; \\cos A = \\frac{\\sqrt{5}}{5}, \\; \\tan A = 1\\) `;
	var cho2=` \\(\\sin A = \\frac{3\\sqrt{5}}{5}, \\; \\cos A = \\frac{\\sqrt{5}}{5}, \\; \\tan A = 3\\) `;
	var cho3=` \\(\\sin A = \\frac{\\sqrt{5}}{5}, \\; \\cos A = \\frac{4\\sqrt{5}}{5}, \\; \\tan A = 2\\) `;
	var ans=` \\(\\sin A = \\frac{2\\sqrt{5}}{5}, \\; \\cos A = \\frac{\\sqrt{5}}{5}, \\; \\tan A = 2\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
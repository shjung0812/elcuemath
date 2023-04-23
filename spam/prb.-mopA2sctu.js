
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sqrt{0.75}, \\; \\sqrt{\\frac{3}{121}}, \\; \\frac{\\sqrt{3}}{6}\\) `;
	var cho2=` \\( \\frac{\\sqrt{3}}{6}, \\; \\sqrt{0.75}, \\; \\sqrt{\\frac{3}{121}}\\) `;
	var cho3=` \\( \\sqrt{\\frac{3}{121}}, \\; \\sqrt{0.75}, \\; \\frac{\\sqrt{3}}{6}\\) `;
	var ans=` \\(\\sqrt{0.75}, \\; \\frac{\\sqrt{3}}{6}, \\; \\sqrt{\\frac{3}{121}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(3, \\; \\frac{3\\pm 3\\sqrt{3}i}{2}\\) `;
	var cho2=` \\(2, \\; \\frac{-3\\pm 3\\sqrt{2}i}{2}\\) `;
	var cho3=` \\(-2, \\; \\frac{-3\\pm 3\\sqrt{2}}{2}\\) `;
	var ans=` \\(3, \\; \\frac{-3\\pm 3\\sqrt{3}i}{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
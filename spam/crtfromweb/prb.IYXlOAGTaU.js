
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(3\\sqrt{10}\\) `;
	var cho2=` \\(\\frac{4\\sqrt{10}}{5}\\) `;
	var cho3=` \\(\\frac{\\sqrt{10}}{2}\\) `;
	var ans=` \\(\\frac{7 \\sqrt{10}}{10}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
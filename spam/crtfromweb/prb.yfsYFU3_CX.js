
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(3 \\sin 50^{\\circ}\\) `;
	var cho2=` \\(3 \\sin 66 ^{\\circ}\\) `;
	var cho3=` \\(\\frac{3\\sin 50^{\\circ}}{\\cos 66 ^{\\circ}}\\) `;
	var ans=` \\(\\frac{3\\sin 50^{\\circ}}{\\sin 66 ^{\\circ}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
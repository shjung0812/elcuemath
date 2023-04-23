
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y=\\frac{1}{3}\\) 또는 \\(4x+3y-1=0\\) `;
	var cho2=` \\(y=\\frac{1}{5}\\) 또는 \\(4x+2y-2=0\\) `;
	var cho3=` \\(y=\\frac{1}{3}\\) 또는 \\(3x-y=0\\) `;
	var ans=` \\(y=\\frac{1}{5}\\) 또는 \\(4x+3y-3=0\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=`  \\(\\frac{1-x}{4} < 1\\)  `;
	var cho2=`  \\(\\frac{1}{3}+1 < \\frac{1}{2}+\\frac{1}{2}\\)  `;
	var cho3=`  \\(2 < x + 5\\)  `;
	var ans=`  \\(\\frac{1}{3}x+1 < \\frac{1}{2}x+\\frac{1}{2}\\)  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
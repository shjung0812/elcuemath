
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sqrt{5}+\\sqrt{2} < \\sqrt{5}+1\\) `;
	var cho2=` \\(3+\\sqrt{2} > \\sqrt{9}+2\\) `;
	var cho3=` \\(-\\sqrt{18} > -4\\) `;
	var ans=` \\(3\\sqrt{5}+\\sqrt{6} > 2\\sqrt{11}+\\sqrt{6}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
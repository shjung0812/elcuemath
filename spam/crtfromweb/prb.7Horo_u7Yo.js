
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(1< x+2 \\leq 5\\) `;
	var cho2=` \\(-6 6x \\leq 18\\) `;
	var cho3=` \\(1 \\leq 4-x < 5\\) `;
	var ans=` \\(-15 < -5x \\leq 5 \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
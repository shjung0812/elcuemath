
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(43 \\sqrt{3} \\; m\\) `;
	var cho2=` \\(52 \\sqrt{2} \\; m\\) `;
	var cho3=` \\(43 \\sqrt{2} \\; m\\) `;
	var ans=` \\(50 \\sqrt{3} \\; m\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(20(\\sqrt{2}+\\sqrt{3}) \\; m\\) `;
	var cho2=` \\(20(\\sqrt{2}+\\sqrt{6}) \\; m\\) `;
	var cho3=` \\(30(\\sqrt{2}+\\sqrt{3}) \\; m\\) `;
	var ans=` \\(40(\\sqrt{2}+\\sqrt{6}) \\; m\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
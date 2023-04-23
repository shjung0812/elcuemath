
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(20 ^{\\circ} \\) 미만 `;
	var cho2=` \\(19 ^{\\circ} \\) 초과 `;
	var cho3=` \\(18 ^{\\circ} \\) 초과 `;
	var ans=` \\(21 ^{\\circ} \\) 미만 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
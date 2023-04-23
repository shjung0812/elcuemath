
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((a+1+b)(a+1-b)\\) `;
	var cho2=` \\((a+3+b)(a+3-b)\\) `;
	var cho3=` \\((-a+2+b)(a+3-b)\\) `;
	var ans=` \\((a+7+b)(a+7-b)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
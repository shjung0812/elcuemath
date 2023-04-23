
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(2 \\times (3\\times a+b) \\times x \\times y\\) `;
	var cho2=` \\(2 \\times (x+b) \\times a \\times y\\) `;
	var cho3=` \\(3 \\times (a+b) \\times (x + y)\\) `;
	var ans=` \\(3 \\times (a+b) \\times x \\times y\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((2\\div x-4 \\div y) \\div 3\\) `;
	var cho2=` \\((x \\times y) \\div 3\\) `;
	var cho3=` \\(3 \\div (x \\times y )\\) `;
	var ans=` \\((x-y) \\div 3\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
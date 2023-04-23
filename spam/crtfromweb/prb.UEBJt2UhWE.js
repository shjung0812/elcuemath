
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(A: 42 \\pi , \\; B: 36 \\pi\\) `;
	var cho2=` \\(A: 36 \\pi , \\; B: 42 \\pi\\) `;
	var cho3=` \\(A: 31 \\pi , \\; B: 32 \\pi\\) `;
	var ans=` \\(A: 36 \\pi , \\; B: 36 \\pi\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
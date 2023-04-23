
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((1) 24 \\pi \\; cm^{3}, \\; (2) 9 \\)분 `;
	var cho2=` \\((1) 24 \\pi \\; cm^{3}, \\; (2)  8\\)분 `;
	var cho3=` \\((1) 27 \\pi \\; cm^{3}, \\; (2) 8 \\)분 `;
	var ans=` \\((1) 27 \\pi \\; cm^{3}, \\; (2) 9 \\)분 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
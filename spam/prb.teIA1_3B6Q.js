
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(23 \\sqrt{5} \\; cm\\) `;
	var cho2=` \\(27 \\sqrt{6} \\; cm\\) `;
	var cho3=` \\(29 \\sqrt{6} \\; cm\\) `;
	var ans=` \\(28 \\sqrt{5} \\; cm\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
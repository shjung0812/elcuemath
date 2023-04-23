
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sqrt{20}, \\; \\sqrt{23} \\) `;
	var cho2=` \\(\\sqrt{32}, \\; \\sqrt{35}, \\; \\sqrt{38}\\) `;
	var cho3=` \\(\\sqrt{32}, \\; \\sqrt{35}\\) `;
	var ans=` \\(\\sqrt{27}, \\; \\sqrt{32}, \\; \\sqrt{35}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
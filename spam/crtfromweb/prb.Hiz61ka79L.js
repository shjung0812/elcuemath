
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a < x < 0\\) 또는 \\(c  < x < d\\) `;
	var cho2=` \\(b < x < 0\\) 또는 \\(x > d\\) `;
	var cho3=` \\(x < a \\) 또는 \\(c  < x < d\\) `;
	var ans=` \\(a < x < b\\) 또는 \\(0  < x < d\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
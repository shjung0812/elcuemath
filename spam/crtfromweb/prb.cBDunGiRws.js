
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y=3\\) 또는 \\(12x-5y-26=0\\) `;
	var cho2=` \\(y=2\\) 또는 \\(12x-5y+26=0\\) `;
	var cho3=` \\(y=3\\) 또는 \\(12x+5y+26=0\\) `;
	var ans=` \\(y=2\\) 또는 \\(12x-5y-26=0\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
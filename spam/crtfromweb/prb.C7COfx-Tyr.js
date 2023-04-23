
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x=-3\\) 또는 \\(x=3\\) `;
	var cho2=` \\(x=-1\\) 또는 \\(x=1\\) `;
	var cho3=` \\(x=0\\) `;
	var ans=` \\(x=-2\\) 또는 \\(x=2\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\log 0.0761 = -1.1186\\) `;
	var cho2=` \\(\\log 7610 = 3.8814\\) `;
	var cho3=` \\(\\log 761 = 2.8814\\) `;
	var ans=` \\(\\log 0.761=-0.8814\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
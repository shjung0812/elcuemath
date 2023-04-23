
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((-7) \\times (+2) = 14\\) `;
	var cho2=` \\((-2) \\times (-4) = -8\\) `;
	var cho3=` \\((+2) \\times (-6) =12\\) `;
	var ans=` \\((-8) \\times (-6) = 48\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
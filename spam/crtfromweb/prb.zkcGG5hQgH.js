
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(20a+\\frac{1}{24}b\\) `;
	var cho2=` \\(20a+\\frac{1}{20}\\) `;
	var cho3=` \\(25a+\\frac{1}{25}b\\) `;
	var ans=` \\(20a+\\frac{1}{25}b\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
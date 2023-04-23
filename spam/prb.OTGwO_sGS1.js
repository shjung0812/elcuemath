
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{a-b+c}{3} = 72\\) `;
	var cho2=` \\(a+b+c = 72\\) `;
	var cho3=` \\(\\frac{3a+b+2c}{6} = 72\\) `;
	var ans=` \\(\\frac{a+b+c}{3} = 72\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
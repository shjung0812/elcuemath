
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(b=\\frac{2}{19}a\\) `;
	var cho2=` \\(b=a+\\frac{2}{19}a\\) `;
	var cho3=` \\(b=-\\frac{2}{19}a\\) `;
	var ans=` \\(b=a-\\frac{2}{19}a\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
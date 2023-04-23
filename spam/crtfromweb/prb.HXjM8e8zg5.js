
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-a=b\\)이면 \\(4-a=b+4\\) `;
	var cho2=` \\(3a=2b\\)이면 \\(\\frac{a}{2}=\\frac{b}{3}\\) `;
	var cho3=` \\(\\frac{a}{3}=b\\)이면 \\(a=3b\\)이다.  `;
	var ans=` \\(a=3b\\)이면 \\(a-3=3(b-3)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
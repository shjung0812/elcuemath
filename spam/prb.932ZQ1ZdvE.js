
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y=-\\frac{5}{4}x^{2}-3\\) `;
	var cho2=` \\(y=-\\frac{3}{4}x^{2}-3\\) `;
	var cho3=` \\(y=-\\frac{5}{4}x^{2}-2\\) `;
	var ans=` \\(y=-\\frac{3}{4}x^{2}-4\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
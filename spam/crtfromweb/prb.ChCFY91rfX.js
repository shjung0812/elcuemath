
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=`  \\(x=2\\) 또는 \\(x=\\frac{2}{4}\\)  `;
	var cho2=`  \\(x=-\\frac{2}{3}\\) 또는 \\(x=-6\\)  `;
	var cho3=`  \\(x=1\\) 또는 \\(x=4\\)  `;
	var ans=`  \\(x=4\\) 또는 \\(x=\\frac{5}{3}\\)  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(f(x)=5x^{2}+3x-1\\) `;
	var cho2=` \\(f(x)=3x^{2}-3x+2\\) `;
	var cho3=` \\(f(x)=5x^{2}+x+3\\) `;
	var ans=` \\(f(x)=3x^{2}-3x-1\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
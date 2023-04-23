
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(f(x)=x^{3}+2x^{2}+3\\) `;
	var cho2=` \\(f(x)=-x^{3}-x^{2}+1\\) `;
	var cho3=` \\(f(x)=2x^{3}-x^{2}+4\\) `;
	var ans=` \\(f(x)=-x^{3}+3x^{2}+4\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
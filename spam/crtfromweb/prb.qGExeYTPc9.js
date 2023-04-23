
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y=x^{2}-6x+4\\) `;
	var cho2=` \\(y=3x^{2}-2x+3\\) `;
	var cho3=` \\(y=3x^{2}-x+5\\) `;
	var ans=` \\(y=3x^{2}-6x+4\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
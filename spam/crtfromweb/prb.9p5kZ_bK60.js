
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(2(x+1)^{2}=8\\) `;
	var cho2=` \\(x^{2}-4=0\\) `;
	var cho3=` \\(x^{2}-6x+5=0\\) `;
	var ans=` \\(2x^{2}+5x-1=0\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
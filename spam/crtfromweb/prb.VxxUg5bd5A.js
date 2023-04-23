
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(3x^{2}+4x+2=0\\) `;
	var cho2=` \\(3x^{2}+8x=0\\) `;
	var cho3=` \\(3x^{2}+4x+6=0\\) `;
	var ans=` \\(3x^{2}+8x+3=0\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
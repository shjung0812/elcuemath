
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(9x^{2}-3x+2=0\\) `;
	var cho2=` \\(9x^{2}-x+6=0\\) `;
	var cho3=` \\(9x^{2}+x+3=0\\) `;
	var ans=` \\(9x^{2}-6x+1=0\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
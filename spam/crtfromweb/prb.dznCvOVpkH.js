
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 모든 실수 \\(x\\)에 대하여 \\(x^{2}-3x+3 \\leq 0\\)이다. `;
	var cho2=` 모든 실수 \\(x\\)에 대하여 \\(x^{2}-3x+3 = 0\\)이다. `;
	var cho3=` 모든 실수 \\(x\\)에 대하여 \\(x^{2}-3x+3 \\geq 0\\)이다. `;
	var ans=` 모든 실수 \\(x\\)에 대하여 \\(x^{2}-3x+3 > 0\\)이다. `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
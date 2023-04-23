
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 몫: \\(2x^{2}+3x+2\\), 나머지 : 12 `;
	var cho2=` 몫: \\(x^{2}-x+3\\), 나머지 : 12 `;
	var cho3=` 몫: \\(3x^{2}-x+7\\), 나머지 : 17 `;
	var ans=` 몫: \\(x^{2}+4x+7\\), 나머지 : 17 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
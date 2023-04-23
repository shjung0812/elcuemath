
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 몫: \\(2x^{2}-3x+1\\), 나머지: 3 `;
	var cho2=` 몫: \\(x^{2}-x+2\\), 나머지: 3 `;
	var cho3=` 몫: \\(3x^{2}+2x+2\\), 나머지: 2 `;
	var ans=` 몫: \\(2x^{2}-2x+2\\), 나머지: 2 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
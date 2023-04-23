
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 0.003, 유한소수로 나타낼 수 있다.  `;
	var cho2=` 0.002, 유한소수로 나타낼 수 있다.  `;
	var cho3=` 0.001, 유한소수로 나타낼 수 있다.  `;
	var ans=` 유한소수로 나타낼 수 없다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
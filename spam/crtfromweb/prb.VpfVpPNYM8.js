
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=`  \\(0.58\\), 유한소수  `;
	var cho2=`  \\(0.45111 \\cdots \\), 무한소수  `;
	var cho3=`  \\(0.45\\), 유한소수  `;
	var ans=`  \\(0.58333 \\cdots \\), 무한소수  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
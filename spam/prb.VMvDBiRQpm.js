
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 64의 세제곱근은 \\(\\sqrt[3]{64}\\) 뿐이다. `;
	var cho2=` -8의 세제곱근 중 실수인 것은 없다.  `;
	var cho3=` n이 짝수일 때, -4의 n제곱근 중 실수인 것은 두 개이다.  `;
	var ans=` n이 홀수일 때, 3의 n 제곱근 중 실수인 것은 한개이다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
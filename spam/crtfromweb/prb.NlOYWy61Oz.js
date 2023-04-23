
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` -2 는 -4의 제곱근이다.  `;
	var cho2=` 0의 제곱근은 없다.  `;
	var cho3=` 제곱근 5와 5의 제곱근은 서로 같다.  `;
	var ans=` 25의 제곱근은 \\(\\pm 5\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
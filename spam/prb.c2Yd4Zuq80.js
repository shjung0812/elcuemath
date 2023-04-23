
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 도서의 원가 : \\(8000\\)원 , 판매가격 : \\(10200\\)원 `;
	var cho2=` 도서의 원가 : \\(9000\\)원 , 판매가격 : \\(10000\\)원 `;
	var cho3=` 도서의 원가 : \\(10000\\)원 , 판매가격 : \\(9000\\)원 `;
	var ans=` 도서의 원가 : \\(9000\\)원 , 판매가격 : \\(10200\\)원 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) 정삼각형 (2) 마름모 `;
	var cho2=` (1) 이등변삼각형 (2) 정사각형 `;
	var cho3=` (1) 직각삼각형 (2) 평행사변형 `;
	var ans=` (1) 이등변삼각형 (2) 마름모 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
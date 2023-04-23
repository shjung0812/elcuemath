
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (ㄱ): \\(10 \\) 분 , (ㄴ): \\(\\frac{8}{9} km \\) `;
	var cho2=` (ㄱ): \\(\\frac{41}{3}\\) 분 , (ㄴ): \\(1\\;  km \\) `;
	var cho3=` (ㄱ): \\(\\frac{42}{3} \\) 분 , (ㄴ): \\(\\frac{7}{9} km \\) `;
	var ans=` (ㄱ): \\(\\frac{40}{3} \\) 분 , (ㄴ): \\(\\frac{8}{9} km \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
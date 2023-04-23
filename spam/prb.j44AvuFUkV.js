
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (ㄱ): 교환법칙 (ㄴ): 교환법칙 `;
	var cho2=` (ㄱ): 결합법칙 (ㄴ): 결합법칙 `;
	var cho3=` (ㄱ): 결합법칙 (ㄴ): 교환법칙 `;
	var ans=` (ㄱ): 교환법칙 (ㄴ): 결합법칙 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
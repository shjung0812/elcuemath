
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 자: ㄱ, ㄴ, 컴퍼스: ㄷ, ㄹ `;
	var cho2=` 자: ㄱ, ㄹ, 컴퍼스: ㄴ, ㄷ `;
	var cho3=` 자: ㄱ, ㄹ, 컴퍼스: ㄴ, ㅁ `;
	var ans=` 자: ㄱ, ㄷ, 컴퍼스: ㄴ, ㄹ `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
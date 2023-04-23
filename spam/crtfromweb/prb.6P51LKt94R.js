
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=`  (a) : (ㄴ), (b) :  (ㄹ) `;
	var cho2=`  (a) : (ㄹ), (b) :  (ㄱ) `;
	var cho3=`  (a) : (ㄴ), (b) :  (ㄷ) `;
	var ans=`  (a) : (ㄷ), (b) :  (ㄱ) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
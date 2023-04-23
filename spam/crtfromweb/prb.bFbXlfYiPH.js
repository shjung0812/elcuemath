
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 140쪽 이상 160쪽 미만 `;
	var cho2=` 160쪽 이상 190쪽 미만 `;
	var cho3=` 160쪽 이상 200쪽 미만 `;
	var ans=` 150쪽 이상 180쪽 미만 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
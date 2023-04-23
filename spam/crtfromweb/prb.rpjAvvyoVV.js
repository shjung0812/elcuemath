
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 최대값 : 12 최솟값 -12 `;
	var cho2=` 최대값 : 32 최솟값 -32 `;
	var cho3=` 최대값 : 24 최솟값 -28 `;
	var ans=` 최대값 : 22 최솟값 -22 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
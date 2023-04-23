
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (a): 6분 (b):240 m  (c): 분속 50m `;
	var cho2=` (a): 6분 (b):140 m  (c): 분속 50m `;
	var cho3=` (a): 8분 (b):140 m  (c): 분속 20m `;
	var ans=` (a): 8분 (b):240 m  (c): 분속 30m `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
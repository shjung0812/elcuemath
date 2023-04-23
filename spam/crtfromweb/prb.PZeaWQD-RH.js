
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) 140 m, (2) 7분, (3) B, A, C `;
	var cho2=` (1) 150 m, (2) 4분, (3) B, A, C `;
	var cho3=` (1) 140 m, (2) 6분, (3) B, C, A `;
	var ans=` (1) 150 m, (2) 6분, (3) B, C, A `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
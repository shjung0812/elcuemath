
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 면ABCD, 면BFGC, 면 CGHD, 면 AEHD `;
	var cho2=` 면ABFE, 면BFGC, 면 CGHD, 면 AEGC `;
	var cho3=` 면ABFE, 면EFGH, 면 CGHD, 면 AEHD `;
	var ans=` 면ABFE, 면BFGC, 면 CGHD, 면 AEHD `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
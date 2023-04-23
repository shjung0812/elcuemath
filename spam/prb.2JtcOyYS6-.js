
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 1, 2, 7, 14, 49, 98, 102, 140 `;
	var cho2=` 1, 2, 3, 5,  7, 14, 30, 49, 98 `;
	var cho3=` 1, 2, 14, 30, 40, 98 `;
	var ans=` 1, 2, 7, 14, 49, 98 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
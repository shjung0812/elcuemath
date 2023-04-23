
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 1, 2, 7, 14, 49, 98 `;
	var cho2=` 1, 3, 5, 15, 25, 75 `;
	var cho3=` 1, 3, 5, 15, 20, 30 `;
	var ans=` 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
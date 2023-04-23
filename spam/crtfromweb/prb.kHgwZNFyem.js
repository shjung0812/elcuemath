
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 1, 5, 8, 10, 16, 20, 40, 80 `;
	var cho2=` 1, 2, 4, 5, 8, 25, 46, 80 `;
	var cho3=` 1, 2, 4, 5, 8, 10, 16, 19, 80 `;
	var ans=` 1, 2, 4, 5, 8, 10, 16, 20, 40, 80 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 1, 2, 18, 27, 54, 81, 162 `;
	var cho2=` 1, 2,  27, 54, 81, 162, 292, 388 `;
	var cho3=` 1, 2,  27, 54, 81, 462 `;
	var ans=` 1, 2, 3, 6, 9, 18, 27, 54, 81, 162 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
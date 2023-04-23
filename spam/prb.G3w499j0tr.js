
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) 5:2 ,  (2) 5:2:16 `;
	var cho2=` (1) 5:2 ,  (2) 2:3:17 `;
	var cho3=` (1) 3:2 ,  (2) 5:7:17 `;
	var ans=` (1) 5:3 ,  (2) 5:3:16 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
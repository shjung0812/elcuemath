
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1)2:1, (2)1:1, (3)3:4, (4)3:80 `;
	var cho2=` (1)1:4, (2)2:1, (3)3:4, (4)1:30 `;
	var cho3=` (1)2:3, (2)1:2, (3)1:3, (4)1:20 `;
	var ans=` (1)1:4, (2)1:1, (3)2:3, (4)3:80 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
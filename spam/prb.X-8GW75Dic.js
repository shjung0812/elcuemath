
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(5, \\; 6, \\; 7, \\; \\dots , 12\\) `;
	var cho2=` \\(11, \\; 12, \\; 13, \\; \\dots , 18\\) `;
	var cho3=` \\(6, \\; 7, \\; 8, \\; \\dots , 18\\) `;
	var ans=` \\(9, \\; 10, \\; 11, \\; \\dots , 15\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
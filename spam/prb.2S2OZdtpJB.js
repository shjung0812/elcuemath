
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(134.1 \\leq m \\leq 152.4\\) `;
	var cho2=` \\(127.1 \\leq m \\leq 162.3\\) `;
	var cho3=` \\(127.1 \\leq m \\leq 172.9\\) `;
	var ans=` \\(137.1 \\leq m \\leq 162.9\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) \\(x=5, \\; y=3\\), (2) 23 `;
	var cho2=` (1) \\(x=1, \\; y=2\\), (2) 23 `;
	var cho3=` (1) \\(x=5, \\; y=2\\), (2) 21 `;
	var ans=` (1) \\(x=9, \\; y=2\\), (2) 21 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
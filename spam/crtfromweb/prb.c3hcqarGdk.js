
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(2 \\times a \\times b+1\\) `;
	var cho2=` \\(3 \\times 3a \\times 3b\\) `;
	var cho3=` \\( (-a) \\times 3 \\times b\\) `;
	var ans=` \\(3 \\times a \\times b\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
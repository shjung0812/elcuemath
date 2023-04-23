
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(A\\)가게, \\(0.02x\\)원 `;
	var cho2=` \\(B\\)가게, \\(0.03x\\)원 `;
	var cho3=` \\(A\\)가게, \\(0.3x\\)원 `;
	var ans=` \\(A\\)가게, \\(0.03x\\)원 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
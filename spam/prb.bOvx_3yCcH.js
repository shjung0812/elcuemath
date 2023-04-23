
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(5 \\% \\) 이상 \\(6 \\% \\)이하 `;
	var cho2=` \\(5 \\% \\) 이상 \\(7 \\% \\)이하 `;
	var cho3=` \\(7 \\% \\) 이상 \\(8 \\% \\)이하 `;
	var ans=` \\(4 \\% \\) 이상 \\(6 \\% \\)이하 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
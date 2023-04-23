
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a_2 = 132, \\; a_{n+1}=2a_n - 5, \\; (n=1, 2, 3, \\cdots)\\) `;
	var cho2=` \\(a_2 = 135, \\; a_{n+1}=3a_n - 12, \\; (n=1, 2, 3, \\cdots)\\) `;
	var cho3=` \\(a_2 = 135, \\; a_{n+1}=2a_n - 5, \\; (n=1, 2, 3, \\cdots)\\) `;
	var ans=` \\(a_2 = 132, \\; a_{n+1}=3a_n - 12, \\; (n=1, 2, 3, \\cdots)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
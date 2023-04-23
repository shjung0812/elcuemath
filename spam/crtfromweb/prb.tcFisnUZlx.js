
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\{3, 2, 7 9, 10\\}\\) `;
	var cho2=` \\(\\{ 1,3,5,9, 11\\}\\) `;
	var cho3=` \\(\\varnothing\\) `;
	var ans=` \\(\\{3, 4, 5, 9, 10\\}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
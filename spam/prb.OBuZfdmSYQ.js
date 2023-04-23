
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1)\\(28:1\\), (2)\\(310 \\pi cm^{3}\\) `;
	var cho2=` (1)\\(26:1\\), (2)\\(314 \\pi cm^{3}\\) `;
	var cho3=` (1)\\(25:1\\), (2)\\(312 \\pi cm^{3}\\) `;
	var ans=` (1)\\(27:1\\), (2)\\(312 \\pi cm^{3}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
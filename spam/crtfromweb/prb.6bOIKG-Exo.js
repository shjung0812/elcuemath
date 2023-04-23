
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-8a^{3}+6ab-2a\\) `;
	var cho2=` \\(-2a^{3}+8ab-6a\\) `;
	var cho3=` \\(-8a^{3}+6ab-8a\\) `;
	var ans=` \\(-6a^{3}+8ab-2a\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
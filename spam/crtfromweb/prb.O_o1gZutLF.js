
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(2a^{2}+2b^{2}+2c^{2}\\) `;
	var cho2=` \\(4a^{2}+4b^{2}+4c^{2}-8ab-8bc-8ca\\) `;
	var cho3=` \\(4a^{2}+4b^{2}+4c^{2}+8ab+8bc+8ca\\) `;
	var ans=` \\(4a^{2}+4b^{2}+4c^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
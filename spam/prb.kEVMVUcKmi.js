
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(3a^{2}-ab+4b^{2}-2c^{2}\\) `;
	var cho2=` \\(3a^{2}+3ab-2b^{2}+3c^{2}\\) `;
	var cho3=` \\(9a^{2}-ab+2b^{2}-5c^{2}\\) `;
	var ans=` \\(9a^{2}-6ab+b^{2}-4c^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
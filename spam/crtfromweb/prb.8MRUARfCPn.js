
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sqrt[12]{a^{2}b^{7}}\\) `;
	var cho2=` \\(\\sqrt[4]{a^{3}b}\\) `;
	var cho3=` \\(\\sqrt[3]{a^{2}b^{2}}\\) `;
	var ans=` \\(\\sqrt[6]{ab^{4}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
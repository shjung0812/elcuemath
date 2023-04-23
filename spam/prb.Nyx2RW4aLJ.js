
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{3}{2}a^{2}-\\frac{1}{3}a^{2}b-2ab\\) `;
	var cho2=` \\(5a^{2}-2a^{2}b+ab\\) `;
	var cho3=` \\(5a^{2}-a^{2}b-3ab\\) `;
	var ans=` \\(\\frac{5}{2}a^{2}-3a^{2}b-2ab\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
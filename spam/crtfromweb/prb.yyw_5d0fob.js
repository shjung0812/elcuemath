
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x \\times x^{2} \\times x^{3} \\times x^{4} = x^{24}\\) `;
	var cho2=` \\(x^{15} \\div x \\div (x^{5})^{2} = x^{5}\\) `;
	var cho3=` \\((-1)^{n} \\times (-1)^{n+1}=1\\) `;
	var ans=` \\(2^{2n} \\div 16^{n} \\times 4^{n+1}=2^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
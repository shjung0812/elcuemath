
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((x^{3}y)^{4} = x^{12}y^{4}\\) `;
	var cho2=` \\((-3a^{3})^{2} = 9a^{6}\\) `;
	var cho3=` \\((-xy^{2}z^{3})^{5} = -x^{5}y^{10}z^{15}\\) `;
	var ans=` \\((2a^{2}b^{3})^{2} = 2a^{4}b^{6}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
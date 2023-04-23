
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(4 \\times x \\times x \\times y \\times y \\times z\\) `;
	var cho2=` \\((-2) \\times x \\times x \\times x \\times y \\times z\\) `;
	var cho3=` \\((-4) \\times x \\times y \\times y \\times z \\times z\\) `;
	var ans=` \\((-2) \\times x \\times x \\times y \\times y \\times z\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
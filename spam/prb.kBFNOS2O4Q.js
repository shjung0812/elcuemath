
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sqrt[3]{2}\\times \\sqrt[4]{2} = \\sqrt[12]{2^{7}}\\) `;
	var cho2=` \\(\\sqrt[3]{-\\sqrt{64}} = -2\\) `;
	var cho3=` \\(\\sqrt[3]{\\sqrt[5]{8}} = \\sqrt[5]{2}\\) `;
	var ans=` \\(\\left( \\sqrt[3]{7} \\times \\frac{1}{\\sqrt{7}} \\right)^{6} = 7\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
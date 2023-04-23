
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(q-\\frac{1}{q}\\) `;
	var cho2=` \\(1+\\frac{1}{q}\\) `;
	var cho3=` \\(\\sqrt{q}-\\frac{1}{\\sqrt{q}}\\) `;
	var ans=` \\(\\sqrt{q}+\\frac{1}{\\sqrt{q}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
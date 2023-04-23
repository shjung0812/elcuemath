
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(10\\sqrt{3}\\) `;
	var cho2=` \\(10(\\sqrt{5}-1)m\\) `;
	var cho3=` \\(\\frac{10(5-\\sqrt{3})}{3} \\; m\\) `;
	var ans=` \\(\\frac{10(3+\\sqrt{3})}{3} \\; m\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
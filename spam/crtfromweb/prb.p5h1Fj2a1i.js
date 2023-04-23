
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(m \\leq -\\sqrt{3}\\) 또는 \\(m > \\sqrt{3}\\) `;
	var cho2=` \\(m < -\\sqrt{5}\\) 또는 \\(m > \\sqrt{5}\\) `;
	var cho3=` \\(m < -\\sqrt{5}\\) 또는 \\(m \\geq \\sqrt{5}\\) `;
	var ans=` \\(m < -\\sqrt{3}\\) 또는 \\(m > \\sqrt{3}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
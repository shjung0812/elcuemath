
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x < -\\sqrt{5}\\) 또는 \\(x > \\sqrt{5}\\) `;
	var cho2=` \\(x < -\\sqrt{3}\\) 또는 \\(x > \\sqrt{3}\\) `;
	var cho3=` \\(x < -\\sqrt{7}\\) 또는 \\(x > \\sqrt{7}\\) `;
	var ans=` \\(x < -\\sqrt{6}\\) 또는 \\(x > \\sqrt{6}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
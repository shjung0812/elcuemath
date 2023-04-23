
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sqrt{5}-1 > 1\\) `;
	var cho2=` \\( \\sqrt{11}-2 > -2+\\sqrt{10} \\) `;
	var cho3=` \\(2-\\sqrt{3} < \\sqrt{6}-\\sqrt{3}\\) `;
	var ans=` \\(\\sqrt{7}+3 < \\sqrt{7}+\\sqrt{8}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
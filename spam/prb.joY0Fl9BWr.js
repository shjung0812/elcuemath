
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((15\\sqrt{3}-\\frac{17}{3} \\pi ) \\; cm^{2}\\) `;
	var cho2=` \\((13\\sqrt{3}-\\frac{14}{3} \\pi ) \\; cm^{2}\\) `;
	var cho3=` \\((11\\sqrt{3}-\\frac{13}{3} \\pi ) \\; cm^{2}\\) `;
	var ans=` \\((16\\sqrt{3}-\\frac{16}{3} \\pi ) \\; cm^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
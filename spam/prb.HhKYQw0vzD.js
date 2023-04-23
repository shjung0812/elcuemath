
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) \\(3\\sqrt{10}\\), (2) \\(\\frac{11\\sqrt{10}}{5}\\), (3) \\(11\\) `;
	var cho2=` (1) \\(\\sqrt{10}\\), (2) \\(\\frac{11\\sqrt{10}}{5}\\), (3) \\(12\\) `;
	var cho3=` (1) \\(2\\sqrt{10}\\), (2) \\(\\frac{11\\sqrt{10}}{5}\\), (3) \\(22\\) `;
	var ans=` (1) \\(\\sqrt{10}\\), (2) \\(\\frac{11\\sqrt{10}}{5}\\), (3) \\(11\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
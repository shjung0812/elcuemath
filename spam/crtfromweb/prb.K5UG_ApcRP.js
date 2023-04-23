
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle x = 70^{\\circ}\\) \\(\\angle y = 66^{\\circ}\\) `;
	var cho2=` \\(\\angle x = 75^{\\circ}\\) \\(\\angle y = 70^{\\circ}\\) `;
	var cho3=` \\(\\angle x = 70^{\\circ}\\) \\(\\angle y = 85^{\\circ}\\) `;
	var ans=` \\(\\angle x = 75^{\\circ}\\) \\(\\angle y = 68^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
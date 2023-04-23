
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle = 80^{\\circ}, \\; \\angle y = 70^{\\circ}\\) `;
	var cho2=` \\(\\angle = 80^{\\circ}, \\; \\angle y = 75^{\\circ}\\) `;
	var cho3=` \\(\\angle = 85^{\\circ}, \\; \\angle y = 80^{\\circ}\\) `;
	var ans=` \\(\\angle = 85^{\\circ}, \\; \\angle y = 75^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
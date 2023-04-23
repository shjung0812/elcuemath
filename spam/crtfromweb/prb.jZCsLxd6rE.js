
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(90^{\\circ} - 2\\angle x\\) `;
	var cho2=` \\(90^{\\circ} - \\frac{1}{2}\\angle x\\) `;
	var cho3=` \\(90^{\\circ} - \\frac{3}{2}\\angle x\\) `;
	var ans=` \\(90^{\\circ} - \\angle x\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle ABC = 40^{\\circ}\\) \\(\\angle BAC = 106^{\\circ}\\) `;
	var cho2=` \\(\\angle ABC = 37^{\\circ}\\) \\(\\angle BAC = 105^{\\circ}\\) `;
	var cho3=` \\(\\angle ABC = 36^{\\circ}\\) \\(\\angle BAC = 110^{\\circ}\\) `;
	var ans=` \\(\\angle ABC = 36^{\\circ}\\) \\(\\angle BAC = 108^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
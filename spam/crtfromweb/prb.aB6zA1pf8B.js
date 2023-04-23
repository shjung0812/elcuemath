
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle CDE = 63^{\\circ}\\) \\(\\angle DIE = 125^{\\circ}\\) `;
	var cho2=` \\(\\angle CDE = 61^{\\circ}\\) \\(\\angle DIE = 127^{\\circ}\\) `;
	var cho3=` \\(\\angle CDE = 61^{\\circ}\\) \\(\\angle DIE = 125^{\\circ}\\) `;
	var ans=` \\(\\angle CDE = 64^{\\circ}\\) \\(\\angle DIE = 128^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
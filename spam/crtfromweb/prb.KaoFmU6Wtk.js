
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle x = 20^{\\circ}, \\angle y = 125^{\\circ}\\) `;
	var cho2=` \\(\\angle x = 30^{\\circ}, \\angle y = 115^{\\circ}\\) `;
	var cho3=` \\(\\angle x = 30^{\\circ}, \\angle y = 110^{\\circ}\\) `;
	var ans=` \\(\\angle x = 25^{\\circ}, \\angle y = 115^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle APB = 80^{\\circ}, \\angle PAC=30^{\\circ}\\) `;
	var cho2=` \\(\\angle APB = 75^{\\circ}, \\angle PAC=25^{\\circ}\\) `;
	var cho3=` \\(\\angle APB = 80^{\\circ}, \\angle PAC=25^{\\circ}\\) `;
	var ans=` \\(\\angle APB = 75^{\\circ}, \\angle PAC=30^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-2x^{2}+xy-2y^{2}\\) `;
	var cho2=` \\(-5x^{2}-3xy+4y^{2}\\) `;
	var cho3=` \\(-x^{2}-xy+y^{2}\\) `;
	var ans=` \\(-5x^{2}+3xy-2y^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
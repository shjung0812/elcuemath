
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-3xy^{2}+xy+2y\\) `;
	var cho2=` \\(-xy^{2}-x^{2}y+3y\\) `;
	var cho3=` \\(2xy^{2}+xy+y\\) `;
	var ans=` \\(-5xy^{2}+xy-y\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
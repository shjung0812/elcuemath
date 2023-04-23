
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-3x^{2}y-2xy^{2}-3xy\\) `;
	var cho2=` \\(-2x^{2}y-6xy^{2}-2xy\\) `;
	var cho3=` \\(-2x^{2}y+3xy^{2}-xy\\) `;
	var ans=` \\(-3x^{2}y+12xy^{2}-6xy\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
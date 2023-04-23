
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle A = \\angle C = 120^{\\circ}\\) \\(\\angle B = \\angle D = 60^{\\circ}\\) `;
	var cho2=` \\(\\angle A = \\angle D = 120^{\\circ}\\) \\(\\angle B = \\angle C = 60^{\\circ}\\) `;
	var cho3=` \\(\\angle A = \\angle D = 100^{\\circ}\\) \\(\\angle B = \\angle C = 80^{\\circ}\\) `;
	var ans=` \\(\\angle A = \\angle C = 100^{\\circ}\\) \\(\\angle B = \\angle D = 80^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
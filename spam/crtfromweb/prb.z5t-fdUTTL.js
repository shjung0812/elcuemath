
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{2}{5}xy-\\frac{3}{5}x+\\frac{4}{5}y\\) `;
	var cho2=` \\(2x^{2}y^{2}-3x^{2}y+4xy\\) `;
	var cho3=` \\(2x^{2}y^{2}-3x^{2}y+4xy^{2}\\) `;
	var ans=` \\(\\frac{2}{5}xy-\\frac{3}{5}x+\\frac{4}{5}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
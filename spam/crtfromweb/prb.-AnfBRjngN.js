
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(2y-3x^{3}y^{2}\\) `;
	var cho2=` \\(\\frac{7}{3}y-12x^{2}y^{3}\\) `;
	var cho3=` \\(\\frac{5}{3}x^{3}y+4x^{2}\\) `;
	var ans=` \\(\\frac{5}{3}y-24x^{3}y^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
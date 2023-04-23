
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{41}{2}x^{4}-24x^{2}y^{2}\\) `;
	var cho2=` \\(12x^{4}y^{2}+11x^{2}y\\) `;
	var cho3=` \\(42x^{4}-12x^{2}y\\) `;
	var ans=` \\(30x^{4}+32x^{2}y\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
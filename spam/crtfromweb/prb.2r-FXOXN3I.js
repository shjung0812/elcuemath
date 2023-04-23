
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\left( \\frac{32}{3} \\pi -24 \\right) \\; cm^{2}\\) `;
	var cho2=` \\(\\left( \\frac{32}{3} \\pi -16  \\right) \\; cm^{2}\\) `;
	var cho3=` \\(\\left( 12 \\pi -16 \\sqrt{3} \\right) \\; cm^{2}\\) `;
	var ans=` \\(\\left( \\frac{32}{3} \\pi -16 \\sqrt{3} \\right) \\; cm^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
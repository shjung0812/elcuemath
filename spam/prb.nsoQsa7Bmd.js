
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((\\frac{yz}{x})^{2} = \\frac{y^{2}z^{2}}{x}\\) `;
	var cho2=` \\((-\\frac{2x^{2}}{3})^{3=-\\frac{8x^{2}}{27}}\\) `;
	var cho3=` \\((\\frac{3}{x})^{4} = \\frac{27}{x^{4}}\\) `;
	var ans=` \\((\\frac{x}{2y^{2}})^{3} = \\frac{x^{3}}{8y^{6}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
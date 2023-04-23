
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-\\frac{y}{9x^{2}}\\) `;
	var cho2=` \\(\\frac{y^{22}}{27x}\\) `;
	var cho3=` \\(-\\frac{y^{9}}{27x^{4}}\\) `;
	var ans=` \\(-\\frac{y^{11}}{27x^{2}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{8y(x-1)}{z}\\) `;
	var cho2=` \\(\\frac{x(z-3)}{y}\\) `;
	var cho3=` \\(\\frac{8z}{xy}\\) `;
	var ans=` \\(\\frac{8x(y-3)}{z}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
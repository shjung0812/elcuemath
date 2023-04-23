
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 정의역:\\(\\{x| x\\leq \\frac{6}{5}\\}\\), 치역:\\(\\{y | y \\geq -2\\}\\) `;
	var cho2=` 정의역:\\(\\{x| x\\leq \\frac{3}{5}\\}\\), 치역:\\(\\{y | y \\leq 3\\}\\) `;
	var cho3=` 정의역:\\(\\{x| x\\leq \\frac{3}{5}\\}\\), 치역:\\(\\{y | y > -2\\}\\) `;
	var ans=` 정의역:\\(\\{x| x\\leq \\frac{4}{5}\\}\\), 치역:\\(\\{y | y \\geq -1\\}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
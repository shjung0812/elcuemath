
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-\\frac{1}{4}\\)과 \\(-4\\) `;
	var cho2=` \\(-0.3\\)과 \\(-\\frac{10}{3}\\) `;
	var cho3=` \\(-\\frac{2}{5}\\)와 \\(-\\frac{5}{2}\\) `;
	var ans=` \\(-1\\)과 \\(1\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
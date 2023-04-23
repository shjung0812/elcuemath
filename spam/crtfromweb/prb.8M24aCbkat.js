
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) \\(\\frac{2}{5}\\) (2) \\(\\frac{1}{5}\\) (3) \\(\\frac{9}{10}\\) `;
	var cho2=` (1) \\(\\frac{2}{5}\\) (2) \\(\\frac{1}{9}\\) (3) \\(\\frac{8}{9}\\) `;
	var cho3=` (1) \\(\\frac{1}{5}\\) (2) \\(\\frac{3}{5}\\) (3) \\(\\frac{9}{10}\\) `;
	var ans=` (1) \\(\\frac{1}{5}\\) (2) \\(\\frac{1}{10}\\) (3) \\(\\frac{9}{10}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
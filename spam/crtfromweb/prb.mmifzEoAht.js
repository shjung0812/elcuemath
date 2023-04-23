
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{3}{5}, \\; 8, 0, \\; +4.6, -2\\frac{1}{9}\\) `;
	var cho2=` \\(-7,0 , \\; -3.7, \\; +4.6, -2\\frac{1}{9}\\) `;
	var cho3=` \\(\\frac{3}{5}, \\; 0 \\; +1, -2\\frac{1}{9}\\) `;
	var ans=` \\(\\frac{3}{5}, \\; -3.7, \\; +4.6, -2\\frac{1}{9}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(1\\frac{1}{2}, \\; -1, 2\\) `;
	var cho2=` \\(\\frac{3}{2}, \\; -1.5, \\; \\frac{21}{7}\\) `;
	var cho3=` \\(1, \\; \\frac{5}{4}, \\; 3\\) `;
	var ans=` \\(-1.2, -\\frac{2}{6}, \\; 0.5\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
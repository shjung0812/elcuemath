
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{-16x+70y}{x-16}\\) `;
	var cho2=` \\(\\frac{70x+13y}{x+13}\\) `;
	var cho3=` \\(\\frac{70x-13y}{x-13}\\) `;
	var ans=` \\(\\frac{70x+16y}{x+16}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
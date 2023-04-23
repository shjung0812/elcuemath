
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=`  \\(\\log_a b, \\log_b a\\)  `;
	var cho2=`  \\(\\log_b a, \\log_a \\frac{a}{b}\\)  `;
	var cho3=`  \\(\\log_a \\frac{a}{b}, \\log_b a\\)  `;
	var ans=`  \\(\\log_b a, \\log_a \\frac{b}{a}\\)  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
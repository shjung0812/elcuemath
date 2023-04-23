
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{1}{3}Q(x), \\; 3R\\) `;
	var cho2=` \\(Q(x), \\; R\\) `;
	var cho3=` \\(3Q(x), \\; \\frac{1}{3}R\\) `;
	var ans=` \\(\\frac{1}{3}Q(x), \\; R\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
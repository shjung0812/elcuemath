
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(16x+14y =73\\) `;
	var cho2=` \\(14x+16y=73\\) `;
	var cho3=` \\(\\frac{x}{16}+\\frac{y}{14} = 73\\) `;
	var ans=` \\(\\frac{8}{15}x+\\frac{7}{15}y = 73\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
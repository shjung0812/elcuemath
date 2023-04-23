
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((20x+30y) \\; g\\) `;
	var cho2=` \\((200x+300y) \\; g\\) `;
	var cho3=` \\( \\left(\\frac{x}{20}+\\frac{y}{30} \\right) \\; g\\) `;
	var ans=` \\((2x+3y) \\; g\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
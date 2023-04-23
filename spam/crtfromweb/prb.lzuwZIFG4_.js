
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` p가 짝수일 때:\\(\\frac{1}{2}\\), p가 홀수일 때: \\(\\frac{1}{3}\\) `;
	var cho2=` p가 짝수일 때:0, p가 홀수일 때: \\(\\frac{1}{3}\\) `;
	var cho3=` p가 짝수일 때:1, p가 홀수일 때: 0 `;
	var ans=` p가 짝수일 때:0, p가 홀수일 때: 1 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
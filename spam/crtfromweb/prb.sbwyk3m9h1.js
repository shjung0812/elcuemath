
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` x 절편: \\(\\frac{1}{4}\\), y절편: \\(\\frac{1}{2}\\) `;
	var cho2=` x 절편: \\(3\\), y절편: \\(\\frac{2}{3}\\) `;
	var cho3=` x 절편: \\(-2\\), y절편: \\(3\\) `;
	var ans=` x 절편: \\(-4\\), y절편: \\(-6\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\frac{1}{2}-\\frac{2}{3}=\\frac{2x-1}{6}\\) `;
	var cho2=` \\(0.2x+0.7=x-0.8\\) `;
	var cho3=` \\(2x-5=5x+2\\) `;
	var ans=` \\(0.3(x-2)+\\frac{1}{4}=0.1x+\\frac{1}{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
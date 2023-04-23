
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((-1.2)-(-6.3)=7.5\\) `;
	var cho2=` \\((+1)-\\left( +\\frac{3}{4} \\right) = -\\frac{1}{4}\\) `;
	var cho3=` \\(\\left( -\\frac{7}{2} \\right)  - \\left( +\\frac{1}{2}\\right) = -3 \\) `;
	var ans=` \\(\\left( +\\frac{1}{3}\\right)-\\left(+\\frac{5}{12}\\right) = -\\frac{1}{12}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
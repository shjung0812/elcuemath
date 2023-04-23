
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((-6.2)+(+4.1)-(-0.3)+(-1.5)=-3.3\\) `;
	var cho2=` \\((+13)-(-4)+(+7)-(-10)=34\\) `;
	var cho3=` \\((-6)+(+2)-(-3)=-1\\) `;
	var ans=` \\(\\left( +\\frac{2}{5}\\right)-\\left( +\\frac{5}{4}\\right)+(+2)-(-0.1)=\\frac{7}{4} \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
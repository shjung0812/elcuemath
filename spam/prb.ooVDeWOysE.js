
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(L=Vs+Vb\\) `;
	var cho2=` \\(tVs=Vb\\) `;
	var cho3=` \\(\\frac{Vs}{Vb}=t\\) `;
	var ans=` \\(L=t \\times Vs + t \\times Vb\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
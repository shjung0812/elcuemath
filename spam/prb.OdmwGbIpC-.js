
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(f^{\\prime}=-2\\) `;
	var cho2=` \\(f^{\\prime}(x)=2x-2\\) `;
	var cho3=` \\(f^{\\prime}=x^{2}-2\\) `;
	var ans=` \\(f^{\\prime}(x)=-3x-2\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
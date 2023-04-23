
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a=b\\)이면 \\(ac=bc\\) 이다. `;
	var cho2=` \\(a+c=b+c\\) 이면 \\(a=b\\) 이다. `;
	var cho3=` \\(a=b\\)이면 \\(a+c=b+c\\)이다.  `;
	var ans=` \\(ac=bc\\)이면 \\(a=b\\) 이다. `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
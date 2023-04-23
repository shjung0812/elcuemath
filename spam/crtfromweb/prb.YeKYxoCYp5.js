
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\overline{AJ}, \\overline{EI}\\) `;
	var cho2=` \\(\\overline{AG}, \\overline{DI}\\) `;
	var cho3=` \\(\\overline{HG}, \\overline{AJ}\\) `;
	var ans=` \\(\\overline{HG}, \\overline{DI}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
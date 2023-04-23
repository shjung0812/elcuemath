
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\overline{P_{9} P_{10}}\\) `;
	var cho2=` \\(\\overline{P_{10} P_{11}}\\) `;
	var cho3=` \\(\\overline{P_{21} P_{22}}\\) `;
	var ans=` \\(\\overline{P_{20} P_{21}}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
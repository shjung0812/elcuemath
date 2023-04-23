
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\overline{OC}=12.5 \\; cm\\), \\(\\overline{CD}=7 \\; cm\\), \\(\\overline{BE}=8 \\; cm\\) `;
	var cho2=` \\(\\overline{OC}=14 \\; cm\\), \\(\\overline{CD}=9 \\; cm\\), \\(\\overline{BE}=9 \\; cm\\) `;
	var cho3=` \\(\\overline{OC}=12 \\; cm\\), \\(\\overline{CD}=8 \\; cm\\), \\(\\overline{BE}=8 \\; cm\\) `;
	var ans=` \\(\\overline{OC}=13.5 \\; cm\\), \\(\\overline{CD}=9 \\; cm\\), \\(\\overline{BE}=8 \\; cm\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
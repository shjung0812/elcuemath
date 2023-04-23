
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\overline{OE}=2 \\; cm\\), \\(\\overline{OF} = 4 \\; cm\\), \\(\\overline{GH}=4 ; cm\\) `;
	var cho2=` \\(\\overline{OE}=4 \\; cm\\), \\(\\overline{OF} = 3 \\; cm\\), \\(\\overline{GH}=5 ; cm\\) `;
	var cho3=` \\(\\overline{OE}=2 \\; cm\\), \\(\\overline{OF} = 4 \\; cm\\), \\(\\overline{GH}=2 ; cm\\) `;
	var ans=` \\(\\overline{OE}=4 \\; cm\\), \\(\\overline{OF} = 4 \\; cm\\), \\(\\overline{GH}=3 ; cm\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
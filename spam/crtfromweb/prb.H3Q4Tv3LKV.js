
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((xy-2x+9)(xy-2y+9)\\) `;
	var cho2=` \\((xy-3x+1)(xy-y+3)\\) `;
	var cho3=` \\((xy-x+9)(xy-3y+2)\\) `;
	var ans=` \\((xy-3x+9)(xy-3y+9)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
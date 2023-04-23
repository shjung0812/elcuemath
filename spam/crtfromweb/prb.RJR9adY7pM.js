
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((x-1-5i)(x-1+5i)\\) `;
	var cho2=` \\((x+1-i)(x+1+i)\\) `;
	var cho3=` \\((x+1-\\sqrt{5}i)(x+1+\\sqrt{5}i)\\) `;
	var ans=` \\((x-1-\\sqrt{5}i)(x-1+\\sqrt{5}i)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
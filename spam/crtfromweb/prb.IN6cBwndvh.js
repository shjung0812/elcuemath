
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(4 \\pi +4\\sqrt{2}-16\\) `;
	var cho2=` \\(4\\pi +8\\sqrt{2} -20\\) `;
	var cho3=` \\(2\\pi +16\\sqrt{2}-24\\) `;
	var ans=` \\(4\\pi +16\\sqrt{2}-32\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
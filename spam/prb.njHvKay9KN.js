
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 15일, 16일, 22일, 23 일 `;
	var cho2=` 18일, 19일, 25일, 26일 `;
	var cho3=` 20일, 21일, 27일, 28 일 `;
	var ans=` 14일, 15일, 21일, 22일 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
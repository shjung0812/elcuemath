
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (가):2, (나):4y=4, (다):1, (라)2 `;
	var cho2=` (가):3, (나):7y=7, (다):2, (라)2 `;
	var cho3=` (가):2, (나):7y=7, (다):1, (라)-2 `;
	var ans=` (가):2, (나):7y=7, (다):1, (라)2 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
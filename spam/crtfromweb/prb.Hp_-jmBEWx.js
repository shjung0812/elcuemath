
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 마, 다, 가 , 나, 라, 바  `;
	var cho2=` 다, 마, 라, 바, 가, 나 `;
	var cho3=` 다, 마, 가, 라, 나, 바 `;
	var ans=` 다, 마, 가, 나 람, 바 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
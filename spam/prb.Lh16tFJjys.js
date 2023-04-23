
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 몫: 2aQ(x), 나머지: 3R `;
	var cho2=` 몫: aQ(x), 나머지: 3R `;
	var cho3=` 몫: 2aQ(x), 나머지: -R `;
	var ans=` 몫: aQ(x), 나머지: R `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
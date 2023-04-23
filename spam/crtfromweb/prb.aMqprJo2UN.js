
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (가): 교환 , (나) 결합, (다) +10, (라) -3 `;
	var cho2=` (가): 교환 , (나) 결합, (다) +20, (라) -1 `;
	var cho3=` (가): 교환 , (나) 교환, (다) +30, (라) -1 `;
	var ans=` (가): 교환 , (나) 결합, (다) +20, (라) -3 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
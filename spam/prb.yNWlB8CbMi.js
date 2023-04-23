
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (가): 0.43, (나) :31,  (다): 18 `;
	var cho2=` (가): 0.41, (나) :40,  (다): -18 `;
	var cho3=` (가): 0.41, (나) :41,  (다): -31 `;
	var ans=` (가): 0.41, (나) :41,  (다): -28 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
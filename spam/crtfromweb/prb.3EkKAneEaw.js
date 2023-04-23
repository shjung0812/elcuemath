
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (가): 3x+y ,(나): 3x-2y, (다): 3x-4, (라): 2 `;
	var cho2=` (가): 3x+y ,(나): 3x-y, (다): 3x-4, (라): -2 `;
	var cho3=` (가): 6x+y ,(나): 2x-1y, (다): 3x+4, (라): 1 `;
	var ans=` (가): 6x+y ,(나): 3x-2y, (다): 3x-4, (라): 1 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
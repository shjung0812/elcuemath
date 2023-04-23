
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (가): 3x-7y, (나): 3x-4y, (다): 3x+10, (라): -2 `;
	var cho2=` (가): 3x+7y, (나): 2x+5y, (다): 3x+10, (라): -1 `;
	var cho3=` (가): -2x-7y, (나): 3x+5y, (다): 3x-10, (라): -3 `;
	var ans=` (가): 2x-7y, (나): 3x+5y, (다): 3x+10, (라): -3 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
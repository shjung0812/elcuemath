
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (가): 2x+3y, (나):3x-3y, (다):10-3y, (라) 2 `;
	var cho2=` (가): 2x+3y, (나):4x-3y, (다):11-3y, (라) 4 `;
	var cho3=` (가): 2x-3y, (나):4x-3y, (다):11-3y, (라) 2 `;
	var ans=` (가): 2x-3y, (나):4x-3y, (다):10-3y, (라) 3 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
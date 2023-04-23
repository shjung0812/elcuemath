
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) 발산 (2) 수렴, 2 `;
	var cho2=` (1) 수렴 , 1 (2) 수렴, 2 `;
	var cho3=` (1) 발산, (2) 발산 `;
	var ans=` (1) 발산 (2) 수렴, 1 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
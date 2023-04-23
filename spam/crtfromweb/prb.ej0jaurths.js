
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 남학생: 4명, 여학생: 2명 `;
	var cho2=` 남학생: 3명, 여학생: 5명 `;
	var cho3=` 남학생: 3명, 여학생: 4명 `;
	var ans=` 남학생: 4명, 여학생: 3명 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 대전, 서울, 부산, 대구 `;
	var cho2=` 서울, 대구, 대전, 부산 `;
	var cho3=` 부산, 대구, 대전, 서울 `;
	var ans=` 부산, 대전, 대구, 서울 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
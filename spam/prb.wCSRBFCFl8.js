
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 타일의 길이: 40 cm, 타일의 개수: 30 `;
	var cho2=` 타일의 길이: 10 cm, 타일의 개수: 20 `;
	var cho3=` 타일의 길이: 30 cm, 타일의 개수: 50 `;
	var ans=` 타일의 길이: 30 cm, 타일의 개수: 20 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 넓이가 6인 정사각형 `;
	var cho2=` 넓이가 24인 정사각형 `;
	var cho3=` 둘레의 길이가 \\(8\\sqrt{2}\\)인 정사각형 `;
	var ans=` 넓이가 16인 정사각형 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
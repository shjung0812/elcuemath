
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 점 Q에 대응하는 수는 \\(2+\\sqrt{2}\\) 이다.  `;
	var cho2=` \\(\\overline{AQ} = \\sqrt{2}+1\\) `;
	var cho3=` \\(\\overline{PA} = 2-\\sqrt{2}\\) `;
	var ans=` 점 P에 대응하는 수는 \\(2-\\sqrt{2}\\)이다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
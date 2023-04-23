
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 원점을 지나지 않는다.  `;
	var cho2=` 점 \\((8,\\; 2)\\)를 지난다.  `;
	var cho3=` 한 쌍의 곡선이다.  `;
	var ans=` 제 \\(2\\)사분면과 제 \\(4\\)분면을 지난다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
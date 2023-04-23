
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 10시 30분에 준재와 형 사이의 거리는 3 km 이다.  `;
	var cho2=` 준재와 형은 11시 30분에 만났다.  `;
	var cho3=` 형은 집에서 9시 30분에 출발했다.  `;
	var ans=` 12시에 형은 준재보다 집에서 멀리 떨어져 있다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
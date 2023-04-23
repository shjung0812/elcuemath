
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 시속 \\(x \\; km\\)로 \\(90 \\; km\\)를 달릴 때 걸리는 시간은 \\(y\\)시간이다.  `;
	var cho2=` \\(200 \\; g\\)의 물에 소금 \\(x \\; g\\)을 넣어 만든 소금물의 농도는 \\(y \\; \\%\\)이다.  `;
	var cho3=` 두 대각선의 길이가 \\(x \\; cm, \\; y \\; cm\\)인 마름모의 넓이는 \\(50 \\; cm^{2}\\)이다.  `;
	var ans=` \\(1 \\; m\\)의 무게가 \\(20\\; g\\)인 철사 \\(x \\; m\\)의 무게는 \\(y \\; g\\)이다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
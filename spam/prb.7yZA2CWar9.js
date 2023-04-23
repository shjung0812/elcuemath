
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y=ax\\)의 그래프는  x의 값이 증가하면 \\(y\\)의 값도 증가한다.  `;
	var cho2=` \\(a>0, \\; b<0\\)이다.  `;
	var cho3=` \\(y=\\frac{2b}{x}\\)의 그래프는 \\(y=\\frac{b}{x}\\)의 그래프보다 원점에 가깝다.  `;
	var ans=` \\(y=\\frac{b}{x}\\)의 그래프는 \\(x\\)의 값이 증가하면 \\(y\\)의 값은 감소한다.  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
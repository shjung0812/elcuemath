
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(x\\)에서 \\(3\\)을 뺀 수는 \\(x\\)의 \\(4\\)배보다 작다 \\(\\Rightarrow x-3 < 4x \\) `;
	var cho2=` 가로의 길이가 \\(x \\; cm\\), 세로의 길이가 \\(4 \\; cm\\)인 직사각형의 둘레의 길이는 \\(32 \\; cm\\) 미만이다. \\(\\Rightarrow 2(x+4) < 32\\) `;
	var cho3=` \\(7\\)명이 각각 \\(x\\)원씩 내면 총액은 \\(2000\\)원 이하이다. \\(\\Rightarrow 7x \\leq 2000\\) `;
	var ans=` \\(x\\)에서 \\(1\\)을 뺀 수의 \\(2\\)배는 \\(8\\)보다 크거나 같다. \\(\\Rightarrow  2x-1 \\geq 8\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
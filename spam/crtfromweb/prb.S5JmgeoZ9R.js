
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (가) 무리수, (나) \\(2^{m}\\), (다) 홀수 `;
	var cho2=` (가) 유리수, (나) \\(2^{m}\\), (다) 짝수 `;
	var cho3=` (가) 유리수, (나) \\(4^{m}\\), (다)홀수 `;
	var ans=` (가) 유리수, (나) \\(4^{m}\\), (다) 짝수 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
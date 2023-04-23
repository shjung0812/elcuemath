
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(-2.\\dot{3}5\\dot{6}\\) `;
	var cho2=` \\(-2.1\\dot{3}51\\dot{6}\\) `;
	var cho3=` \\(-2.1\\dot{6}5\\dot{3}\\) `;
	var ans=` \\(-2.1\\dot{3}5\\dot{6}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
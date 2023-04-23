
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(0.\\dot{4} \\Rightarrow 4\\) `;
	var cho2=` \\(0.\\dot{1}\\dot{5} \\Rightarrow 1\\) `;
	var cho3=` \\(0.\\dot{2}5\\dot{9} \\Rightarrow 9\\) `;
	var ans=` \\(1.2\\dot{3}\\dot{4} \\Rightarrow 3\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(0.\\dot{7}\\dot{8}=\\frac{26}{33}\\) `;
	var cho2=` \\(1.\\dot{6}=\\frac{5}{3}\\) `;
	var cho3=` \\(0.\\dot{9}2\\dot{5}=\\frac{25}{27}\\) `;
	var ans=` \\(5.\\dot{1}\\dot{4}=\\frac{514}{99}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
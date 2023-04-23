
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 버스: \\(\\frac{1}{3}\\), 지하철: \\(\\frac{1}{3}\\), 택시 : \\(\\frac{1}{3}\\) `;
	var cho2=` 버스: \\(\\frac{1}{3}\\), 지하철: \\(\\frac{1}{2}\\), 택시 : \\(\\frac{2}{3}\\) `;
	var cho3=` 버스: \\(\\frac{1}{4}\\), 지하철: \\(\\frac{3}{4}\\), 택시 : \\(\\frac{1}{3}\\) `;
	var ans=` 버스: \\(\\frac{1}{2}\\), 지하철: \\(\\frac{1}{6}\\), 택시 : \\(\\frac{1}{3}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) 5, (2) \\(\\frac{25}{9} \\leq m \\leq \\frac{29}{9}\\) `;
	var cho2=` (1) 4, (2) \\(\\frac{23}{9} \\leq m \\leq \\frac{32}{9}\\) `;
	var cho3=` (1) 5, (2) \\(\\frac{23}{9} \\leq m \\leq \\frac{31}{9}\\) `;
	var ans=` (1) 4, (2) \\(\\frac{25}{9} \\leq m \\leq \\frac{29}{9}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 분속 \\(\\frac{a}{400}\\) m `;
	var cho2=` 분속 \\(800a\\) m `;
	var cho3=` 분속 \\(\\frac{200}{3a}\\) m `;
	var ans=` 분속 \\(\\frac{800}{a}\\) m `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
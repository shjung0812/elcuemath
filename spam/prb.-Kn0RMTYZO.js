
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((\\frac{73}{8}, \\frac{41}{8})\\) `;
	var cho2=` \\((\\frac{69}{8}, \\frac{37}{8})\\) `;
	var cho3=` \\((\\frac{61}{8}, \\frac{29}{8})\\) `;
	var ans=` \\((\\frac{77}{8}, \\frac{45}{8})\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
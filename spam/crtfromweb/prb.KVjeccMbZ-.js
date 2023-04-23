
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y=\\frac{2}{5}x , \\; 60 \\; g\\) `;
	var cho2=` \\(y=5x , \\; 55 \\; g\\) `;
	var cho3=` \\(y=\\frac{1}{5}x , \\; 50 \\; g\\) `;
	var ans=` \\(y=\\frac{1}{5}x , \\; 55 \\; g\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
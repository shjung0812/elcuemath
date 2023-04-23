
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` (1) 몫: \\(x+5\\), 나머지: \\(-2x+6\\), (2) \\(X=25, Y=4\\), (3) \\(1+\\sqrt{5}\\) `;
	var cho2=` (1) 몫: \\(x+5\\), 나머지: \\(-4x+6\\), (2) \\(X=26, Y=1\\), (3) \\(1+2\\sqrt{5}\\) `;
	var cho3=` (1) 몫: \\(x-5\\), 나머지: \\(-4x+6\\), (2) \\(X=26, Y=4\\), (3) \\(1+2\\sqrt{5}\\) `;
	var ans=` (1) 몫: \\(x+5\\), 나머지: \\(-4x+6\\), (2) \\(X=26, Y=4\\), (3) \\(1+\\sqrt{5}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(y^{2}, \\; x^{2}(x-y-z)\\) `;
	var cho2=` \\(2x^{2}, \\; 2yz^{2}(x-y+z)\\) `;
	var cho3=` \\(zy^{2}, \\; zy^{2}(x+y+z)\\) `;
	var ans=` \\(x^{2}, \\; x^{2}(x-y+z)\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
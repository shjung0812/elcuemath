
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(a \\; cm, \\; 70^{\\circ}\\) `;
	var cho2=` \\(a \\; cm, \\; 50^{\\circ}\\) `;
	var cho3=` \\(b \\; cm, \\; 70^{\\circ}\\) `;
	var ans=` \\(b \\; cm, \\; 50^{\\circ}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
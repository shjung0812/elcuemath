
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((1) \\; 12 \\; cm, \\; (2) \\; 14\\pi \\; cm, \\; (3) \\; 169^{\\circ} \\) `;
	var cho2=` \\((1) \\; 15 \\; cm, \\; (2) \\; 13\\pi \\; cm, \\; (3) \\; 170^{\\circ} \\) `;
	var cho3=` \\((1) \\; 12 \\; cm, \\; (2) \\; 14\\pi \\; cm, \\; (3) \\; 170^{\\circ} \\) `;
	var ans=` \\((1) \\; 15 \\; cm, \\; (2) \\; 14\\pi \\; cm, \\; (3) \\; 168^{\\circ} \\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	

	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\((1) \\; 3 \\; cm\\), \\((2) \\; 15 \\; cm\\), \\((3) \\; 12 \\; cm\\) `;
	var cho2=` \\((1) \\; 2 \\; cm\\), \\((2) \\; 13 \\; cm\\), \\((3) \\; 14 \\; cm\\) `;
	var cho3=` \\((1) \\; 4 \\; cm\\), \\((2) \\; 13 \\; cm\\), \\((3) \\; 14 \\; cm\\) `;
	var ans=` \\((1) \\; 2 \\; cm\\), \\((2) \\; 16 \\; cm\\), \\((3) \\; 12 \\; cm\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
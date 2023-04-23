
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(4, \\; \\; \\sqrt{17}, \\; \\; 2\\sqrt{5}, \\; \\; 3\\sqrt{2}\\) `;
	var cho2=` \\(4, \\; \\; 2\\sqrt{5}, \\; \\; \\sqrt{17}, \\; \\; 2\\sqrt{5}\\) `;
	var cho3=` \\(2\\sqrt{5}, \\; \\; \\sqrt{17}, \\; \\; 3\\sqrt{2}, \\; \\; 4\\) `;
	var ans=` \\(4, \\; \\; \\sqrt{17}, \\; \\; 3\\sqrt{2}, \\; \\; 2\\sqrt{5}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
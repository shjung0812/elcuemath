
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\begin{cases} 7x+5y = 3 \\\\ x+2y=-6 \\end{cases}\\) `;
	var cho2=` \\(\\begin{cases} 7x+5y = 15 \\\\ x-2y=13 \\end{cases}\\) `;
	var cho3=` \\(\\begin{cases} 7x-5y = -3 \\\\ 2x-y=-3 \\end{cases}\\) `;
	var ans=` \\(\\begin{cases} 7x-5y = 3 \\\\ 2x+y=13 \\end{cases}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
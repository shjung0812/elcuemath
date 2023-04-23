
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\begin{cases} 2x+3y=23 \\\\ y=x+4 \\end{cases}\\) `;
	var cho2=` \\(\\begin{cases} 3x+2y=23 \\\\ y=2x+4 \\end{cases}\\) `;
	var cho3=` \\(\\begin{cases} 3x+23y=2 \\\\ y=x+4 \\end{cases}\\) `;
	var ans=` \\(\\begin{cases} 3x+2y=23 \\\\ y=x+4 \\end{cases}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
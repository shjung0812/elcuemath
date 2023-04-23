
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle x = 90^{\\circ}-\\frac{1}{2}\\angle a\\), \\(\\angle y = 90^{\\circ}-\\frac{1}{2} \\angle a,\\)  \\( \\angle z = \\angle a\\) `;
	var cho2=` \\(\\angle x = 90^{\\circ}+\\frac{1}{2}\\angle a\\), \\(\\angle y = 90^{\\circ}+\\frac{3}{2} \\angle a,\\)  \\( \\angle z =  90^{\\circ} +\\angle a\\) `;
	var cho3=` \\(\\angle x = 90^{\\circ}+\\angle a\\), \\(\\angle y = 90^{\\circ}+\\frac{1}{2} \\angle a,\\)  \\( \\angle z = \\frac{1}{2} \\angle a\\) `;
	var ans=` \\(\\angle x = 90^{\\circ}+\\frac{1}{2}\\angle a\\), \\(\\angle y = 90^{\\circ}-\\frac{1}{2} \\angle a,\\)  \\( \\angle z = \\frac{1}{2} \\angle a\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
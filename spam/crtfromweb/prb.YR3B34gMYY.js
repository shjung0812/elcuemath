
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 부피:\\(142\\pi \\; cm^{3}\\), 겉넓이: \\(124\\pi \\; cm^{2}\\)  `;
	var cho2=` 부피:\\(142\\pi \\; cm^{3}\\), 겉넓이: \\(146\\pi \\; cm^{2}\\)  `;
	var cho3=` 부피:\\(168\\pi \\; cm^{3}\\), 겉넓이: \\(124\\pi \\; cm^{2}\\)  `;
	var ans=` 부피:\\(168\\pi \\; cm^{3}\\), 겉넓이: \\(119\\pi \\; cm^{2}\\)  `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
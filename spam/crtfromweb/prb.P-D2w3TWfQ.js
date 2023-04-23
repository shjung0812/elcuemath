
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\sin A < \\cos A < \\tan A\\) `;
	var cho2=` \\(\\sin A < \\tan A < \\cos A\\) `;
	var cho3=` \\(\\tan A < \\cos A < \\sin A\\) `;
	var ans=` \\(\\cos A < \\sin A < \\tan A\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
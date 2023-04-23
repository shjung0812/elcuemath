
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\( (-5x+720) \\; m\\) `;
	var cho2=` \\( (-8x+620) \\; m\\) `;
	var cho3=` \\( (8x-720) \\; m\\) `;
	var ans=` \\( (-8x+720) \\; m\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
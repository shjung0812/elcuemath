
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\(\\angle b, \\; \\angle c, \\; \\angle g\\) `;
	var cho2=` \\(\\angle a, \\; \\angle f, \\; \\angle g\\) `;
	var cho3=` \\(\\angle h, \\; \\angle f, \\; \\angle g\\) `;
	var ans=` \\(\\angle a, \\; \\angle c, \\; \\angle g\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
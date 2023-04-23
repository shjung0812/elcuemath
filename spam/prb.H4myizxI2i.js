
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 새우튀김: 6, 호박전: 6 `;
	var cho2=` 새우튀김: 4, 호박전: 4 `;
	var cho3=` 새우튀김: 2, 호박전: 5 `;
	var ans=` 새우튀김: 4, 호박전: 6 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
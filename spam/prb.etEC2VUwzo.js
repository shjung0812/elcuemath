
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 공약수: 1, 2,3, 6  최대공약수: 6 `;
	var cho2=` 공약수: 1, 2, 4, 8  최대공약수: 8 `;
	var cho3=` 공약수: 1, 2,3, 4, 6, 12  최대공약수: 12 `;
	var ans=` 공약수: 1, 2, 4  최대공약수: 4 `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
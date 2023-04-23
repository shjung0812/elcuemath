
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 기울기: \\(\\frac{3}{4}\\), y절편:\\(-\\frac{2}{5}\\) `;
	var cho2=` 기울기: \\(2\\), y절편:\\(-\\frac{3}{4}\\) `;
	var cho3=` 기울기: \\(-2\\), y절편:\\(1\\) `;
	var ans=` 기울기: \\(\\frac{3}{2}\\), y절편:\\(1\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
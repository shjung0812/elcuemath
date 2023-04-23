
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` \\( 500^{10} < 3^{50} < 5^{40} < 10^{30}\\) `;
	var cho2=` \\(3^{50}  < 500^{10} < 10^{30} < 5^{40} \\) `;
	var cho3=` \\(3^{50}  <  5^{40} < 500^{10}  < 10^{30}\\) `;
	var ans=` \\(3^{50}  < 500^{10} < 5^{40} < 10^{30}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
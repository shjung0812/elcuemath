
	module.exports={
	spamprb:function(prbrows){
	var prbchk=0;
	var path=require('./prismpath.json');
	var async=require('async');
	var pr=require(path.prismbin+'prbtest');
	var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
	var Nans=rst[1];

	var cho1=` 부피: \\(\\frac{x}{yz}\\; cm^{3}\\), 겉넓이:\\((2xy-yz+2zx) \\; cm^{2}\\) `;
	var cho2=` 부피: \\(\\frac{1}{3}xyz\\; cm^{3}\\), 겉넓이:\\((xy+yz+zx) \\; cm^{2}\\) `;
	var cho3=` 부피: \\(\\frac{xy}{z}\\; cm^{3}\\), 겉넓이:\\((xy+8yz+zx) \\; cm^{2}\\) `;
	var ans=` 부피: \\(xyz\\; cm^{3}\\), 겉넓이:\\((2xy+2yz+2zx) \\; cm^{2}\\) `;
	prbcontent=`prbcontent=`+prbrows;
	eval(prbcontent);


	return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
	}
	};
	
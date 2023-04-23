module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(9x^{2}+y^{2}+4z^{3}-6xy-4yz+zx\\)`;
var cho2=`\\(9x^{2}+y^{4}+4z^{4}-6xy-4yz+zx\\)`;
var cho3=`\\(7x^{2}+y^{2}+4z^{2}-6xy-yz+12zx\\)`;
var ans=`\\(9x^{2}+y^{2}+4z^{2}-6xy-4yz+12zx\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((3x+2p)(x^{2}+p^{2}+2q^{2})\\)`;
var cho2=`\\((x+p^{2})(x^{2}+p+q^{2})\\)`;
var cho3=`\\((x+p)(x^{2}+p^{2}+q^{2})\\)`;
var ans=`\\((x+p)(x+p+q)(x+p-q)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
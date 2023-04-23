module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((x-y)(x^{2}+y^{2})(x^{4}+y^{4})\\)`;
var cho2=`\\((2x+y)(x^{2}+y^{2})(x^{4}+y^{4})\\)`;
var cho3=`\\((x-y)(x-2y)(x^{2}-2y^{2})(x^{4}+y^{4})\\)`;
var ans=`\\((x-y)(x+y)(x^{2}+y^{2})(x^{4}+y^{4})\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
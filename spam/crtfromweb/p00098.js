module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((2x+y)(4x^{2}-xy+9y^{2})\\)`;
var cho2=`\\((2x-3y)(3x^{2}-6xy+9y^{2})\\)`;
var cho3=`\\((2x+3y)(3x^{2}+2xy+9y^{2})\\)`;
var ans=`\\((2x+3y)(4x^{2}-6xy+9y^{2})\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
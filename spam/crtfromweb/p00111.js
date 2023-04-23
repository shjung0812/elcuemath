module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((x-9)(x-5)(x^{2}+4x+7)\\)`;
var cho2=`\\((x+2)(x^{3}+5)\\)`;
var cho3=`\\((x^{2}+3x-5)(x^{2}+1)\\)`;
var ans=`\\((x^{2}+x+1)(x^{2}-x+1)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((x^{2}-x+1)(x^{2}+3)\\)`;
var cho2=`\\((x+1)(x+3)(x^{2}-2x+1)\\)`;
var cho3=`\\((2x+3)^{4}\\)`;
var ans=`\\((x^{2}-5x+12)(x^{2}-10x+12)\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
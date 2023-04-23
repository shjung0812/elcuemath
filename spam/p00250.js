module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((y-2)(x^{2}+x+3y+3)\\)`;
var cho2=`\\((x+y)(2x+3y+3)\\)`;
var cho3=`\\((x+y-4)(x+y+3)\\)`;
var ans=`\\((x+2y-4)(x+2y+3)\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((x-y+1)(x+y-1)(xy+3)\\)`;
var cho2=`\\((x+y)(x^{2}y-x+1)(y-2)\\)`;
var cho3=`\\((2x+y)^{3}\\)`;
var ans=`\\((3x+y)^{3}\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((xz-8)(x-2)(xy+2)\\)`;
var cho2=`\\((xz+4)(x+2z)(x+y)\\)`;
var cho3=`\\((xz+3)(x-2z)(x+2y)\\)`;
var ans=`\\((x+y)(x-y)(y-z)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`a=c인 둔각삼각형`;
var cho2=`a가 빗변인 직각삼각형 또는 b=c인 이등변삼각형`;
var cho3=`b가 빗변인 직각삼각형 또는 a=c인 이등변삼각형`;
var ans=`c가 빗변인 직각삼각형 또는 a=b인 이등변삼각형`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
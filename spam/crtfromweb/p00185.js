module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(((x+2)(x^{2}-xy+y^{2})\\)`;
var cho2=`\\(x(x-1)^{2}(x+2)(x^{2}+x+1)^{2}\\)`;
var cho3=`\\(x(x-1)(x+2)^{3}(x^{2}+x+1)\\)`;
var ans=`\\(x(x-1)^{2}(x+2)(x^{2}+x+1)\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
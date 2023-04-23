module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((a-b)x^{2}(x-y)\\)`;
var cho2=`\\((a-b)x(x+y)\\)`;
var cho3=`\\((a-2b)x(x+y)\\)`;
var ans=`\\((a-b)x(x-y)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
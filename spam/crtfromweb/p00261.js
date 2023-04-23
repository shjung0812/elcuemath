module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((a+c+b+3)(c-1)\\)`;
var cho2=`\\((a+c)(b+1)(d+c)\\)`;
var cho3=`\\((a-b)(b+1)(a+c)\\)`;
var ans=`\\((a+b)(b+c)(c+a)\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
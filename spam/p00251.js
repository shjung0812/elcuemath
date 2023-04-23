module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((b^{2}+a+c)(a^{2}-a+c)\\)`;
var cho2=`\\((b+c)(a^{2}-a+b+6c)\\)`;
var cho3=`\\((a+b+4c)(a+b+6c)\\)`;
var ans=`\\((2a+b+4c)(2a+b+6c)\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
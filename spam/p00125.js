module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((a+3b)(2b+c)(c+2a)\\)`;
var cho2=`\\((a+b)(b-c)(c-a)\\)`;
var cho3=`\\((a-b-c)^{2}\\)`;
var ans=`\\((a-b+c)^{2}\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
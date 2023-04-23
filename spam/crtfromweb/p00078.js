module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((x+a-2b)(x-2a+b)\\)`;
var cho2=`\\((x+a+b)(x-a+b)\\)`;
var cho3=`\\x((x+a)(x-a+b)\\)`;
var ans=`\\((x+a-b)(x-a+b)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((a-b+c+d)(2a-b-c+d)\\)`;
var cho2=`\\((a-c-d)(a-2b-c+d)\\)`;
var cho3=`\\((a-b+c-d)(a-b)\\)`;
var ans=`\\((a-b+c-d)(a-b-c+d)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
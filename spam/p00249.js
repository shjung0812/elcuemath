module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((a+b^{2}+b+c)(c^{2}+a-b)(a+b)(a-2b-c)\\)`;
var cho2=`\\((a+b^{2}+b+c)(a-c)(b-c)(a^{2}+a-2b-c)\\)`;
var cho3=`\\((a+b+c)(a+b-c)(b-c)(a^{2}+a-2b-c)\\)`;
var ans=`\\((a+b+c)(a+b-c)(a-b+c)(a-b-c)\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
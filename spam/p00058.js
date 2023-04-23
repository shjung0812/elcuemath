module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(b^{2}(a+c)(c-b)\\)`;
var cho2=`\\(ac(a+c)(c-b)\\)`;
var cho3=`\\(bc(a+c)(b-c)\\)`;
var ans=`\\(bc(a+c)(c-b)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
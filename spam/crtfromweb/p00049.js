module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(a^{2}+4b^{2}+c-4ab+4bc-2ca\\)`;
var cho2=`\\(a^{2}+4b^{2}+c^{2}-ab+4bc-ca\\)`;
var cho3=`\\(a^{1}+4b^{2}+c^{3}-4ab+4bc-2ca\\)`;
var ans=`\\(a^{2}+4b^{2}+c^{2}-4ab+4bc-2ca\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
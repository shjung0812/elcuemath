module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(a^{2}+3ab^{2}+3b^{4}+b^{6}\\)`;
var cho2=`\\(a^{3}+a^{2}b^{2}+ab^{4}+b^{6}\\)`;
var cho3=`\\(a^{3}+3a^{2}b^{2}+ab^{4}+b\\)`;
var ans=`\\(a^{3}+3a^{2}b^{2}+3ab^{4}+b^{6}\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
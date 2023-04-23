module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((a^{2}+3b)(b^{2}+3c)(c^{2}+3a)\\)`;
var cho2=`\\((a^{2}+b)(b^{2}-c)(c^{2}-a)\\)`;
var cho3=`\\((a+b+c)(a^{2}+b^{2}+c^{2}+ab+bc+ca)\\)`;
var ans=`\\((a+b+c)(a^{2}+b^{2}+c^{2}-ab-bc-ca)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(2a^{2}b^{2}c(2b-ac)\\)`;
var cho2=`\\(2a^{2}b^{2}c(2b-3a^{2})\\)`;
var cho3=`\\(2a^{2}b^{3}c(2b-3ac)\\)`;
var ans=`\\(2a^{2}b^{2}c(2b-3ac)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
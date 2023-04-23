module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(8x^{3}-4xy^{2}+7y^{2}\\)`;
var cho2=`\\(x^{3}+x^{2}y+54xy^{2}-27y^{3}\\)`;
var cho3=`\\(8x^{3}-36x^{2}y+12xy^{2}-27y\\)`;
var ans=`\\(8x^{3}+36x^{2}y+54xy^{2}+27y^{3}\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
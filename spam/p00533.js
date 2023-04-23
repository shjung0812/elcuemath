module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\( \\beta - 1 < x < \\alpha - 1\\)`;
var cho2=`\\( \\alpha - 1 < x < \\beta - 1 \\)`;
var cho3=`\\( 1 - \\alpha < x < 1 - \\beta \\)`;
var ans=`\\( 1 - \\beta < x < 1 - \\alpha \\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
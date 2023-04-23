module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(A \\cap (A \\cup B) = \\emptyset \\)\\)`;
var cho2=`\\(A \\cap B = B\\)`;
var cho3=`\\(A^{C} \\subset B^{C}\\)`;
var ans=`\\(A-B=\\emptyset\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
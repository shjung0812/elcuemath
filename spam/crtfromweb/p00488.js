module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(0< k < \\frac{11}{8}\\)`;
var cho2=`\\(-1\\leq k < \\frac{9}{8}\\)`;
var cho3=`\\(-1\\leq k\\leq \\frac{5}{8}\\)`;
var ans=`\\(0< k\\leq \\frac{9}{8}\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
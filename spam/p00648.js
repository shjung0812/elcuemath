module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(\\frac{-3-\\sqrt{5}}{2} < a \\leq -\\frac{7}{2}\\)`;

var cho2=`\\(\\frac{-7-\\sqrt{5}}{7} < a \\leq -\\frac{13}{2}  또는  \\frac{3}{11} \\leq a < \\frac{3+3\\sqrt{2}}{5}\\)`;

var cho3=`\\(\\frac{-3-\\sqrt{5}}{2} < a \\leq -\\frac{7}{2}  또는  \\frac{3}{7} \\leq a < \\frac{3+\\sqrt{2}}{2}\\)`;
var ans=`\\(\\frac{-3-\\sqrt{2}}{2} < a \\leq -\\frac{3}{2}  또는  \\frac{3}{2} \\leq a < \\frac{3+\\sqrt{2}}{2}\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
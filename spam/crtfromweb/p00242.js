module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(\\frac{a+b-2}{a+b+2}\\)`;
var cho2=`\\(\\frac{ab+a+b}{a+b}\\)`;
var cho3=`\\(\\frac{3ab+2a+b}{2a+b+2}\\)`;
var ans=`\\(\\frac{2ab+a+b}{a+b+2}\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
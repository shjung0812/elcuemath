module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(\\frac{2r+t}{r-2t}\\)`;
var cho2=`\\(\\frac{r}{r+t}\\)`;
var cho3=`\\(\\frac{r+2t}{2r-t}\\)`;
var ans=`\\(\\frac{r+t}{r-t}\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
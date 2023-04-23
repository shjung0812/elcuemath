module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(f(x_{1}, y_{1})f(x_{2}, y_{2})\\)`;
var cho2=`\\(f(x_{1}, y_{1})f(x_{4}, y_{4})\\)`;
var cho3=`\\(f(x_{3}, y_{3})f(x_{4}, y_{4})\\)`;
var ans=`\\(f(x_{4}, y_{4})f(x_{5}, y_{5})\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
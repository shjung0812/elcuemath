module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(\\frac{41\\sqrt{5}}{2}\\)`;
var cho2=`\\(\\frac{37\\sqrt{2}}{4}\\)`;
var cho3=`\\(\\frac{39\\sqrt{2}}{5}\\)`;
var ans=`\\(\\frac{39\\sqrt{3}}{4}\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`가: 45, 나: \\(\\overline{CQ}\\) 다: \\(\\sqrt{11}\\)`;
var cho2=`가: 60, 나: \\(\\overline{OQ}\\) 다: \\(\\sqrt{15}\\)`;
var cho3=`가: 60, 나: \\(\\overline{CQ}\\) 다: \\(\\sqrt{15}\\)`;
var ans=`가: 60, 나: \\(\\overline{CQ}\\) 다: \\(\\sqrt{13}\\)`;
prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
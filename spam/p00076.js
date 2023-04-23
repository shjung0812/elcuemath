module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((2a-3b)(a+b)(a-b)\\)`;
var cho2=`\\(-ab(a-b)\\)`;
var cho3=`\\(-ab(a+b)(a-2b)\\)`;
var ans=`\\(-ab(a+b)(a-b)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[-10,10,1],[-10,10,1],[-10,10,1],[-10,10,1]]);
var Nans=rst[1];


var ans=12;



var cho1=28;
var cho2=10;
var cho3=14;



prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[-10,10,1],[-10,10,1],[-10,10,1],[-10,10,1]]);
var Nans=rst[1];


var ans=11;

var wval=mbs.rvar([ans,0,0],[[1,ans*2,1],[1,ans*2,1],[1,ans*2,1]]);

var cho1=wval[0];
var cho2=wval[1];
var cho3=wval[2];
var errchk=0;
while(mbs.dplchk([ans,cho1,cho2,cho3],true)){
var wval=mbs.rvar([ans,0,0],[[1,ans*2,1],[1,ans*2,1],[1,ans*2,1]]);

var cho1=wval[0];
var cho2=wval[1];
var cho3=wval[2];

 if(errchk>1000){
 prbchk=1;
 break;
}
errchk=errchk+1;
}



prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
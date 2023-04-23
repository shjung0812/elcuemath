module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]],'ca<cb');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];


var cho1 = va*va;
var cho2 = va-vb;
var cho3 = va*vb
var ans=va+vb;

while(mbs.dplchk([cho1,cho2,cho3,ans],true)){
 cho1=mbs.rvar([vb],[[1,15,1]])[0];
 cho2=mbs.rvar([va],[[1,10,1]])[0]-vb;
 cho3=mbs.rvar([va],[[1,10,1]])[0]*mbs.rvar([vb],[[1,15,1]])[0];
}

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};

module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[1,20,1],[1,20,1],[1,20,1],[-10,-1,1]],'cc>=cb || cb>=ca || (cc+cb-2*ca)*(cb-cc)%(2*cd)!=0 || (cc+cb)>=2*ca');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var ve=rst[0][3];
var vd=(vc+vb-2*va)*(vb-vc)/(2*ve);

var wval=mbs.rvar([ve,0,0],[[-10,-1,1],[-10,-1,1],[-10,-1,1]]);
var wr1=wval[0];
var wr2=wval[1];
var wr3=wval[2];

var ans=ve;
var cho1=wr1;
var cho2=wr2;
var cho3=wr3;
var errchk=0;
while(mbs.dplchk([ve,wr1,wr2,wr3],true)){
var wval=mbs.rvar([ve,0,0],[[-10,-1,1],[-10,-1,1],[-10,-1,1]]);
var wr1=wval[0];
var wr2=wval[1];
var wr3=wval[2];

var cho1=wr1;
var cho2=wr2;
var cho3=wr3;
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

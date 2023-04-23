module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[1,10,1],[1,10,1],[1,10,1],[1,10,1],[1,10,1]],'(ca*cd-cb*cc-ce*cb-ce*cd)==0 || ((ca*cd-cb*cc-ce*cb-ce*cd)*(ca*cd-cb*cc-ce*cb-ce*cd))%((ca+cc)*(ca+cc)*ce*2)!=0');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var vd=rst[0][3];
var ve=rst[0][4];

var absu=(va*vd-vb*vc-ve*vb-ve*vd)*(va*vd-vb*vc-ve*vb-ve*vd);
var absd=(va+vc)*(va+vc)*ve*2
var ans=absu/absd;
var wval=mbs.rvar([ans,0,0],[[1,20,1],[1,20,1],[1,20,1]]);
var wr1=wval[0];
var wr2=wval[1];
var wr3=wval[2];

var cho1=wr1;
var cho2=wr2;
var cho3=wr3;

var errchk=0;
while(mbs.dplchk([ans,wr1,wr2,wr3],true)){
 var wval=mbs.rvar([ans,0,0],[[1,20,1],[1,20,1],[1,20,1]]);
 
 wr1=wval[0];
 wr2=wval[1];
 wr3=wval[2];
 if (errchk>1000){
prbchk=1; 
break;
}
 errchk=errchk+1;
}
 cho1=wr1;
 cho2=wr2;
 cho3=wr3;



prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};

module.exports={
spamprb:function(prbrows){
var prbchk=0;//problem checking through while loop
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var _=require('underscore');
//var rst=pr.AnsFuncc([[-20,-1,1],[1,10,1],[-20,-1,1],[1,10,1],[1,10,1]]);
var rst=pr.AnsFuncc([[1,6,1],[1,3,1],[1,8,1],[1,6,1],[1,6,1],[1,6,1]],'(cb*cf-ce*cc)/(cb*cd-ca*ce) <4 ||(cb*cf-ce*cc)/(cb*cd-ca*ce) > 9|| (cb*cd-ca*ce)>=0');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var vd=rst[0][3];
var ve=rst[0][4];
var vf=rst[0][5];

var px=Math.floor((vb*vf-ve*vc)/(vb*vd-va*ve));
var pxl = _.range(px);
pxl.splice(0,1);
var sumn=0
var uu=0;
while (uu<pxl.length){
 yl=Math.ceil((vf-vd*pxl[uu])/ve);
 yr=Math.floor((vc-va*pxl[uu])/vb);
 if(yr>1){
   if(yl<1){
    for (var i=1; i<yr; i++){
     sumn+=1;
    }
   }else{
    for (var i=yl+1; i<yr; i++){
     sumn+=1;
   }

  }
 }
 uu=uu+1;
}

var ans=sumn;

var wval=mbs.rvar([0,0,0],[[0,10,1],[0,10,1],[0,10,1]]);
var wr1=wval[0];
var wr2=wval[1];
var wr3=wval[2];

var cho1=wr1;
var cho2=wr2;
var cho3=wr3;

var errchk=0;//error checking in while loop
while(mbs.dplchk([ans,wr1,wr2,wr3],true)){
 var wval=mbs.rvar([0,0,0],[[0,10,1],[0,10,1],[0,10,1]]);
 var wr1=wval[0];
 var wr2=wval[1];
 var wr3=wval[2];
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

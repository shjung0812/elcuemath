module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[1,5,1],[1,5,1],[1,5,1],[1,5,1],[1,5,1],[1,5,1],[1,5,1],[1,10,1]],'(ca*ce-cb*cd)==0 || (cb*cf+ce*cc)%(ca*ce-cb*cd)!=0 || (cc*cd+ca*cf)%(ca*ce-cb*cd)!=0');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var vd=rst[0][3];
var ve=rst[0][4];
var vf=rst[0][5];

var vg=rst[0][5];
var vl=rst[0][6];

var vu=(vb*vf+ve*vc)/(va*ve-vb*vd);
var vk=(vc*vd+va*vf)/(vb*vd-va*ve);
var vh=vk*vl-vg*vu;

var wval=mbs.rvar([vl,0,0],[[1,10,1],[1,10,1],[-10,10,1]]);
var wr1=wval[0];
var wr2=wval[1];
var wr3=wval[2];

var ans=vl;
var cho1=wr1;
var cho2=wr2;
var cho3=wr3;
var errchk=0;
while(mbs.dplchk([vl,wr1,wr2,wr3],true)){
 var wval=mbs.rvar([vl,0,0],[[1,10,1],[1,10,1],[-10,10,1]]);
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

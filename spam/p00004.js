module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[-10,-1,1],[-10,-1,1],[1,11,1],[1,11,1],[-10,-1,1],[1,11,1],[1,11,1],[-10,-1,1]],'(cf-ch)%(ce-cg)!=0');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var vd=rst[0][3];
var ve=rst[0][4];
var vf=rst[0][5];
var vg=rst[0][6];
var vh=rst[0][7];

var mm=(vf-vh)/(ve-vg);

var yb=vd-vf-mm*vc+mm*ve;
var ybp=vb-vf-mm*va+mm*ve;

var wval=mbs.rvar([vd,vf,vc,ve],[[1,11,1],[1,11,1],[1,11,1],[-10,-1,1]]);
var wr1=wval[0]-vf-mm*wval[2]+mm*ve;
var wr2=vd-wval[1]-mm*vc+mm*wval[3];
var wr3=wval[0]-wval[1]-mm*vc+mm*ve;



var ans=`${yb}초과 ${ybp}미만`
var cho1=`${wr1}초과 ${ybp}미만`
var cho2=`${yb}초과 ${wr2}미만`
var cho3=`${wr3}초과 ${ybp}미만`

var errchk=0;
//while(mbs.dplchk([Math.abs(wr1),Math.abs(wr2),Math.abs(wr3),Math.abs(yb),Math.abs(ybp)],true)){
while(mbs.dplchk([Math.abs(wr1),Math.abs(yb),Math.abs(wr2),Math.abs(wr3)],true) || mbs.dplchk([Math.abs(ybp),Math.abs(wr2),Math.abs(wr3),Math.abs(wr1)],true) ){
//while(1){
var wval=mbs.rvar([vd,vf,vc,ve],[[1,11,1],[1,11,1],[1,11,1],[-10,-1,1]]);
var wr1=wval[0]-vf-mm*wval[2]+mm*ve;
var wr2=vd-wval[1]-mm*vc+mm*wval[3];
var wr3=wval[0]-wval[1]-mm*vc+mm*ve;

if(errchk>1000){
 prbchk=1;
 break;

}
errchk=errchk+1;
}
yb=Math.abs(yb);
ybp=Math.abs(ybp);
wr1=Math.abs(wr1);
wr2=Math.abs(wr2);
wr3=Math.abs(wr3);
var ans=`양의방향으로 ${yb} 초과 또는  음의 방향으로 ${ybp}`
var cho1=`양의방향으로 ${wr1} 초과 또는 음의 방향으로  ${ybp}`
var cho2=`양의방향으로 ${yb} 초과 또는 음의 방향으로  ${wr2}`
var cho3=`양의방향으로 ${wr3} 초과 또는 음의 방향으로  ${ybp}`



prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};

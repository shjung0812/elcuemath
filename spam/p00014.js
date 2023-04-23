module.exports={
spamprb:function(prbrows){
var prbchk=0;//problem checking through while loop
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[2,10,1],[11,20,1],[22,100,2],[2,10,1],[11,20,1],[21,100,1],[21,30,1]],'ca==cd || cb==ce || (cc-cf)%(ca+cb-cd-ce)!=0 || (cc-(ca+cb-2))%2!=0 || (cc-cf)*(ca+cb-cd-ce)<=0');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var vd=rst[0][3];
var ve=rst[0][4];
var vf=rst[0][5];
var vg=rst[0][6];


var pb=(vc-vf)/(va+vb-vd-ve);
var pa=(vc-(va+vb-2)*pb)/2;

var ans=pa+(vg-1)*pb;



var wval=mbs.rvar([0,0,0],[[1,2*Math.abs(ans),1],[1,2*Math.abs(ans),1],[1,2*Math.abs(ans),1]]);
var wr1=wval[0];
var wr2=wval[1];
var wr3=wval[2];


var cho1=wr1;
var cho2=wr2;
var cho3=wr3;


var errchk=0;//error checking in while loop
while(mbs.dplchk([ans,wr1,wr2,wr3],true)){
 var wval=mbs.rvar([0,0,0],[[1,2*Math.abs(ans),1],[1,2*Math.abs(ans),1],[1,2*Math.abs(ans),1]]);
 var wr1=wval[0];
 var wr2=wval[1];
 var wr3=wval[2];
 if (errchk>1000){
prbchk=1; 
break;
}
 errchk=errchk+1;
}



var cho1=wr1;
var cho2=wr2;
var cho3=wr3;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};

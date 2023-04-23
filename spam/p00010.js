module.exports={
spamprb:function(prbrows){
var prbchk=0;//problem checking through while loop
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
//var rst=pr.AnsFuncc([[-20,-1,1],[1,10,1],[-20,-1,1],[1,10,1],[1,10,1]]);
var rst=pr.AnsFuncc([[1,10,1],[1,10,1],[1,10,1],[1,10,1],[1,10,1]],'(ca*ce+cb-cc-1)%ca*cd==0 || (ca*ce+cb-cc)%ca*cd==0');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var vd=rst[0][3];
var ve=rst[0][4];

var pml1=va*ve+vb-vc-1;
var pmr1=va*ve+vb-vc;
var pcm=va*vd;

var cm1=mbs.gcd(pml1,pcm);
var cm2=mbs.gcd(pmr1,pcm);


var nleft=pml1/cm1;
var nright=pmr1/cm2;
var cl=pcm/cm1;
var cr=pcm/cm2;

var ans=`\\(\\frac{${nleft}}{${cl}} \\leq y \\lt \\frac{${nright}}{${cr}}\\)`;

var wval=mbs.rvar([0,0,0],[[1,30,1],[1,30,1],[1,30,1]]);
var wr1=`\\(\\frac{${wval[0]}}{${wval[1]}} \\leq y \\lt \\frac{${nright}}{${wval[1]}}\\)`;
var wr2=`\\(\\frac{${nleft}}{${cr}} \\leq y \\lt \\frac{${wval[1]}}{${cr}}\\)`;
var wr3=`\\(\\frac{${wval[0]}}{${cr}} \\leq y \\lt \\frac{${wval[2]}}{${cl}}\\)`;

var cho1=wr1;
var cho2=wr2;
var cho3=wr3;

var errchk=0;//error checking in while loop
while(mbs.dplchk([nright,wr1,wr2,wr3],true) || mbs.dplchk([nleft,wr1,wr2,wr3],true)){
var wval=mbs.rvar([0,0,0],[[1,30,1],[1,30,1],[1,30,1]]);
var wr1=`\\(\\frac{{${wval[0]}}}{{${cl}}} \\leq y \\lt \\frac{${nright}}{${cr}}\\)`;
var wr2=`\\(\\frac{${nleft}}{${wval[2]}} \\leq y \\lt \\frac{${wval[1]}}{${wval[2]}}\\)`;
var wr3=`\\(\\frac{${wval[0]}}{${cl}} \\leq y \\lt \\frac{${wval[2]}}{${cr}}\\)`;
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

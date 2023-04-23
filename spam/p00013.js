module.exports={
spamprb:function(prbrows){
var prbchk=0;//problem checking through while loop
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mbs=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[1,3,1],[2,9,1],[10,30,1],[5,20,1],[2,8,1],[1,10,1]],'(cc-ca)*cf!=(cd-1)*ce || cd<=ca || (cc-ca)%ce!=0 || ce==cf');
//var rst=pr.AnsFuncc([[1,6,1],[2,9,1],[5,10,1],[5,20,1],[2,20,1],[1,10,1]],'(cc-ca)*cf!=(cd-1)*ce || cd=<ca || (cc-ca)%ce!=0');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];
var vc=rst[0][2];
var vd=rst[0][3];
var ve=rst[0][4];
var vf=rst[0][5];

var pa=(vc-va)/ve +1;

var ans=`\\(${ve}+${vf}\\sqrt{${vb}}\\)`;

var wval=mbs.rvar([0,0,0],[[0,10,1],[0,10,1],[0,10,1]]);
var wr1=wval[0];
var wr2=wval[1];
var wr3=wval[2];

var cho1=`\\(${wr1}+${vf}\\sqrt{${vb}}\\)`;
var cho2=`\\(${ve}+${wr2}\\sqrt{${vb}}\\)`;
var cho3=`\\(${wr3}+${wr1}\\sqrt{${vb}}\\)`;



var errchk=0;//error checking in while loop
while(mbs.dplchk([ve,vf,wr1,wr2,wr3],true)){
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

var cho1=`\\(${wr1}+${vf}\\sqrt{${vb}}\\)`;
var cho2=`\\(${ve}+${wr2}\\sqrt{${vb}}\\)`;
var cho3=`\\(${wr3}+${wr1}\\sqrt{${vb}}\\)`;



prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};

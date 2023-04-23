module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var pr=require(path.prismbin+'prbtest');
var mb=require(path.prismbin+'mathbasic');
var rst=pr.AnsFuncc([[1,60,1],[1,60,1]],'mb.gcd(ca,cb)<10 || ca<=cb');
//var rst=pr.AnsFuncc([[1,60,1],[1,65,1]],'ca!=1');
var Nans=rst[1];
var va=rst[0][0];
var vb=rst[0][1];


sa=mb.rvar([va,vb],[[1,60,1],[1,60,1]]);
var tc1=mb.gcd(sa[0],vb);
var tc2=mb.gcd(sa[0],sa[1]);
var tc3=mb.gcd(va,sa[1]);

var ans=mb.gcd(va,vb);

while (ans==tc1){
	sa=mb.rvar([va,vb],[[1,60,1],[1,60,1]]);
	tc1=mb.gcd(sa[0],sa[1]);
}

while(tc2==ans || tc2==tc1){
	sa=mb.rvar([va,vb],[[1,60,1],[1,60,1]]);
	tc2=mb.gcd(sa[0],sa[1]);
}

while (tc3==ans || tc3==tc1 || tc3==tc2){
	sa=mb.rvar([va,vb],[[1,60,1],[1,60,1]]);
	tc3=mb.gcd(sa[0],sa[1]);

}

var cho1=tc1;
var cho2=tc2;
var cho3=tc3;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);
return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk];


}
};

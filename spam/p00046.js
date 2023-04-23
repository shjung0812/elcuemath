module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\(-288a^{11}b^{16}c^{5}\\)`;
var cho2=`\\(-288a^{10}b^{16}c^{5}\\)`;
var cho3=`\\(-288a^{11}b^{12}c^{5}\\)`;
var ans=`\\(-288a^{11}b^{16}c^{6}\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
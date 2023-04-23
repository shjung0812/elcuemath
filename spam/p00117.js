module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((x-2y+z^{2})(x^{2}+y^{2}+z+yz+zx)\\)`;
var cho2=`\\((2xy+3xz-2)^{2}(zx+xy+2z)\\)`;
var cho3=`\\((xy+xz-2)^{2}(zx-xy-2z)\\)`;
var ans=`\\((x-y)(x^{2}+y^{2}+z^{2}+xy+yz+zx)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
module.exports={
spamprb:function(prbrows){
var prbchk=0;
var path=require('./prismpath.json');
var async=require('async');
var pr=require(path.prismbin+'prbtest');
var rst=pr.AnsFuncc([[1,10,1],[1,15,1]]);
var Nans=rst[1];

var cho1=`\\((2x-y-3)(4x^{2}-y^{2}+xy+x-y+9)\\)`;
var cho2=`\\((x+y+3)(x^{2}-y^{2}-xy+1)\\)`;
var cho3=`\\((x+y+3)(x^{2}+y^{2}+xy+3)\\)`;
var ans=`\\((2x-y-3)(4x^{2}+y^{2}+2xy+6x-3y+9)\\)`;

prbcontent=`prbcontent=`+prbrows;
eval(prbcontent);


return [prbcontent,ans,Nans,cho1,cho2,cho3,prbchk]
}
};
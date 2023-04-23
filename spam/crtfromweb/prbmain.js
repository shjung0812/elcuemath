//var prbid='p00014';
var path=require('./prismpath.json');
var plc=require(path.prismbin+'plangcho');
var mbs=require(path.prismbin+'mathbasic');
var mm=require(path.prismbin+'serverflow');
var args = process.argv.slice(2);

var ts=[1,2];
//console.log(Math.max.apply(null,ts))
//var nn = new plc.dbconnect(prbid);
/*
nn.prm.then(
function(value){console.log(value);},
function(){}
);
*/
nargs=args.toString()
//console.log(plc.dbconnect(prbid));
plc.dbconnect(nargs,0,function(k){
console.log(k);
});
/*
console.log(mbs.rvar([1,2,3,4],[[1,9,1],[1,9,1],[1,9,1],[1,9,1]],2));*/
//plc.dbconnect('p00003');
/*
mm.getinfodb('select correct from prbsolve where prbid="p00001" and userid="guest"',function(rows){
var rowlist=[];
for(var i=0;i<rows.length;i++){
rowlist[i]=rows[i].correct;
}


var cor=rowlist.reduce(function(a,b){return a+b;});
var wro=rows.length-cor;

});

var ts=mbs.dplchk([2,3,124,234,123,12],true);
console.log(ts);
*/
//mm.getinfodb('insert into 

console.log(mm.nodetime());

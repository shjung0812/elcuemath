var prbid='p00013';
var path=require('./prismpath.json');
var plc=require(path.prismbin+'plangcho');
var mbs=require(path.prismbin+'mathbasic');
var sf=require(path.prismbin+'serverflow');

var ts=[1,2];

var username='yaein06';
sf.getinfodb('select * from psreconnect where solvekind="directeval_install"',function(a){
sf.getinfodb('select * from rdcthistory',function(b){
	for(var ia=0; ia<a.length; ia++){
	for(var ib=b.length-1; ib>=0; ib--){
		if(a[ia].createdate > b[ib].createdate && a[ia].prbid==b[ib].prbid){
			console.log(a[ia].userid,a[ia].createdate,b[ib].numid,b[ib].createdate);
			sf.getinfodb('update psreconnect set solvepic="'+b[ib].numid+'", solvekind="directeval_install" where numid="'+a[ia].numid+'"',function(){});
			break;
		} 
	}
	}
});
});
/*
sf.getinfodb('select * from mmcpuserassign where userid="'+username+'"',function(a){
console.log(a[0].mmcpconnectid);
var mpconlist=a[0].mmcpconnectid.split(',');
for(var ia=0; ia<mpconlist.length; ia++){
	sf.getinfodb('insert into mmcphwassign (userid, mmcpconid, username) values ("'+username+'", "'+mpconlist[ia]+'","wjdtjrgus")',function(b){
	});
}

});
*/
/*
sf.getinfodb('select * from mmcphwassign where userid="'+username+'"',function(b){
sf.getinfodb('select * from mmcpprb',function(a){
sf.getinfodb('select * from mmcpconnect',function(c){
	//prbstring make it
	var pairset=[];

	for(var ia=0; ia<a.length; ia++){
		pairset.push([a[ia].mmcpid, a[ia].prbid]);
	}

	//connect to db and create it - connect mmcpconnect  and move to mmcphwconnect;
	for(var ia=0; ia<b.length; ia++){
		for(var ib=0; ib<c.length; ib++){
			if(c[ib].mmcpconid==b[ia].mmcpconid){
				var mmcpidset=c[ib].mmcpprblist.split(',');
				var prbstr='';
				for(var id=0; id<mmcpidset.length; id++){
					for(var ie=0; ie<pairset.length; ie++){
						if(pairset[ie][0]==mmcpidset[id]){
							prbstr=prbstr+pairset[ie][1]+',';
							break;
						}
					}
				}

				var nprbstr=prbstr.split(',');
				var pstr=''
				for(var ig=0; ig<nprbstr.length-1; ig++){
					if(ig==nprbstr.length-2){
						pstr=pstr+nprbstr[ig];
					}else{
						pstr=pstr+nprbstr[ig]+',';	
					}
				}


				sf.getinfodb('insert into mmcphwconnect (mmcpconid, mmcpprblist, createdate, mmcplistinfo, numprb, username) values ("'+b[ia].mmcpconid+'","'+pstr+'","'+c[ib].createdate+'","'+c[ib].mmcplistinfo+'","'+c[ib].numprb+'","wjdtjrgus")',function(){});
				break;
			}
		}
	}

});
});
});

*/
//console.log(Math.max.apply(null,ts))
//var nn = new plc.dbconnect(prbid);
/*
nn.prm.then(
function(value){console.log(value);},
function(){}
);

plc.dbconnect('s00001',0,function(k){
console.log(k);
});

mm.prbsetv2(['p00001','p00002','p00100','p00010'],function(k){
console.log(k);
});
mm.crselecont('sara','GG170102aaaaaa',function(n,cont){
		console.log(n,cont);
	});*/
//mm.prbmanufac('sara','GG170102aaaaaa',function(k){
//	console.log(k);
//});
//end=mm.urlparse(['quer','쿼리'],0);
//console.log(end)

//console.log(mm.numsel([0,1,2,1,0,0,2,1],4,2,1,'@@@'));
/*
var uri = 'https://w3schools.com/my test.asp?name=stale&car=saab+3ssse';
var uri_enc=encodeURIComponent(uri);
var uri_dec=decodeURIComponent(uri_enc);
var res = uri_enc+'  ' + uri_dec;
console.log(res);*/

/*
mm.getinfodb('select pt.pcsinfo,pn.prbid,pn.normid,pn.cateopt  from pcsconnect as pn join pcscate as pt on pt.pcsid=pn.normid where pt.pcsopt="pcp"',function(rs){
	for(var ia=0; ia<rs.length; ia++){
//		console.log(rs[ia].pcsinfo);
		mm.getinfodb('update pcsconnect set cateopt="prb_pcp" where pcsconnect.normid="'+rs[ia].normid+'" and pcsconnect.prbid="'+rs[ia].prbid+'"',function(){});
	}
});



var buff1 = new Buffer('hi');
var buff2 = Buffer.from('hi');

console.log(buff1.toString());
console.log(buff2);
*/
//mm.rdcsdbUpdate();


//sf.XXXYYY('p00111',function(a){
//});
/*
sf.R2toR1FreePicking(function(a){
	console.log(a);
});*/
/*
var path=require('./prismpath.json');
var pr=require(path.prismbin+'plangcho');
pr.dbconnect('p00111',0,function(r){
	console.log(r);
});*/




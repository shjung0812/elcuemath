
module.exports={
gcd:function(a,b){
var temp;
while(b!=0){
temp=a%b;
a=b;
b=temp;
}
return Math.abs(a);
},
rvar:function(an,avr,dis){
var path=require('./prismpath.json');
var rand=require(path.prismbin+'prbtest');
var testva=[];
var kk;
var anl=an.length
var vl,vh,vd;
var arrv=[];
if(dis){
	var kk=0;
	an.forEach(function(ele,index,arr){
		testva[index]=ele;
		kk=kk+1;
	});
	var um=0;
	while (um<anl){
		vl=avr[um][0];
		vh=avr[um][1];
		vd=avr[um][2];
		testva[kk]=rand.randrange(vl,vh,vd);
		var ub=0;
		var tcomp=0;
		var mesg=0;
		while (tcomp!=kk){
			while (ub<kk){
				if (testva[ub]==testva[kk]){
					ub=kk;
					tcomp=kk;
					mesg=1;
				}else{
					tcomp=tcomp+1;
					mesg=0;
				}	
				ub=ub+1;

			}
		}
		if (mesg==1){
		}else{
			arrv[um]=testva[kk];
			kk=kk+1;
			um=um+1;		
		}

		
	}


}else{
	var us=0;
	an.forEach(function(ele,index,arr){
		vl=avr[us][0];
		vh=avr[us][1];
		vd=avr[us][2];
		arrv[us]=rand.randrange(vl,vh,vd);
		while(ele==arrv[us]){
			vl=avr[us][0];
			vh=avr[us][1];
			vd=avr[us][2];
			arrv[us]=rand.randrange(vl,vh,vd);

		}
	us=us+1;

	});
	
}
return arrv;
},
dplchk:function(arr,justCheck){
var len=arr.length, tmp={}, arrtmp=arr.slice(), dupes = [];
arrtmp.sort();
while(len--){
 var val = arrtmp[len];
 if(/nul|nan|infini/i.test(String(val))){ 
  val = String(val);
 }
 if (tmp[JSON.stringify(val)]){
  if(justCheck){return true;}
  dupes.push(val);
  }
  tmp[JSON.stringify(val)]=true;
 }
return justCheck ? false : dupes.length ? dupes : null;
}

};


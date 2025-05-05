var anslist='';
function chklist(pcp,list){
	var achk=0;
	var o1aspcplist=list.split(',');
	for(var ie=0; ie<o1aspcplist.length; ie++){
		if(pcp==o1aspcplist[ie]){
			achk=1;
		}
	}
	return [achk,o1aspcplist];
}
function showanswer(id){
	var anchk=chklist(id,anslist);
	var vadd;
	if(anslist==''){
		anslist=id;
	}else{
		if(anchk[0]==0){
			anslist=anslist+','+id;
			vadd=1;
		}else{
			anslist='';
			var idx=anchk[1].indexOf(id);
			anchk[1].splice(idx,1);
			for(var ia=0; ia<anchk[1].length; ia++){
				if(anchk[1].length-1==ia){
					anslist=anslist+anchk[1][ia];
				}else{	
					anslist=anslist+anchk[1][ia]+',';
				}
			}
			vadd=0;
		}
	}
	var asprb;
	if(anslist==''){
		makeallhidden('prbansa')
	
	}else{
		makeallhidden('prbansa')
		var o1anslist=anslist.split(',');
		for(var ia=0; ia<o1anslist.length; ia++){
			
			asprb=document.getElementById(o1anslist[ia])
			if(asprb){
				asprb.style.visibility='visible';
			}
		}
	}

}
function makeallhidden(classname){
	var allpcp=document.getElementsByClassName(classname)
	for(var ia=0; ia<allpcp.length; ia++){
		allpcp[ia].style.visibility='hidden';
		//allpcp[ia].style.borderStyle='none';
	}
}

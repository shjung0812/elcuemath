Element.prototype.remove=function(){
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function(){
	for(var i=this.length -1; i>=0; i--){
		if(this[i]&& this[i].parentElement){
			this[i].parentElement.removeChild(this[i]);
		}
	}
}

var psresocket = io('/mmcp');

psresocket.on('connect',()=>{
	console.log('connection ready');

});




function realtimeEqualizer(teacherid,studentid,dtime,idprefix,mode){
	psresocket.emit('realtimeequalizer',{teacherid:teacherid,dtime:dtime,idprefix:idprefix,mode:mode,studentid:studentid});
	
}

psresocket.on('realtimeequalizerafter',function(a){
	if(a.mode=='hw'){
		var objdiv=document.getElementsByClassName('evalresultdiv');
		for(var ib=0; ib<a.realstate.length; ib++){
		for(var ia=0; ia<objdiv.length; ia++){
				if(objdiv[ia].id==a.idprefix+a.realstate[ib].solvepic){
					for(var ic=0; ic<5; ic++){
						objdiv[ia].childNodes[ic].style.border='';
					}
					objdiv[ia].childNodes[Number(a.realstate[ib].ratingdetail-1)].style.border='thin solid red';
				}
		}
		}
	}else if(a.mode=='directeval'){
		var directeval=document.getElementById('directeval');
		var prbid=directeval.getAttribute('data-prbid');
		for(var ib=0; ib<a.realstate.length; ib++){
			if(a.realstate[ib].prbid==prbid){
				for(var ic=0; ic<5; ic++){
					directeval.childNodes[ic].style.border='';
					console.log('here');
				}
				directeval.childNodes[Number(a.realstate[ib].ratingdetail-1)].style.border='thin solid red';

			}
		}
	}else if(a.mode=='directeval_install'){
		var objdiv=document.getElementsByClassName('directeval_install');
		for(var ib=0; ib<a.realstate.length; ib++){
		for(var ia=0; ia<objdiv.length; ia++){
				if(objdiv[ia].id==a.idprefix+a.realstate[ib].prbid){
					for(var ic=0; ic<5; ic++){
						objdiv[ia].childNodes[ic].style.border='';
					}
					objdiv[ia].childNodes[Number(a.realstate[ib].ratingdetail-1)].style.border='thin solid red';
				}
		}
		}


	}
	
});

function shownFunc(solveobj,idprefix,pnum,tusername,evalpanelid){
	var evalitemsNum=0;
	var evalave=0;
	var evalmsg=['Low Undrstding','Few Undrstding','Modrte Undrstding', 'Almst Undrstding','Perfect Undrstding'];
	for(var ia=0; ia<solveobj.length; ia++){
		if(solveobj[ia].evalresult!=null){
			evalitemsNum++;
			evalave+=(solveobj[ia].evalresult-1)*0.25;
			//evalave+=piclist[ia][6]*0.2;
		}


		var imgdiv=document.getElementById(idprefix+solveobj[ia].solvepic);
		var evalresultdiv=document.createElement('div');
		
		evalresultdiv.style.width='100%';
		evalresultdiv.style.fontSize='.7em';
		evalresultdiv.style.textAlign='center';
	//	evalresultdiv.style.cursor='pointer';
		evalresultdiv.style.margin='1% 0';
		evalresultdiv.className='evalresultdiv';

		for(var ib=0; ib<5; ib++){
			var fdiv=document.createElement('div');
			fdiv.style.display='inline-block';
			fdiv.style.width='19%'
			fdiv.innerHTML=evalmsg[ib];
			/*
			fdiv.onclick=function(i,j,k){
				return function(){
					//SendEvalResult(i,j,(k+1),tusername);
					for(var ic=0; ic<this.parentNode.childNodes.length; ic++){
						this.parentNode.childNodes[ic].style.border='';
					}
					this.style.border='thin solid red';
				}
			}(solveobj[ia].prbid, solveobj[ia].solvepic,ib);*/
			if(solveobj[ia].evalresult==(ib+1)){
				fdiv.style.border='thin solid red'

			}
			evalresultdiv.appendChild(fdiv);

			
		}


		imgdiv.insertBefore(evalresultdiv,imgdiv.childNodes[pnum]);
	}

	if(evalpanelid!=''){
		var evalpanel=document.getElementById(evalpanelid);
		if(evalitemsNum!=0){
			var evalgrade=Math.round((evalave/evalitemsNum)*1000)/10;
			var evalgradeel=document.createElement('div');
			evalgradeel.innerHTML=evalgrade;
			evalpanel.appendChild(evalgradeel);
		}
	}
}

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


var evalmsg=['Low Utd','Few Utd','Modrte Utd', 'Almst Utd','Perfect Utd'];


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
				}
				directeval.childNodes[Number(a.realstate[ib].ratingdetail-1)].style.border='thin solid red';

			}
		}
	}else if(a.mode=='directeval_install'){
		var objdiv=document.getElementsByClassName('directeval_install');
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


	}
	
});
function tempAlert(msg,duration,color){
	var el = document.createElement("div");
	el.setAttribute("style","position:absolute;z-index:20;top:10%;left:35%;background-color:"+color[0]+";padding:5% 10%;color:"+color[1]+";");
	el.innerHTML = msg;
	setTimeout(function(){
		el.parentNode.removeChild(el);
	},duration);
	document.body.appendChild(el);
}
function evalShown(directevaldiv,prbid,mentorid,studentid,cname){
	function removeallele(parentid){
		var parent=document.getElementById(parentid);
			while(parent.firstChild){
			parent.firstChild.remove();
		}
	}

	if(directevaldiv==null){
		console.log('trouble alert! from psre psreassign.js');
	}
		
	directevaldiv.style.width='100%';
	directevaldiv.style.fontSize='.7em';
	directevaldiv.style.textAlign='center';
	directevaldiv.style.cursor='pointer';
	directevaldiv.style.margin='1% 0';
	//directevaldiv.style.backgroundColor='#C9B3E1';
	directevaldiv.className=cname;

	for(var ib=0; ib<5; ib++){
		var fdiv=document.createElement('div');
		fdiv.style.display='inline-block';
		fdiv.style.width='15%'
		fdiv.innerHTML=evalmsg[ib];


		directevaldiv.appendChild(fdiv);
	}
	return directevaldiv;	
}





function directEval_install(directevaldiv,prbid,mentorid,studentid,numid){
	function removeallele(parentid){
		var parent=document.getElementById(parentid);
			while(parent.firstChild){
			parent.firstChild.remove();
		}
	}

	if(directevaldiv==null){
		console.log('trouble alert! from psre psreassign.js');
	}
		
	directevaldiv.style.width='100%';
	directevaldiv.style.fontSize='.7em';
	directevaldiv.style.textAlign='center';
	directevaldiv.style.cursor='pointer';
	directevaldiv.style.margin='1% 0';
	//directevaldiv.style.backgroundColor='#C9B3E1';
	directevaldiv.className='directeval_install';

	var d=new Date();
	var uniid=studentid+prbid+d.getYear()+d.getMonth()+d.getDate();
	for(var ib=0; ib<5; ib++){
		var fdiv=document.createElement('div');
		fdiv.style.display='inline-block';
		fdiv.style.width='15%'
		fdiv.innerHTML=evalmsg[ib];
		fdiv.onclick=function(i,j,k){
			return function(){
				SendEvalResult(i,j,(k+1),mentorid,studentid,"directeval_install");
				for(var ic=0; ic<this.parentNode.childNodes.length; ic++){
					this.parentNode.childNodes[ic].style.border='';
				}
				this.style.border='thin solid red';
			}
		}(prbid,numid,ib);



		directevaldiv.appendChild(fdiv);
	}
	var fdiv=document.createElement('div');
	fdiv.innerHTML='삭제';
	fdiv.style.display='inline-block';
	fdiv.style.width='10%'
	fdiv.style.backgroundColor='red';
	fdiv.style.color='white';

	fdiv.onclick=function(j){
		return function(){
			removeEvalresult(studentid,j);
			for(var ic=0; ic<this.parentNode.childNodes.length; ic++){
				this.parentNode.childNodes[ic].style.border='';
			}
		}
	}(numid);



	directevaldiv.appendChild(fdiv);

	return directevaldiv;	
}




function directEval(divid,prbid,mentorid,studentid){
	function removeallele(parentid){
		var parent=document.getElementById(parentid);
			while(parent.firstChild){
			parent.firstChild.remove();
		}
	}

	removeallele(divid);
	var directevaldiv=document.getElementById(divid);
	directevaldiv.setAttribute('data-prbid',prbid);
	if(directevaldiv==null){
		console.log('trouble alert! from psre psreassign.js');
	}
		
	directevaldiv.style.width='100%';
	directevaldiv.style.fontSize='.7em';
	directevaldiv.style.textAlign='center';
	directevaldiv.style.cursor='pointer';
	directevaldiv.style.margin='1% 0';
	directevaldiv.className='directevaldiv';


	var d=new Date();
	var uniid=studentid+prbid+d.getYear()+d.getMonth()+d.getDate();
	for(var ib=0; ib<5; ib++){
		var fdiv=document.createElement('div');
		fdiv.style.display='inline-block';
		fdiv.style.width='15%'
		fdiv.innerHTML=evalmsg[ib];
		fdiv.onclick=function(i,j,k){
			return function(){
				SendEvalResult(i,j,(k+1),mentorid,studentid,"directeval");
				for(var ic=0; ic<this.parentNode.childNodes.length; ic++){
					this.parentNode.childNodes[ic].style.border='';
				}
				this.style.border='thin solid red';
			}
		}(prbid,uniid,ib);



		directevaldiv.appendChild(fdiv);
	}
	var fdiv=document.createElement('div');
	fdiv.innerHTML='삭제';
	fdiv.style.display='inline-block';
	fdiv.style.width='10%'
	fdiv.style.backgroundColor='red';
	fdiv.style.color='white';

	directevaldiv.appendChild(fdiv);
	
	realtimeEqualizer(mentorid,studentid,100000,'','directeval')
}

function removeEvalresult(tusername,picid){
	if(typeof tusername !=='undefined'){
		psresocket.emit('psreteacherevalprbpic',{picid:picid,servermode:'remove'});
	}

}

function SendEvalResult(prbid,picid,eval,tusername,susername,evalmode){
	if(typeof tusername !=='undefined'){
		psresocket.emit('psreteacherevalprbpic',{prbid:prbid, picid:picid,eval:eval,teacherid:tusername,studentid:susername,servermode:'add',evalmode:evalmode});
	}
}




function assignFunc(solveobj,idprefix,pnum,tusername,evalpanelid,studentid){

	var evalitemsNum=0;
	var evalave=0;
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
		evalresultdiv.style.cursor='pointer';
		evalresultdiv.style.margin='1% 0';
		evalresultdiv.className='evalresultdiv';
		evalresultdiv.id=idprefix+solveobj[ia].solvepic;

		for(var ib=0; ib<5; ib++){
			var fdiv=document.createElement('div');
			fdiv.style.display='inline-block';
			fdiv.style.width='15%'
			fdiv.innerHTML=evalmsg[ib];
			fdiv.onclick=function(i,j,k){
				return function(){
					SendEvalResult(i,j,(k+1),tusername,studentid,"hw");
					for(var ic=0; ic<this.parentNode.childNodes.length; ic++){
						this.parentNode.childNodes[ic].style.border='';
					}
					this.style.border='thin solid red';
				}
			}(solveobj[ia].prbid, solveobj[ia].solvepic,ib);
			if(solveobj[ia].evalresult==(ib+1)){
				fdiv.style.border='thin solid red'

			}
			evalresultdiv.appendChild(fdiv);
		}
		var fdiv=document.createElement('div');
		fdiv.innerHTML='삭제';
		fdiv.style.display='inline-block';
		fdiv.style.width='10%'
		fdiv.style.backgroundColor='red';
		fdiv.style.color='white';
		fdiv.onclick=function(j){
			return function(){
				removeEvalresult(tusername,j);
				for(var ic=0; ic<this.parentNode.childNodes.length; ic++){
					this.parentNode.childNodes[ic].style.border='';
				}
			}
		}(solveobj[ia].solvepic);

		evalresultdiv.appendChild(fdiv);

		//imglist.insertBefore(imgnode[ia],imglist.childNodes[1]);
		imgdiv.insertBefore(evalresultdiv,imgdiv.childNodes[pnum]);
		//imgdiv.appendChild(evalresultdiv);
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



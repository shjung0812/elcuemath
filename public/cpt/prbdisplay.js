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



var cpdsocket = io('/cpt');

cpdsocket.on('connect',()=>{
	console.log('cpt connection ready');

});


function callr0list(plist){
	socket.emit('cpdcallr0',{plist:plist})
	inifunc=0;
	document.getElementById('cpdbodydiv').remove();
	document.onkeydown='';

}


cpdsocket.on('cpdcallr1after',function(a){
	removeallele('cpdr1set');
	var r1setdiv=document.getElementById('cpdr1set');
	for(var ia=0; ia<a.b.length; ia++){
		var r1div=document.createElement('div');
		r1div.onclick=function(i,j,k,l){
			return function(){
				callr0list(i);
				//focusdisplay(i,j,k);
				//putcoloronme(k);
				//changeOption(0);
			}
		}(a.b[ia].prblist,a.b[ia].listinfo,a.b[ia].cptid,ia);
		//r1div.id=a.b[ia].cptid;
		//r1div.class='chosenprbs';
		var r1diva=document.createElement('a');
		r1diva.innerHTML=a.b[ia].listinfo;
		r1div.appendChild(r1diva);
		r1setdiv.appendChild(r1div);
	}
});



function cpdcallR1(r2id){
	cpdsocket.emit('cpdcallr1',{r2id:r2id});
}





function removeallele(parentid){
	var parent=document.getElementById(parentid);
	while(parent.firstChild){
		parent.firstChild.remove();
	}
}


cpdsocket.on('cpdcallr2after',function(a){
	removeallele('cpdr2set');
	var r2setdiv=document.getElementById('cpdr2set');
	for(var ia=0; ia<a.b.length; ia++){
		var r2div=document.createElement('div');
		r2div.onclick=function(i){
			return function(){
				cpdcallR1(i);
				//putColoron('r2div',i,['blue','white']);

			}
		}(a.b[ia].r2id);
		//r2div.id=a.b[ia].r2id;
		//r2div.className='r2div';
		var r2diva=document.createElement('a');
		r2diva.style.color='white';
		r2diva.innerHTML=(ia+1)+' '+a.b[ia].r2listinfo;
		r2div.appendChild(r2diva);
		r2setdiv.appendChild(r2div);
	}


});




function cpdcallR2(r3id){
	cpdsocket.emit('cpdcallr2',{r3id:r3id});
}





cpdsocket.on('cpdcallr3after',function(a){
	removeallele('cpdr3set');
	/*
	var r3set=document.getElementById('cpdr3set')
	
	for(var ia=0; ia<a.a.length; ia++){
		var r3setdiv=document.createElement('div');
		var r3setdiva=document.createElement('A');
		r3setdiv.onclick=function(i){
			return function(){
				cpdcallR2(i);
			}
		}(a.a[ia].r3id)

		r3setdiva.innerHTML=a.a[ia].listinfo;
		r3setdiv.appendChild(r3setdiva);
		r3set.appendChild(r3setdiv);
	}*/

	cpdcallR2(a.a[0].r3id);

});

//distinguish name 'cpd';

var inifunc=0;
function cptprbdisplay(prbdisplayid,divwidth, divposx, divposy){

	if(inifunc==0){
		var bodydiv=document.createElement('div');
		bodydiv.id='cpdbodydiv';
		
		const gratio=1;
		//const gratio=0.618;
		const bodywidth=divwidth;
		bodydiv.style.width=bodywidth + '%';
		bodydiv.style.height=bodywidth+'%';
		bodydiv.style.backgroundColor='red';
		bodydiv.style.position='fixed';
		bodydiv.style.top=divposx+'%';
		bodydiv.style.left=divposy+'%';
		bodydiv.style.overflow='auto';
		document.getElementsByTagName('body')[0].appendChild(bodydiv);




		var cpdr3set=document.createElement('div');
		cpdr3set.id='cpdr3set';
		var cpdr2set=document.createElement('div');
		cpdr2set.id='cpdr2set';
		var cpdr1set=document.createElement('div');
		cpdr1set.id='cpdr1set';
	

		bodydiv.appendChild(cpdr3set);
		bodydiv.appendChild(cpdr2set);
		bodydiv.appendChild(cpdr1set);

		cpdsocket.emit('cpdcallr3');




		inifunc=1;

	}else{
		inifunc=0;
		document.getElementById('cpdbodydiv').remove();
		document.onkeydown='';
	}



	var prbdisdiv=document.getElementById(prbdisplayid);
}


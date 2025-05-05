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

var qprbsocket = io('/qprb');

qprbsocket.on('connect',()=>{
	console.log('connection ready');

});

function tempAlert(msg,duration){
	var el = document.createElement("div");
	el.setAttribute("style","position:absolute;top:10%;left:35%;background-color:#eeeeee;padding:5% 10%;z-index:6;");
	el.innerHTML = msg;
	setTimeout(function(){
		el.parentNode.removeChild(el);
	},duration);
	document.body.appendChild(el);
}

var laststat=0;



var editfunc=0;
function editFunc(pinfo,divwidth,divposx,divposy){
	if(editfunc==0){
		var editbodydiv=document.createElement('div');
		editbodydiv.id='editbodydiv';
		
		//const gratio=0.618;
		const gratio=1;
		const editbodywidth=divwidth;
		editbodydiv.style.width=editbodywidth + '%';
		editbodydiv.style.height=editbodywidth+'%';
		editbodydiv.style.backgroundColor='red';
		editbodydiv.style.position='fixed';
		editbodydiv.style.top=divposx+'%';
		editbodydiv.style.left=divposy+'%';

		document.getElementsByTagName('body')[0].appendChild(editbodydiv);
			
	
		var textareadiv = document.createElement('div');
		textareadiv.id='textareadiv';
		textareadiv.style.width=100+'%';
		textareadiv.style.height=90+'%';

		var textareael=document.createElement('textarea');
		textareael.id='textareael';
		textareael.value=pinfo[1];
		textareael.style.width=100+'%';
		textareael.style.height=100+'%';
		textareael.style.padding=5+'%';
		textareael.style.fontSize='2vw';
		textareadiv.appendChild(textareael);
		editbodydiv.appendChild(textareadiv);
		editfunc=1;
		document.onkeydown = function(e){
			if(e.shiftKey && e.which==115 && !e.ctrlKey){//preview
				e.preventDefault();
				preViewprbUpload(pinfo,'editbodydiv');
			}else if(e.ctrlKey && e.which==32 && !e.shiftKey){
				var el=document.getElementById('textareael');
				//insertAtCursor(el,'\\(\\)',2);
				insertAtCursor(el,'\\(\\displaystyle \\)',2);
			}else if(e.ctrlKey && e.shiftKey && e.which!=32){
				var el=document.getElementById('textareael');
				insertAtCursor(el,'\\[\\displaystyle \\]',2);
				//insertAtCursor(el,'\\[\\]',2);
			}else if(e.shiftKey && e.which==54){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'^{}',1);

			}else if(e.shiftKey && e.which==113){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'<br>',0);
			}else if(e.shiftKey && e.which==112){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'\\frac{}{}',3);

			}


		}


	}else if(editfunc==1){
		editfunc=0;
		document.getElementById('editbodydiv').remove();
		document.onkeydown='';
	}
}


function callWritingInDiv(bdv){
	removeallele(bdv);
	var bodydiv=document.getElementById(bdv);

	var textareadiv = document.createElement('div');
	textareadiv.id='textareadiv';
	textareadiv.style.width=100+'%';
	textareadiv.style.height=90+'%';

	var textareael=document.createElement('textarea');
	textareael.id='textareael';
	textareael.style.width=100+'%';
	textareael.style.height=100+'%';
	textareael.style.padding=5+'%';
	textareael.style.fontSize='2vw';
	textareael.innerHTML=currprb;
	textareadiv.appendChild(textareael);
	bodydiv.appendChild(textareadiv);

	document.onkeydown = function(e){
		if(e.shiftKey && e.which==115 && !e.ctrlKey){
			e.preventDefault();
			preViewprb('','bodydiv');
		}else if(e.ctrlKey && e.which==32 && !e.shiftKey){
			var el=document.getElementById('textareael');
			//insertAtCursor(el,'\\(\\)',2);
			insertAtCursor(el,'\\(\\displaystyle \\)',2);
		}else if(e.ctrlKey && e.shiftKey && e.which!=32){
			var el=document.getElementById('textareael');
			insertAtCursor(el,'\\[\\displaystyle \\]',2);
			//insertAtCursor(el,'\\[\\]',2);
		}else if(e.shiftKey && e.which==54){
			var el=document.getElementById('textareael');
			e.preventDefault();
			insertAtCursor(el,'^{}',1);
		}else if(e.shiftKey && e.which==113){
			var el=document.getElementById('textareael');
			e.preventDefault();
			insertAtCursor(el,'<br>',0);
		}else if(e.shiftKey && e.which==112){
			var el=document.getElementById('textareael');
			e.preventDefault();
			insertAtCursor(el,'\\frac{}{}',3);

		}


	}



}



var inifunc=0;
function iniFunc(divwidth,divposx,divposy){
	if(inifunc==0){
		var bodydiv=document.createElement('div');
		bodydiv.id='bodydiv';
		
		const gratio=1;
		//const gratio=0.618;
		const bodywidth=divwidth;
		bodydiv.style.width=bodywidth + '%';
		bodydiv.style.height=bodywidth+'%';
		bodydiv.style.backgroundColor='red';
		bodydiv.style.position='fixed';
		bodydiv.style.top=divposx+'%';
		bodydiv.style.left=divposy+'%';

		document.getElementsByTagName('body')[0].appendChild(bodydiv);

		var textareadiv = document.createElement('div');
		textareadiv.id='textareadiv';
		textareadiv.style.width=100+'%';
		textareadiv.style.height=90+'%';

		var textareael=document.createElement('textarea');
		textareael.id='textareael';
		textareael.style.width=100+'%';
		textareael.style.height=100+'%';
		textareael.style.padding=5+'%';
		textareael.style.fontSize='2vw';
		textareadiv.appendChild(textareael);
		bodydiv.appendChild(textareadiv);

		inifunc=1;
		document.onkeydown = function(e){
			if(e.shiftKey && e.which==115 && !e.ctrlKey){
				e.preventDefault();
				preViewprb('','bodydiv');
			}else if(e.ctrlKey && e.which==32 && !e.shiftKey){
				var el=document.getElementById('textareael');
				//insertAtCursor(el,'\\(\\)',2);
				insertAtCursor(el,'\\(\\displaystyle \\)',2);
			}else if(e.ctrlKey && e.shiftKey && e.which!=32){
				var el=document.getElementById('textareael');
				insertAtCursor(el,'\\[\\displaystyle \\]',2);
				//insertAtCursor(el,'\\[\\]',2);
			}else if(e.shiftKey && e.which==54){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'^{}',1);
			}else if(e.shiftKey && e.which==113){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'<br>',0);
			}else if(e.shiftKey && e.which==112){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'\\frac{}{}',3);

			}


		}

	}else if(inifunc==1){
		inifunc=0;
		document.getElementById('bodydiv').remove();
		document.onkeydown='';
	}

		
}
function removeallele(parentid){
	var parent=document.getElementById(parentid);
	while(parent.firstChild){
		parent.firstChild.remove();
	}
}
var previewUp=0;
function preViewprbUpload(pinfo,bodyname){

	if(previewUp==0){
		var bodydiv=document.getElementById(bodyname);
		var textareacontents=document.getElementById('textareael').value;
		currprb=textareacontents;

		var previewdiv=document.createElement('div');
		previewdiv.id='previewdiv';
		previewdiv.style.width=100+'%';
		previewdiv.style.height=100+'%';
		previewdiv.style.backgroundColor='pink';

		var previewcontentsdiv=document.createElement('div');
		previewcontentsdiv.style.width=90+'%';
		previewcontentsdiv.style.height=70+'%';
		previewcontentsdiv.style.backgroundColor='grey';
		previewcontentsdiv.style.fontSize='2vw';
		previewcontentsdiv.style.padding='5% 5% 5% 5%';//curious,,,,,,,
		previewdiv.appendChild(previewcontentsdiv);
		
	
		var previewa=document.createElement('div');
		previewa.innerHTML=textareacontents;
		previewcontentsdiv.appendChild(previewa);
	

		removeallele(bodyname);
		bodydiv.appendChild(previewdiv);


		var previewOption=document.createElement('div');
		previewOption.style.width='100%';
		previewOption.style.height='10%';
		previewdiv.appendChild(previewOption);

		var sendbuttondiv=document.createElement('div');
		sendbuttondiv.style.width=50+'%';
		sendbuttondiv.style.height=100+'%';
		sendbuttondiv.style.backgroundColor='blue';
		sendbuttondiv.style.cssFloat='left';
		sendbuttondiv.onclick=function(i,j){return function(){sendPrb(i,j,0);}}(pinfo,textareacontents);
		previewOption.appendChild(sendbuttondiv);

		var uploadPhoto=document.createElement('div');
		uploadPhoto.style.width=50+'%';
		uploadPhoto.style.height=100+'%';
		uploadPhoto.style.backgroundColor='#222222';
		uploadPhoto.style.cssFloat='left';
		uploadPhoto.onclick=function(i){return function(){uploadFileEdit('editbodydiv',i);}}(pinfo);
		previewOption.appendChild(uploadPhoto);

		MathJax.Hub.Queue(["Typeset",MathJax.Hub,previewa])	
	
		//upsideDown('textareadiv','previewdiv');
		previewUp=1;
	}else if(previewUp==1){
		//upsideDown('previewdiv','textareadiv');
		//document.getElementById('previewdiv').remove();
		previewUp=0;

		removeallele('editbodydiv');
		var editbodydiv=document.getElementById('editbodydiv');
	
		var textareadiv = document.createElement('div');
		textareadiv.id='textareadiv';
		textareadiv.style.width=100+'%';
		textareadiv.style.height=90+'%';

		var textareael=document.createElement('textarea');
		textareael.id='textareael';
		textareael.value=currprb;
		textareael.style.width=100+'%';
		textareael.style.height=100+'%';
		textareael.style.padding=5+'%';
		textareael.style.fontSize='2vw';
		textareadiv.appendChild(textareael);
		editbodydiv.appendChild(textareadiv);
		editfunc=1;
		document.onkeydown = function(e){
			if(e.shiftKey && e.which==115 && !e.ctrlKey){//preview
				e.preventDefault();
				preViewprbUpload(pinfo,'editbodydiv');
			}else if(e.ctrlKey && e.which==32 && !e.shiftKey){
				var el=document.getElementById('textareael');
				//insertAtCursor(el,'\\(\\)',2);
				insertAtCursor(el,'\\(\\displaystyle \\)',2);
			}else if(e.ctrlKey && e.shiftKey && e.which!=32){
				var el=document.getElementById('textareael');
				insertAtCursor(el,'\\[\\displaystyle \\]',2);
				//insertAtCursor(el,'\\[\\]',2);
			}else if(e.shiftKey && e.which==54){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'^{}',1);
			}else if(e.shiftKey && e.which==113){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'<br>',0);
			}else if(e.shiftKey && e.which==112){
				var el=document.getElementById('textareael');
				e.preventDefault();
				insertAtCursor(el,'\\frac{}{}',3);

			}


		}



	}
}



function preViewprb(pinfo,bodyname){

	if(laststat==0){
		var bodydiv=document.getElementById(bodyname);
		var textareacontents=document.getElementById('textareael').value;
		currprb=textareacontents;

		var previewdiv=document.createElement('div');
		previewdiv.id='previewdiv';
		previewdiv.style.width=100+'%';
		previewdiv.style.height=100+'%';
		previewdiv.style.backgroundColor='pink';

		var previewcontentsdiv=document.createElement('div');
		previewcontentsdiv.style.width=90+'%';
		previewcontentsdiv.style.height=70+'%';
		previewcontentsdiv.style.backgroundColor='grey';
		previewcontentsdiv.style.fontSize='2vw';
		previewcontentsdiv.style.padding='5% 5% 5% 5%';//curious,,,,,,,
		previewdiv.appendChild(previewcontentsdiv);
		
	
		var previewa=document.createElement('div');
		previewa.innerHTML=textareacontents;
		previewcontentsdiv.appendChild(previewa);
	

		removeallele(bodyname);
		bodydiv.appendChild(previewdiv);


		var previewOption=document.createElement('div');
		previewOption.style.width='100%';
		previewOption.style.height='10%';
		previewdiv.appendChild(previewOption);

		var sendbuttondiv=document.createElement('div');
		sendbuttondiv.style.width=50+'%';
		sendbuttondiv.style.height=100+'%';
		sendbuttondiv.style.backgroundColor='blue';
		sendbuttondiv.style.cssFloat='left';
		sendbuttondiv.onclick=function(i,j){return function(){sendPrb(i,j,0);}}(pinfo,textareacontents);
		previewOption.appendChild(sendbuttondiv);

		var uploadPhoto=document.createElement('div');
		uploadPhoto.style.width=50+'%';
		uploadPhoto.style.height=100+'%';
		uploadPhoto.style.backgroundColor='#222222';
		uploadPhoto.style.cssFloat='left';
		uploadPhoto.onclick=function(i,j){return function(){sendPrb(i,j,1);}}(pinfo,textareacontents);
		previewOption.appendChild(uploadPhoto);
	
		//upsideDown('textareadiv','previewdiv');
		laststat=1;
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,previewa])	
	}else if(laststat==1){
		//upsideDown('previewdiv','textareadiv');
		//document.getElementById('previewdiv').remove();
		callWritingInDiv('bodydiv');
		laststat=0;
	}
}
function uploadFileEdit(bodyname,pinfo){
	removeallele(bodyname);
	var uploaddiv=document.createElement('div');
	uploaddiv.id='uploaddiv';
	uploaddiv.style.width=100+'%';
	uploaddiv.style.height=100+'%';
	uploaddiv.style.backgroundColor='#eeeeee';

	var bodydiv=document.getElementById(bodyname);

	var formdiv=document.createElement('div');
	var formel=document.createElement('form');
	var form=document.createElement('input');
	formel.setAttribute('enctype','multipart/form-data');
	formel.setAttribute('method','post');
	var formfile=document.createElement('input');
	formfile.id='formfile';
	formfile.setAttribute('type','file');
	formfile.onchange=function(){loadImage(event);};

	var sendbutton=document.createElement('button');
	sendbutton.innerHTML='send';
	sendbutton.onclick=function(i){return function(){sendFile(i)}}(pinfo[0]);

	formel.appendChild(formfile);
	formdiv.appendChild(formel);
	formdiv.appendChild(sendbutton);

	bodydiv.appendChild(uploaddiv);

	var photodiv=document.createElement('div');
	photodiv.style.width=100+'%';
	photodiv.style.height=100*0.617+'%';
	var photoimg=document.createElement('img');
	photoimg.style.width=100+'%';
	photoimg.style.height=100+'%';
	
	if(pinfo[8]!='nofile'){
		photoimg.src='../'+pinfo[8];
	}
	photodiv.appendChild(photoimg);
	uploaddiv.appendChild(photodiv);
	uploaddiv.appendChild(formdiv);	

	function loadImage(e){
		photoimg.src='';
		photoimg.src=URL.createObjectURL(e.target.files[e.target.files.length-1]);
	}

	function sendFile(pid){
		var formel=document.getElementById('formfile');
		var formData=new FormData();
		var formfile=formel.files[0];
		
		formData.append(pid,formfile);
		var xhr = new XMLHttpRequest();
		xhr.open('post','/qprbupload',true);
		xhr.send(formData);

		xhr.addEventListener('load',terminateEdit);
	}

	function terminateEdit(){
		//removeallelement('editbodydiv');
		document.getElementById('editbodydiv').remove();
		editfunc=0;
		previewUp=0;
		tempAlert('Photo Edited',1000)
	}

}



var currprb;
function uploadFile(bodyname,prbid){
	removeallele(bodyname);
	var uploaddiv=document.createElement('div');
	uploaddiv.id='uploaddiv';
	uploaddiv.style.width=100+'%';
	uploaddiv.style.height=100+'%';
	uploaddiv.style.backgroundColor='#eeeeee';

	var bodydiv=document.getElementById(bodyname);

	var formdiv=document.createElement('div');
	var formel=document.createElement('form');
	var form=document.createElement('input');
	formel.setAttribute('enctype','multipart/form-data');
	formel.setAttribute('method','post');
	var formfile=document.createElement('input');
	formfile.id='formfile';
	formfile.onchange=function(){loadImage(event);};
	formfile.setAttribute('type','file');

	var sendbutton=document.createElement('button');
	sendbutton.innerHTML='send';
	sendbutton.onclick=function(i){return function(){sendFile(i)}}(prbid);


	var photodiv=document.createElement('div');
	photodiv.style.width=100+'%';
	photodiv.style.height=100*0.617+'%';
	var photoimg=document.createElement('img');
	photoimg.style.width=100+'%';
	photoimg.style.height=100+'%';
	
	photodiv.appendChild(photoimg);
	uploaddiv.appendChild(photodiv);





	formel.appendChild(formfile);
	formdiv.appendChild(formel);
	formdiv.appendChild(sendbutton);

	uploaddiv.appendChild(formdiv);	
	bodydiv.appendChild(uploaddiv);

	function loadImage(e){
		photoimg.src='';
		photoimg.src=URL.createObjectURL(e.target.files[e.target.files.length-1]);
	}


}
function afterUpload(){

	callWritingInDiv('bodydiv');
}
function sendFile(pid){
	var formel=document.getElementById('formfile');
	var formData=new FormData();
	var formfile=formel.files[0];
	
	formData.append(pid,formfile);
	var xhr = new XMLHttpRequest();
	xhr.open('post','/qprbupload',true);
	xhr.send(formData);

	xhr.addEventListener('load',afterUpload);
}

qprbsocket.on('qprbsendprbuploadresult',function(a){
	uploadFile('bodydiv',a.prbid);	
});
function sendPrb(pinfo,prbtextr,opt){
	var prbtext="`"+prbtextr+"`";

	if(!pinfo){// new prb registered
		if(opt==0){ // No upload
			qprbsocket.emit('qprbsendprbcontents',{prbtext:prbtext,option:'create'})
			if(nextaction==0){
			//	upsideDown('previewdiv','textareadiv');
				callWritingInDiv('bodydiv');
				//document.getElementById('previewdiv').remove();
				laststat=0;
				//alert('problem is registered. Build another problem');
				tempAlert('Problem Registered',1000)
			}else if(nextaction==1){
				removeallele('bodydiv')
				alert('problem is registered');
			}
		}else{ //Upload
			qprbsocket.emit('qprbsendprbupload',{prbtext:prbtext,option:'create'})
			laststat=0;
		}


	}else{
		qprbsocket.emit('qprbsendprbcontents',{prbtext:prbtext,option:'update',prbid:pinfo[0]})
		editfunc=0;	
		previewUp=0;
		document.getElementById('editbodydiv').remove();
		document.onkeydown='';
		tempAlert('Problem Edited',1000)

	}
}

function upsideDown(currup,currdown){
	var currdowndiv=document.getElementById(currdown);
	var currupdiv=document.getElementById(currup);
	currdowndiv.style.display='block';
	currupdiv.style.display='none';
}

var nextaction=0;

function insertAtCursor(myField, myValue, mn) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
	const n=myField.value.substring(0,startPos).length+myValue.length;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
	setCaretToPos(myField,n-mn)
    } else {
        myField.value += myValue;
	console.log(myField.value, myValue);
    }
}
function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos (input, pos) {
   setSelectionRange(input, pos, pos);
}

/*
document.onkeydown = function(e){
	if(e.shiftKey && e.which==53 && !e.ctrlKey){
	}else if(e.ctrlKey && e.which==32 && !e.shiftKey){
		var el=document.getElementById('textareael');
		insertAtCursor(el,'\\(\\)',2);
	}else if(e.ctrlKey && e.shiftKey && e.which!=32){
		var el=document.getElementById('textareael');
		insertAtCursor(el,'\\[\\]',2);
	}else if(e.shiftKey && e.which==54){
		var el=document.getElementById('textareael');
		e.preventDefault();
		insertAtCursor(el,'^{}',1);
	}else if(e.shiftKey && e.which==70){
		var el=document.getElementById('textareael');
		e.preventDefault();
		insertAtCursor(el,'\\frac{}{}',1);

	}
}*/				

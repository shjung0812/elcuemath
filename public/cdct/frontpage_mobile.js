
document.getElementsByClassName('navibar')[0].style.display='none';
window.onscroll=function(){navifunc()};
function navifunc(){
	var scroll=document.body.scrollTop;
		
		if(scroll>130){
			document.getElementsByClassName('navibar')[0].style.display='block';
		}else{
			document.getElementsByClassName('navibar')[0].style.display='none';
		}
}
function loginPanel(){
	document.getElementById('loginOverlay').style.display='block';
	
}
function CloseloginPanel(){
	document.getElementById('loginOverlay').style.display='none';
	
}

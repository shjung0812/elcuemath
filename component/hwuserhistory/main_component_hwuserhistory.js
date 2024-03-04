import {
    callr1listofRound,
    callr2briefstructure,
} from "/component/hwuserhistory/pickingSubject_component_hwuserhistory.js"
import {resultDisplay} from "/controller/hwuserhistory_controller/hwuserhistory_resultDisplay_controller.js"
import {controlButtonNext,switchModeButton} from "/component/hwuserhistory/controlButton_component_hwuserhistory.js"
import {simplifiedModeDecision} from "/controller/hwuserhistory_controller/hwuserhistory_simplifiedModeDecision_controller.js"

simplifiedModeDecision()
// switchModeButton()
controlButtonNext()


function setExtreme(){
    var rounddisplay = Number(document.getElementById('rounddisplay').innerHTML)
    if(rounddisplay!=0){
        document.getElementById('rounddisplay').innerHTML=0;
        
    }else{
        document.getElementById('rounddisplay').innerHTML=-19;
    }
}
function checkR1IncludeList(prbid,cptset){
    console.log(prbid);
    var includeList=[];
    for(var ia=0; ia<cptset.length; ia++){
        for(ik=0; ik<cptset[ia].r1list.length; ik++){
            var plist=cptset[ia].r1list[ik][2].split(',');
            var chk=0; 
            for(var ib=0; ib<plist.length; ib++){
                if(plist[ib]==prbid){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                includeList.push((ia+1)+'# '+cptset[ia].r2listinfo+' #'+(ik+1)+'# '+cptset[ia].r1list[ik][1])
            }

        }
    }

    var msg=''
    for(var ic=0; ic<includeList.length; ic++){
        msg=msg+includeList[ic]+'<br>';
    }
    tempAlert(msg,3000,['purple','white']);				
    
}


function tempAlert(msg,duration,color){
    var el = document.createElement("div");
    el.setAttribute("style","position:absolute;z-index:20;top:3%;left:3%;background-color:"+color[0]+";padding:2% 4%;color:"+color[1]+";");
    el.innerHTML = msg;
    setTimeout(function(){
        el.parentNode.removeChild(el);
    },duration);
    document.body.appendChild(el);
}


//document.getElementById('divisiondisplay').innerHTML=divinum;
document.getElementById('divisiondisplay').innerHTML=0;
document.onkeydown = function(e){
    if(e.shiftKey && e.which==70){
        switchFolding();
    }
}


RDpanel();
function RDpanel(){
    var container2=document.getElementById('container2');
    var timearr=[1,2,3,4,5,6,7,8,14,30,60,90,150,210,330,450,790,10000];

    var diviN=Math.ceil(timearr.length/2);
    
    for(var ia=0; ia<timearr.length; ia++){
        var fdiv=document.createElement('div');
        fdiv.id='bf'+ia;
        fdiv.className='beforetime';
        fdiv.innerHTML=timearr[ia];
        fdiv.onclick=function(i){
            return function(){	
                beforetime=timearr[i];
                
                if(intervalkind==0){
                    
                    resultDisplay(timearr[i]);
                }else{
                    intervalResultDisplay('current')
                }

                beforetimeColor("bf"+i);

            }
        }(ia);

        container2.appendChild(fdiv);
        fdiv.style.width=Math.floor(100/diviN)+'%';
    }
    
    
    document.getElementById('bf0').click();

}

//let inspectid=null;
function rdInspecting(){
    //if(inspectid==null){
        var count=0;
        inspectid=setInterval(function(){
            var drawerlist=document.getElementsByClassName('beforetime');
            drawerlist[count%drawerlist.length].click();
            count++;

            if(count==drawerlist.length){
                clearInterval(inspectid);
                //inspectid=null;
            }
        
        },300)
    //}else{
        //clearInterval(inspectid);
        //inspectid=null;
    }
//}

function userColorset(username){
    var colordiv=document.getElementsByClassName('usercolorset');
    for(var ia=0; ia<colordiv.length; ia++){
        colordiv[ia].style.backgroundColor='';
        colordiv[ia].style.color='';
    }

    if(document.getElementById('chosen'+username)){
        document.getElementById('chosen'+username).style.backgroundColor='blue';
        document.getElementById('chosen'+username).style.color='white';
    }
    
}


function beforetimeColor(bfid){
    var colordiv=document.getElementsByClassName('beforetime');
    for(var ia=0; ia<colordiv.length; ia++){
        colordiv[ia].style.backgroundColor='';
        colordiv[ia].style.color='black';
    }
    document.getElementById(bfid).style.backgroundColor='yellow';
    document.getElementById(bfid).style.color='black';
    
}


var optionpanelfolding=0;
function switchFolding(){
    var callingoptionpaneldiv=document.getElementById('prbdisplay');
    if(optionpanelfolding==0){
        callingoptionpaneldiv.style.width=60+'%';
        callingoptionpaneldiv.style.zIndex=7;
        optionpanelfolding=1;
    }else if(optionpanelfolding==1){
        callingoptionpaneldiv.style.width=1+'%';
        callingoptionpaneldiv.style.zIndex=6;
        optionpanelfolding=0;
    }
}	


function callStdlist(){
    socket.emit('callstdlist',{username:userinfo.username});
}
callStdlist();

socket.on('callstdlistafter',function(a){
    var indstd=[];
    for(var ia=0; ia<a.a.length; ia++){
        var chk=0;
        for(var ib=0; ib<indstd.length; ib++){
            if(indstd[ib][0]==a.a[ia].username){
                chk=1;
                break;
            }
        }
        if(chk==0){
            indstd.push([a.a[ia].username,a.a[ia].DisplayName]);
        }
    }
    
    var stdlistdiv=document.getElementById('stdlistdiv');
    for(var ia=0; ia<indstd.length; ia++){
        var fdiv=document.createElement('div');
        fdiv.className='usercolorset';
        fdiv.id='chosen'+indstd[ia][0];
        fdiv.onclick=function(i){
            return function(){
                username=i
                userColorset(i);
                if(intervalkind==0){
                    resultDisplay(beforetime);
                }else{
                    intervalResultDisplay('current')
                }
            }
        }(indstd[ia][0]);
        var fdiva=document.createElement('a');
        fdiva.innerHTML=indstd[ia][1];
        fdiv.appendChild(fdiva);
        stdlistdiv.appendChild(fdiv);
    }
});


socket.on('showuserdataresultafter',function(a){

    var indprbww=[];
    for(var ia=0; ia<a.wwpic.length; ia++){
        var chk=0;
        for(var ib=0; ib<indprbww.length; ib++){
            if(indprbww[ib]==a.wwpic[ia].prbid){
                chk=1;
                break;
            }
        }
        if(chk==0){
            indprbww.push(a.wwpic[ia].prbid)
        }
    }


    var prbpic=[];
    for(var ia=0; ia<indprbww.length; ia++){
        prbpic[ia]={prbid:indprbww[ia],pic:[]}
        for(var ib=0;ib<a.wwpic.length; ib++){
            if(a.wwpic[ib].prbid==indprbww[ia]){
                prbpic[ia].pic.push([a.wwpic[ib].mpicid,a.wwpic[ib].ansresult,a.wwpic[ib].createdate]);
            }
        }
    }
    // '/usernote/wrsswritingpic/'+a.wrsspic...	



    var indprbhw=[];
    
    for(var ia=0; ia<a.hw.length; ia++){
        var chk=0;
        for(var ib=0; ib<indprbhw.length; ib++){
            if(indprbhw[ib]==a.hw[ia].prbid){
                chk=1;
                break;
            }
        }
        if(chk==0){
            indprbhw.push(a.hw[ia].prbid)
        }
    }

    var hwprbpic=[];
    for(var ia=0; ia<indprbhw.length; ia++){
        hwprbpic[ia]={prbid:indprbhw[ia],pic:[],createdate:[],evalresult:[],timepassed:[]}
        for(var ib=0;ib<a.hw.length; ib++){
            if(a.hw[ib].prbid==indprbhw[ia]){
                hwprbpic[ia].pic.push(a.hw[ib].mpicid);
                hwprbpic[ia].createdate.push(a.hw[ib].createdate);
                hwprbpic[ia].evalresult.push(a.hw[ib].ratingdetail);
                hwprbpic[ia].timepassed.push(a.hw[ib].timepassed);
            }
        }
    }



    var indprbgl=[];
    
    for(var ia=0; ia<a.glpic.length; ia++){
        var chk=0;
        for(var ib=0; ib<indprbgl.length; ib++){
            if(indprbgl[ib]==a.glpic[ia].prbid){
                chk=1;
                break;
            }
        }
        if(chk==0){
            indprbgl.push(a.glpic[ia].prbid)
        }
    }


    var glprbpic=[];
    for(var ia=0; ia<indprbgl.length; ia++){
        glprbpic[ia]={prbid:indprbgl[ia],pic:[],ans:[],createdate:[]}
        for(var ib=0;ib<a.glpic.length; ib++){
            if(a.glpic[ib].prbid==indprbgl[ia]){
                glprbpic[ia].pic.push(a.glpic[ib].mpicid);
                glprbpic[ia].ans.push(a.glpic[ib].ans);
                glprbpic[ia].createdate.push(a.glpic[ib].createdate);
            }
        }
    }


    var r2listdiv=document.getElementsByClassName('r2listinfodiv');
    for(var ia=0; ia<r2listdiv.length; ia++){	
        var prblist=r2listdiv[ia].getAttribute('data-prblist').split(',');
            
        var wrnum=0;
        for(var ib=0; ib<prblist.length; ib++){
            var chk=0;
            for(var ic=0; ic<prbpic.length; ic++){
                if(prbpic[ic].prbid==prblist[ib]){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                wrnum+=1;
            }
        }

        if(wrnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML=wrnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML='';

        }


        var hwnum=0;
        for(var ib=0; ib<prblist.length; ib++){
            for(var ic=0; ic<hwprbpic.length; ic++){
                if(hwprbpic[ic].prbid==prblist[ib]){
                    hwnum+=1;
                }
            }
        }
        if(hwnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML=hwnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML='';

        }

        var insnum=0;
        var addedprb=[];
        for(var ib=0; ib<prblist.length; ib++){
            var chk=0;
            for(var ic=0; ic<a.instruct.length; ic++){
                if(a.instruct[ic].prbid==prblist[ib]){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                var chk2=0;
                for(var id=0; id<addedprb.length; id++){
                    if(prblist[ib]==addedprb[id]){
                        chk2=1;
                        break;
                    }
                }
                if(chk2==0){
                    insnum+=1;
                    
                    addedprb.push(prblist[ib]);
                }
            }
        }
        if(insnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML=insnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML='';

        }

        var glnum=0;
        for(var ib=0; ib<prblist.length; ib++){
            var chk=0;
            for(var ic=0; ic<glprbpic.length; ic++){
                if(glprbpic[ic].prbid==prblist[ib]){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                glnum+=1;
            }
        }
        if(glnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML=glnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML='';

        }
        
    }



    var r2listdiv=document.getElementsByClassName('r2briefdiv');
    for(var ia=0; ia<r2listdiv.length; ia++){	
        var prblist=r2listdiv[ia].getAttribute('data-prblist').split(',');
            
        var wrnum=0;
        for(var ib=0; ib<prblist.length; ib++){
            var chk=0;
            for(var ic=0; ic<prbpic.length; ic++){
                if(prbpic[ic].prbid==prblist[ib]){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                wrnum+=1;
            }
        }

        if(wrnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML=wrnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML='';

        }


        var hwnum=0;
        for(var ib=0; ib<prblist.length; ib++){
            for(var ic=0; ic<hwprbpic.length; ic++){
                if(hwprbpic[ic].prbid==prblist[ib]){
                    hwnum+=1;
                }
            }
        }
        if(hwnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML=hwnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML='';

        }

        var insnum=0;
        var addedprb=[];
        for(var ib=0; ib<prblist.length; ib++){
            var chk=0;
            for(var ic=0; ic<a.instruct.length; ic++){
                if(a.instruct[ic].prbid==prblist[ib]){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                var chk2=0;
                for(var id=0; id<addedprb.length; id++){
                    if(addedprb[id]==prblist[ib]){	
                        chk2=1;
                    }
                }
                if(chk2==0){
                    insnum+=1;
                }
            }
        }
        if(insnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML=insnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML='';

        }

        var glnum=0;
        for(var ib=0; ib<prblist.length; ib++){
            var chk=0;
            for(var ic=0; ic<glprbpic.length; ic++){
                if(glprbpic[ic].prbid==prblist[ib]){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                glnum+=1;
            }
        }
        if(glnum!=0){
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML=glnum;
        }else{
            r2listdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML='';

        }
        
    }



    var r1div=document.getElementsByClassName('r1div');
    for(var ia=0; ia<r1div.length; ia++){
        var prblist=r1div[ia].getAttribute('data-prblist').split(',');
        
        var wrnum=0;
        var wrssresult=[];
        for(var ib=0; ib<prblist.length; ib++){
            //var chk=0;
            for(var ic=0; ic<prbpic.length; ic++){
                if(prbpic[ic].prbid==prblist[ib]){
                    //chk=1;
                    wrssresult.push([prbpic[ic].prbid, prbpic[ic].pic])
                    //break;
                    wrnum+=1;
                }
            }
            //if(chk==1){
                //wrnum+=1;
            //}
        }

        if(wrnum!=0){
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML=wrnum;


            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].onclick=function(){
                return function(){
                }
            }();
        }else{
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML='';
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].onclick=''

        }

        var hwnum=0;
        var hwresult=[];
        for(var ib=0; ib<prblist.length; ib++){
            //var chk=0;
            for(var ic=0; ic<hwprbpic.length; ic++){
                if(hwprbpic[ic].prbid==prblist[ib]){
                    //chk=1;
                    hwresult.push([hwprbpic[ic].prbid,hwprbpic[ic].pic,hwprbpic[ic].createdate,hwprbpic[ic].evalresult,hwprbpic[ic].timepassed])
                    //break;
                    hwnum+=1;
                }
            }
            //if(chk==1){
                //hwnum+=1;
            //}
        }
        if(hwnum!=0){
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML=hwnum;
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].onclick=function(){
                return function(){
                }
            }();
        }else{
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML='';
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].onclick=''

        }

        var insnum=0;
        var instructprb=[];
        var addedprb=[];
        for(var ib=0; ib<prblist.length; ib++){
            var chk=0;
            for(var ic=0; ic<a.instruct.length; ic++){
                if(a.instruct[ic].prbid==prblist[ib]){
                    instructprb.push(a.instruct[ic].prbid);
                    chk=1;
                    break;
                    //insnum+=1;
                }
            }
            if(chk==1){
                var chk2=0;
                for(var id=0; id<addedprb.length; id++){
                    if(addedprb[id]==prblist[ib]){
                        chk2=1;
                    }
                }
                if(chk2==0){
                    insnum+=1;
                }
            }
        }
        if(insnum!=0){
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML=insnum;
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].onclick=function(){
                return function(){
                }
            }();
        }else{
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML='';
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].onclick=''

        }

        var glnum=0;
        var glresult=[];
        for(var ib=0; ib<prblist.length; ib++){
            //var chk=0;
            for(var ic=0; ic<glprbpic.length; ic++){
                if(glprbpic[ic].prbid==prblist[ib]){
                    //chk=1;
                    glresult.push([glprbpic[ic].prbid,glprbpic[ic].pic,glprbpic[ic].ans,glprbpic[ic].createdate])
                    //break;
                    glnum+=1;
                }
            }
            //if(chk==1){
                //hwnum+=1;
            //}
        }
        if(glnum!=0){
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML=glnum;
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].onclick=function(){
                return function(){
                }
            }();
        }else{
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML='';
            r1div[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].onclick=''

        }




        r1div[ia].onclick=function(l,i,j,k,m){
            return function(){
                callcpt1result(l,i,j,k,m);
            }
        }(prblist,wrssresult, hwresult,instructprb,glresult);


        /*
        r1div[ia].onclick=function(i,j,k,l){
            return function(){
                console.log(i,j,k,l)
            }
        }(prblist,a.instruct,prbpic,hwprbpic);*/



    }
    
    userColorset(username);
    setEvenheight('r2listinfodiv');
});


function callcpt1result(prblist,wrsspic, hwpic, instructprb,glpic){
    removeallele('prblist');
    removeallele('solveresult');
    switchFolding();
    socket.emit('hwuserhistoryprbresult',{prblist:prblist,wrsspic:wrsspic,hwpic:hwpic,instructprb:instructprb,glpic:glpic})
}




function intervalResultDisplay(opt){
    //beforetime
    

        intervalkind=1;		
        document.getElementById('divisiondisplay').innerHTML=1;		
        const date=new Date();
        
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let today=year+'-'+month+'-'+day;

        
        

        var timebinlist=[];
        var prvtime=today;
        for(var ia=0; ia<20; ia++){
            
            var timebefore=new Date( (new Date(today).getTime()/1000/60/60/24-beforetime*(ia+1))*1000*60*60*24);

            var bday = timebefore.getDate();
            var bmonth = timebefore.getMonth() + 1;
            var byear = timebefore.getFullYear();
            var btoday=byear+'-'+bmonth+'-'+bday;

            
            timebinlist.push([btoday,prvtime])
            prvtime=btoday;
        }
    var rounddisplay = Number(document.getElementById('rounddisplay').innerHTML);
    var divisiondisplay= Number(document.getElementById('divisiondisplay').innerHTML);

    if(opt=='past'){
        if(rounddisplay*(-1)<timebinlist.length){
            rounddisplay=(1+(-1)*rounddisplay);	
            document.getElementById('rounddisplay').innerHTML=(-1)*rounddisplay
        }else{
            alert('timebinlimit')
        }
    }else if(opt=='recent'){
        if(rounddisplay*(-1) > 0){
            rounddisplay=((-1)*rounddisplay-1);
            document.getElementById('rounddisplay').innerHTML=(-1)*rounddisplay
        }else{
            alert('timebinlimit')
        }
    }else if(opt=='current'){
        rounddisplay=rounddisplay*(-1)
    }
    
    
    console.log('IntervalResultDisplay')
    console.log(timebinlist)
    
    socket.emit('showuserdataresult',{username:username, time:timebinlist[rounddisplay][0],timestart:timebinlist[rounddisplay][1]});
    

}
function intervalkindchange(){
    var divnumel = document.getElementById('divisiondisplay')
    if(Number(divnumel.innerHTML)==0){
        intervalkind=1;
        divnumel.innerHTML=1;
    
    }else{
        intervalkind=0
        divnumel.innerHTML=0;
    }

}
function divisionVariation(){
    var divnumel = document.getElementById('divisiondisplay')
    var cirnum=[3, 6, 10, 15, 25, 40]


    var nnum=0;
    for(var ia=0; ia<cirnum.length; ia++){
        if(Number(divnumel.innerHTML)==cirnum[ia]){
            nnum=cirnum[ia];
            break;
        }
    }

    divnumel.innerHTML=cirnum[(ia+1)%cirnum.length];
}


function removeallele(parentid){
    var parent=document.getElementById(parentid);
    if(parent.firstChild !=null){

        while(parent.firstChild){
            parent.firstChild.remove();
        }
    }
}


socket.on('hwuserhistoryprbresultafter',function(a){


    for(var ia=0; ia<a.prbcon.length; ia++){
        var fdiv=document.createElement('div');

        fdiv.className='prbdisplaydiv'

        if(a.prbcon[ia][8]!=null){
            var mmcpctspicdiv=document.createElement('div');
            mmcpctspicdiv.className='prbpicdiv';
            var mmcpctspic=document.createElement('img');
            mmcpctspic.src=a.prbcon[ia][8];
            mmcpctspicdiv.appendChild(mmcpctspic);
            fdiv.appendChild(mmcpctspicdiv);
        }



        var fdivreaddiv=document.createElement('div');
        var fdivreada=document.createElement('a');
        fdivreada.innerHTML=a.prbcon[ia][1];
        fdivreaddiv.appendChild(fdivreada);


        fdiv.appendChild(fdivreaddiv);

        var fdivmulti=document.createElement('div');

        var fdivmultic1=document.createElement('div');
        var fdivmultic1a=document.createElement('a');
        fdivmultic1a.innerHTML=a.prbcon[ia][4];
        fdivmultic1.appendChild(fdivmultic1a);
        fdivmulti.appendChild(fdivmultic1);

        var fdivmultic2=document.createElement('div');
        var fdivmultic2a=document.createElement('a');
        fdivmultic2a.innerHTML=a.prbcon[ia][5];
        fdivmultic2.appendChild(fdivmultic2a);
        fdivmulti.appendChild(fdivmultic2);

        var fdivmultic3=document.createElement('div');
        var fdivmultic3a=document.createElement('a');
        fdivmultic3a.innerHTML=a.prbcon[ia][6];
        fdivmultic3.appendChild(fdivmultic3a);
        fdivmulti.appendChild(fdivmultic3);

        var fdivmulticans=document.createElement('div');
        var fdivmulticansa=document.createElement('a');
        fdivmulticansa.innerHTML=a.prbcon[ia][2];
        fdivmulticans.appendChild(fdivmulticansa);
        fdivmulti.appendChild(fdivmulticans);

        fdivmulti.onclick=function(i){
            return function(){
                checkR1IncludeList(i,r2list)
            }
        }(a.prbcon[ia][0])
        //function checkR1IncludeList(prbid,cptset){

    
        fdiv.appendChild(fdivmulti);

        var fdivref=document.createElement('div');
        fdivref.className='refdiv';

        var instref=document.createElement('div');
        instref.id='inst'+a.prbcon[ia][0];
        fdivref.appendChild(instref);

        var hwref=document.createElement('div');
        hwref.id='hw'+a.prbcon[ia][0];
        fdivref.appendChild(hwref);

        var wrssref=document.createElement('div');
        wrssref.id='wrss'+a.prbcon[ia][0];
        fdivref.appendChild(wrssref);

        var glref=document.createElement('div');
        glref.id='gl'+a.prbcon[ia][0];
        fdivref.appendChild(glref);



        fdiv.appendChild(fdivref);

        document.getElementById('prblist').appendChild(fdiv);
        
    }



    for(var ia=0; ia<a.instructprb.length; ia++){
        var vdiv=document.getElementById('inst'+a.instructprb[ia]);
        vdiv.style.backgroundColor='#25EDE8';
    }



    function inDisplay(prbid,pickind){
        if(pickind=='wrss'){
            removeallele('wrssresultdiv');
            for(var ia=0; ia<a.wrsspic.length; ia++){
                if(a.wrsspic[ia][0]==prbid){
                    for(var ib=0; ib<a.wrsspic[ia][1].length; ib++){
                        var imgdiv=document.createElement('div');
                        var imgdiva=document.createElement('a');
                        imgdiva.innerHTML=a.wrsspic[ia][1][ib][2];
                        imgdiv.appendChild(imgdiva);

                        var imgel=document.createElement('img');
                        imgel.src='/usernote/wrsswritingpic/'+a.wrsspic[ia][1][ib][0];
                        imgdiv.appendChild(imgel);
                        wrssdiv.appendChild(imgdiv);
                    }
                }
            }
            
        }else if(pickind=='hwpic'){
            removeallele('hwresultdiv');
            var solveobj=[];
            for(var ia=0; ia<a.hwpic.length; ia++){
                if(a.hwpic[ia][0]==prbid){
                    console.log(a.hwpic[ia]);
                    var fdiv=document.createElement('div');
                    fdiv.className='hwprbdiv'
                    hwdiv.appendChild(fdiv);


                    for(var ib=0; ib<a.hwpic[ia][1].length; ib++){
                        solveobj.push({prbid:prbid,solvepic:a.hwpic[ia][1][ib],evalresult:a.hwpic[ia][3][ib]});
                        var imgdiv=document.createElement('div');
                        imgdiv.className='hwprbimgdiv';
                        imgdiv.id='img'+a.hwpic[ia][1][ib];
                        var imgdiva=document.createElement('a');
                        imgdiva.innerHTML=a.hwpic[ia][2][ib]+', '+a.hwpic[ia][4][ib];
                        var imgel=document.createElement('img');
                        imgel.src='/usernote/mmcphomework/'+a.hwpic[ia][1][ib];
                        imgdiv.appendChild(imgel);
                        imgdiv.appendChild(imgdiva);
                        fdiv.appendChild(imgdiv);
                    }
                }
            }
            assignFunc(solveobj,'img',1,userinfo.username,'',username)


        }else if(pickind=='glpic'){
            removeallele('glresultdiv');
            for(var ia=0; ia<a.glpic.length; ia++){
                if(a.glpic[ia][0]==prbid){
                    var fdiv=document.createElement('div');
                    fdiv.className='glprbdiv'

                    for(var ib=0; ib<a.glpic[ia][1].length; ib++){
                        var imgdiv=document.createElement('div');
                        imgdiv.className='glprbimgdiv';
                        var imgdiva=document.createElement('a');
                        imgdiva.innerHTML=a.glpic[ia][3][ib];
                        imgdiv.appendChild(imgdiva);

                        var imgel=document.createElement('img');
                        imgel.src='/usernote/mmcppic/'+a.glpic[ia][1][ib];
                        imgdiv.appendChild(imgel);
                        fdiv.appendChild(imgdiv);
                    }
            
                    var fdivans=document.createElement('div');
                    fdivans.innerHTML=a.glpic[ia][2][0];
                    fdiv.appendChild(fdivans);
                    gldiv.appendChild(fdiv);
                }
            }

        }
    }


    var solveresultdiv=document.getElementById('solveresult');


    var wrssdiv=document.createElement('div');
    wrssdiv.id='wrssresultdiv';
    solveresultdiv.appendChild(wrssdiv);

    for(var ia=0; ia<a.wrsspic.length; ia++){
        var fd=document.getElementById('wrss'+a.wrsspic[ia][0]);
        fd.style.backgroundColor='blue';
        fd.onclick=function(i){
            return function(){
                inDisplay(i,'wrss')
            }
        }(a.wrsspic[ia][0]);
    }


    var hwdiv=document.createElement('div');
    hwdiv.id='hwresultdiv';
    for(var ia=0; ia<a.hwpic.length; ia++){
        var fhw=document.getElementById('hw'+a.hwpic[ia][0])
        fhw.style.backgroundColor='red';
        fhw.onclick=function(i){
            return function(){
                inDisplay(i,'hwpic')
            }
        }(a.hwpic[ia][0]);

    }

    //var solveresultdiv=document.getElementById('solveresult');
    solveresultdiv.appendChild(hwdiv);


    var gldiv=document.createElement('div');
    gldiv.id='glresultdiv';
    for(var ia=0; ia<a.glpic.length; ia++){
    
        var fgl=document.getElementById('gl'+a.glpic[ia][0])
        fgl.style.backgroundColor='yellow';
        fgl.onclick=function(i){
            return function(){
                inDisplay(i,'glpic')
            }
        }(a.glpic[ia][0]);

    }

    //var solveresultdiv=document.getElementById('solveresult');
    solveresultdiv.appendChild(gldiv);



    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('prbdisplay')]);
});





callr2briefstructure();
callr1listofRound(0,divinum);

function setEvenheight(csname){
    var maxv=0;
    var cs=document.getElementsByClassName(csname);
    for(var ia=0; ia<cs.length; ia++){
        if(maxv < cs[ia].clientHeight){
            maxv=cs[ia].clientHeight;
        }
    }

    for(var ia=0; ia<cs.length; ia++){
        cs[ia].style.height=maxv+'px';
    }


}

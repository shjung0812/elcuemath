import {resultDisplay} from "/controller/hwuserhistory_controller/hwuserhistory_resultDisplay_controller.js"
import {removeAllEleByParentId} from "/model/utils/functions/removeThings.js"

export const callr1listofRound = (trround,div)=>{
    // div is integer, trround is integer

    
    var r2leng = Math.floor(r2list.length/div)+1;
    if(trround==-1){
        roundnum=r2leng-1;
    }else{
        roundnum=trround%r2leng;
    }
    //document.getElementById('rounddisplay').innerHTML=round;



    var r2listdiv=document.getElementById('r2listdiv');
    for(var ia=roundnum*div; ia<roundnum*div+div; ia++){
        if(ia<r2list.length){
            var fdiv=document.createElement('div');

            fdiv.style.width=(98/div)+'%';
            fdiv.className='r2list';

            var r2listinfodiv=document.createElement('div');
            r2listinfodiv.className='r2listinfodiv';

            var listinfodiv=document.createElement('div');
            listinfodiv.className='listinfodiv';
            const listinfodiva=document.createElement('a');
            var charinfo=r2list[ia].r2listinfo.split('#');
            if(charinfo.length==2 && charinfo[0]=='w'){
                r2listinfodiv.style.backgroundColor='#A4BB39';
                listinfodiva.innerHTML='['+(ia+1)+'] '+charinfo[1];
            }else if(charinfo.length==2 && charinfo[0]=='s'){
                r2listinfodiv.style.backgroundColor='#EC5113';
                listinfodiva.innerHTML='['+(ia+1)+'] '+charinfo[1];
            }else {
                listinfodiva.innerHTML='['+(ia+1)+'] '+r2list[ia].r2listinfo;
            }


            listinfodiv.appendChild(listinfodiva);

            var r2resultDisplay=document.createElement('div');
            r2resultDisplay.className='r2resultdisplay'
            r2resultDisplay.id='rd'+r2list[ia].r2id

            var r2rddiv1=document.createElement('div');
            var r2rddiv2=document.createElement('div');
            var r2rddiv3=document.createElement('div');
            var r2rddiv4=document.createElement('div');

            r2rddiv1.className='wrsscount';
            r2rddiv2.className='hwcount';
            r2rddiv3.className='inscount';
            r2rddiv4.className='glcount';

            r2resultDisplay.appendChild(r2rddiv1);
            r2resultDisplay.appendChild(r2rddiv2);
            r2resultDisplay.appendChild(r2rddiv3);
            r2resultDisplay.appendChild(r2rddiv4);


            var r2prblist='';
            for(var ib=0; ib<r2list[ia].r1list.length; ib++){
                if(ib==0){
                    r2prblist=r2list[ia].r1list[ib][2];
                }else{
                    r2prblist=r2prblist+','+r2list[ia].r1list[ib][2];
                }
            }

            r2listinfodiv.setAttribute('data-prblist',r2prblist)


            r2listinfodiv.appendChild(listinfodiv);
            r2listinfodiv.appendChild(r2resultDisplay);

            fdiv.appendChild(r2listinfodiv);


            var r1containerdiv=document.createElement('div');
            r1containerdiv.className='r1containerdiv';

            for(var ib=0; ib<r2list[ia].r1list.length; ib++){
                var r1div=document.createElement('div');
                r1div.className='r1div';
                r1div.id=r2list[ia].r1list[ib][0];
                r1div.setAttribute('data-prblist',r2list[ia].r1list[ib][2]);
                r1div.onclick=function(i){
                    return function(){
                        switchFolding();
                        //socket.emit('vdrgcallleadfilterprblist',{plist:i})
                    }
                }(r2list[ia].r1list[ib][2]);

                var r1divadiv=document.createElement('div');
                r1divadiv.className='r1divadiv';
                var r1diva=document.createElement('a');
                if(r2list[ia].r1list[ib][2]!=''){
                    r1diva.innerHTML=r2list[ia].r1list[ib][1]+'<a style="font-size:.8em">('+r2list[ia].r1list[ib][2].split(',').length+')</a>';
                }else{
                    r1diva.innerHTML=r2list[ia].r1list[ib][1]+'<a style="font-size:.5em">('+0+')</a>';
                }
                r1divadiv.appendChild(r1diva);

                var r1divdatadiv=document.createElement('div');
                r1divdatadiv.className='r1divdatadiv';

                var r1divdatadiv0=document.createElement('div');
                r1divdatadiv0.className='wrsscount';
                r1divdatadiv.appendChild(r1divdatadiv0);

                var r1divdatadiv1=document.createElement('div');
                r1divdatadiv1.className='hwcount';
                r1divdatadiv.appendChild(r1divdatadiv1);

                var r1divdatadiv2=document.createElement('div');
                r1divdatadiv2.className='inscount';
                r1divdatadiv.appendChild(r1divdatadiv2);

                var r1divdatadiv3=document.createElement('div');
                r1divdatadiv3.className='glcount';
                r1divdatadiv.appendChild(r1divdatadiv3);



                r1div.appendChild(r1divadiv);
                r1div.appendChild(r1divdatadiv);

                r1containerdiv.appendChild(r1div);
            }

            fdiv.appendChild(r1containerdiv);


            r2listdiv.appendChild(fdiv);
        }
    }
    //setEvenheight('r2listinfodiv');

    if(typeof MathJax !== 'undefined'){
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,r2listdiv]);
    }



    if(intervalkind==0){
        resultDisplay(beforetime);	
    }else{
        intervalResultDisplay('current')
    }

}

export const callr2briefstructure = ()=>{
    var r2listdivbrief=document.getElementById('r2listdivbrief');

    for(var ia=0; ia<r2list.length; ia++){
        var r2listinfodiv=document.createElement('div');
        r2listinfodiv.className='r2briefdiv';
        r2listinfodiv.onclick=function(i){
            return function(){
                removeAllEleByParentId('r2listdiv');
                var displaynum=Math.floor(i/divinum);
                callr1listofRound(displaynum,divinum)
            }
        }(ia);					

        var listinfodiv=document.createElement('div');
        listinfodiv.className='r2brieflistinfodiv'
        const listinfodiva=document.createElement('a');
        var charinfo=r2list[ia].r2listinfo.split('#');
        if(charinfo.length==2 && charinfo[0]=='w'){
            r2listinfodiv.style.backgroundColor='#A4BB39';
            listinfodiva.innerHTML='['+(ia+1)+'] '+charinfo[1];
        }else if(charinfo.length==2 && charinfo[0]=='s'){
            r2listinfodiv.style.backgroundColor='#EC5113';
            listinfodiva.innerHTML='['+(ia+1)+'] '+charinfo[1];
        }else {
            listinfodiva.innerHTML='['+(ia+1)+'] '+r2list[ia].r2listinfo;
        }


        listinfodiv.appendChild(listinfodiva);

        var r2resultDisplay=document.createElement('div');
        r2resultDisplay.className='r2resultdisplaybrief'
        r2resultDisplay.id='rd'+r2list[ia].r2id

        var r2rddiv1=document.createElement('div');
        var r2rddiv2=document.createElement('div');
        var r2rddiv3=document.createElement('div');
        var r2rddiv4=document.createElement('div');

        r2rddiv1.className='wrsscount';
        r2rddiv2.className='hwcount';
        r2rddiv3.className='inscount';
        r2rddiv4.className='glcount';

        r2resultDisplay.appendChild(r2rddiv1);
        r2resultDisplay.appendChild(r2rddiv2);
        r2resultDisplay.appendChild(r2rddiv3);
        r2resultDisplay.appendChild(r2rddiv4);


        var r2prblist='';
        for(var ib=0; ib<r2list[ia].r1list.length; ib++){
            if(ib==0){
                r2prblist=r2list[ia].r1list[ib][2];
            }else{
                r2prblist=r2prblist+','+r2list[ia].r1list[ib][2];
            }
        }

        r2listinfodiv.setAttribute('data-prblist',r2prblist)
        //listinfodiv.appendChild(r2resultDisplay);//r2brieflistinfodiv
        r2listinfodiv.appendChild(listinfodiv);
        r2listinfodiv.appendChild(r2resultDisplay);
        r2listdivbrief.appendChild(r2listinfodiv);
    }

}	


export const callPrvr1 = ()=>{
    removeAllEleByParentId('r2listdiv');

    roundnum-=1;
    callr1listofRound(roundnum,divinum);

}


export const callNextr1 = ()=>{
    removeAllEleByParentId('r2listdiv');
    roundnum+=1;
    callr1listofRound(roundnum,divinum);

}

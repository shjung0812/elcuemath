export const resultDisplay = (t)=>{
    if(username!=''){
        
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
        //var rounddisplay = Number(document.getElementById('rounddisplay').innerHTML)*(-1);
        document.getElementById('rounddisplay').innerHTML=0;
        console.log('resultDisplay'+timebinlist)
        socket.emit('showuserdataresult',{username:username, time:timebinlist[0][0],timestart:today});
        //socket.emit('showuserdataresult',{username:username, time:timebinlist[rounddisplay][0],timestart:timebinlist[rounddisplay][1]});


    }
}
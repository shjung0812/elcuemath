console.log('hihihi')
var stdwidth=1440;
var stdfont=14;
var stdpensize=1.5;


var gratio=.61804;
var tmpwidth=window.innerWidth;
var tmpheight=tmpwidth*gratio;



if(tmpheight>window.innerHeight){
    var canvaswidth=window.innerHeight/gratio;
    var widthoriented=0;
}else{
    var canvaswidth=window.innerWidth;
    var widthoriented=1;
}

var apppensize=(canvaswidth/stdwidth);
//var environdefine={background:['#336633',stdpensize*16,'background'],firstpen:['white',stdpensize,'firstpen'],secondpen:['red',stdpensize,'secondpen'],eraser:['',stdpensize*16,'eraser'],layer:{color:'blue',size:stdpensize,code:'layer'},layereraser:['#11a527',stdpensize*16,'layereraser'],tusereraser:['',stdpensize*16,'tusereraser'],tuser:['#4aeef1',stdpensize,'tuser'],picbackcolor:'#bbbbbb'};
var environdefine={background:['#336633',stdpensize*16,'background'],firstpen:['white',stdpensize,'firstpen'],secondpen:['#B43104',stdpensize,'secondpen'],eraser:['',stdpensize*16,'eraser'],layer:{color:'blue',size:stdpensize,code:'layer'},layereraser:['#11a527',stdpensize*16,'layereraser'],tusereraser:['',stdpensize*16,'tusereraser'],tuser:['#4aeef1',stdpensize,'tuser'],picbackcolor:'#bbbbbb'};


//sharedinputdiv
var sharedinputdiv = document.getElementById('sharedinputdiv');
sharedinputdiv.style.width=canvaswidth + 'px';
sharedinputdiv.style.height=canvaswidth*gratio+'px';
sharedinputdiv.style.backgroundColor=environdefine.background[0];


//layerpic
const layerpic=document.getElementById('layerpic');
layerpic.width=canvaswidth;
layerpic.height=gratio*canvaswidth;
layerpic.style.width=canvaswidth+'px';
layerpic.style.height=gratio*canvaswidth+'px';
const lcon=layerpic.getContext('2d')


//tuserpic
const tpic=document.getElementById('tuserpic');
tpic.width=canvaswidth;
tpic.height=gratio*canvaswidth;
tpic.style.width=canvaswidth+'px';
tpic.style.height=gratio*canvaswidth+'px';
const tcon=tpic.getContext('2d');

var indicatepic=document.getElementById('indicatePic');
indicatepic.width=canvaswidth;
indicatepic.height=gratio*canvaswidth;
indicatepic.style.width=canvaswidth+'px';
indicatepic.style.height=canvaswidth*gratio+'px';
const indcon=indicatepic.getContext('2d');



// Not style, Canvas should be changed. 	
const myPics = document.getElementById('myPics');
myPics.width=canvaswidth
myPics.height=gratio*canvaswidth
myPics.style.width=canvaswidth+'px';
myPics.style.height=gratio*canvaswidth+'px';
const context = myPics.getContext('2d');

//Self Drawing 
let isDrawing = false;
let x = 0;
let y = 0;

var stat={color:environdefine.firstpen[0], size:environdefine.firstpen[1],code:environdefine.firstpen[2]};


//The x and y offset of the canvas from the edge of the page
const rect = myPics.getBoundingClientRect();
let isLining=false

//Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener('mousedown',e=>{
    x = e.clientX-rect.left;
    y = e.clientY-rect.top;
    if(typeof chosenusersocketid !=='undefined'){
        socket.emit('mentortomenteedraw',{pos:convertToratio(x,y),mousestat:'down',usersocketid:chosenusersocketid,statoption:stat})
    }
    if(isLining){
        console.log('downdown')

        context.beginPath()

            context.moveTo(x,y)


    }else{
        isDrawing = true;

    }
});

myPics.addEventListener('mousemove',e=>{
    if(isDrawing===true){
        console.log('mousemove')
        drawLine(context,x,y,e.clientX-rect.left, e.clientY-rect.top,stat,0);
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        if(typeof chosenusersocketid !=='undefined'){
            socket.emit('mentortomenteedraw',{pos:convertToratio(x,y),mousestat:'move',usersocketid:chosenusersocketid,statoption:stat})
        }
    }
});

window.addEventListener('mouseup',e => {
    if(isDrawing === true){
        drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top,stat,0);
        x = 0;
        y = 0;
        isDrawing = false;
        if(typeof chosenusersocketid !=='undefined'){
            socket.emit('mentortomenteedraw',{pos:convertToratio(x,y),mousestat:'up',usersocketid:chosenusersocketid,statoption:stat})
        }
    }
    if(isLining){
        console.log('upup')
            const xl = e.clientX - rect.left;
            const yl = e.clientY - rect.top;

            context.lineTo(xl, yl)
            context.stroke()
            context.closePath()

    }
});

function clearLcon(){
    lcon.clearRect(0,0,layerpic.width, layerpic.height)
    //lcon.fillStyle=environdefine.background[0];
    //lcon.fillRect(0,0,layerpic.width, layerpic.height);
    socket.emit('mentortomenteedrawerase',{usersocketid:chosenusersocketid,mode:1});
    //socket.emit('mentortomenteeclearlcon',{pos:convertToratio(x,y),mousestat:'move',username:chosenuser,statoption:stat})
}



var touchX, touchY;
function getTouchPos(e) {
    if (!e)var e = event;
    if(e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            touchX=touch.pageX-touch.target.offsetLeft;
            touchY=touch.pageY-touch.target.offsetTop;
        }
    }
}

function sketchpad_touchStart(){
    getTouchPos();
    x=touchX;
    y=touchY;
    drawLine(context, x, y, touchX, touchY,stat,0);
    //socket.emit('mentortomenteedraw',{pos:convertToratio(x,y),mousestat:'down',username:chosenusername,statoption:stat})
    if(typeof chosenusersocketid !=='undefined'){
        socket.emit('mentortomenteedraw',{pos:convertToratio(x,y),mousestat:'down',usersocketid:chosenusersocketid,statoption:stat})
    }
    event.preventDefault();	
}

function sketchpad_touchMove(e){
    getTouchPos(e);
    if(!isLining){
        drawLine(context, x, y, touchX, touchY,stat,0);

    }

    if(stat.code=='eraser'){
        indcon.strokeStyle='#000000';
        indcon.beginPath();
        indcon.arc(x,y,10,0,2*Math.PI,true)
        indcon.closePath();
        indcon.stroke();
        indcon.fill();
    }


    x=touchX;
    y=touchY;
    //socket.emit('mentortomenteedraw',{pos:convertToratio(x,y),mousestat:'move',username:chosenusername,statoption:stat})
    if(typeof chosenusersocketid !=='undefined'){
        socket.emit('mentortomenteedraw',{pos:convertToratio(x,y),mousestat:'move',usersocketid:chosenusersocketid,statoption:stat})
    }
    event.preventDefault();	
}


function sketchpad_touchEnd(){
    if(stat.code=='eraser'){
        setTimeout(function(){
            indcon.clearRect(0,0,indicatepic.width,indicatepic.height)
        },100);
    }

}

myPics.addEventListener('touchstart',sketchpad_touchStart, false);
myPics.addEventListener('touchmove',sketchpad_touchMove,false);
myPics.addEventListener('touchend',sketchpad_touchEnd,false);



var pointerdown=0;
var maxstdpensize=stdpensize*5;
var beginningoffset=0.6;
myPics.addEventListener('pointerup', function(e) {
    pointerdown=0;
    if(stat.code=='eraser'|| stat.code=='tusereraswer' || environdefine.layereraser[2]){
        setTimeout(function(){
            indcon.clearRect(0,0,indicatepic.width,indicatepic.height)
        },100);
    }
    if(isLining){
        console.log('pendowninisLining')
        x = e.clientX-rect.left;
        y = e.clientY-rect.top;
        context.lineTo(x, y);

        context.stroke();
        context.closePath();


    }


}, false);

myPics.addEventListener('pointerdown', function(e) {
    if(e.pointerType=='pen'){
        if(isLining){	
            pointerdown=0
            console.log('pointerDown')			
            x = e.clientX-rect.left;
            y = e.clientY-rect.top;
            context.beginPath()
            context.moveTo(x,y)

        }else{
            pointerdown=1;

            if(stat.code!='eraser' && stat.code!='tusereraser' && stat.code!=environdefine.layereraser[2]){
                if(stat.size>(stdpensize+maxstdpensize)){
                    }else{
                        stat.size=stdpensize*beginningoffset+maxstdpensize*e.pressure;
                    }

                }else{
                    stat.size=stdpensize*16
                }
        }


    }else{
        if(stat.code!='eraser' && stat.code!='tusereraser' && stat.code!=environdefine.layereraser[2]){
            stat.size=stdpensize;
        }else{
            stat.size=stdpensize*16
        }

    }
}, false);
myPics.addEventListener('pointermove', function(e) {
    if(pointerdown==1){
        console.log('pointermov')
        console.log(pointerdown)
        if(e.pointerType=='pen'){
            if(stat.code!='eraser' && stat.code!='tusereraser' && stat.code!=environdefine.layereraser[2]){

                if(stat.size>(stdpensize+maxstdpensize)){
                }else{
                    stat.size=stdpensize*beginningoffset+maxstdpensize*e.pressure;
                }
            }else{
                //if(stat.code=='eraser'){
                    indcon.strokeStyle='#000000';
                    indcon.beginPath();
                    indcon.arc(x,y,10,0,2*Math.PI,true)
                    indcon.closePath();
                    indcon.stroke();
                    indcon.fill();
                //}




            }
        }else{
        }

    }
}, false);


function drawLine(context,x1, y1, x2, y2,vstat,mode){
    if(mode==0){//user
        if(stat.code=='layer'){
            lcon.beginPath();
            lcon.globalCompositeOperation='source-over';
            lcon.strokeStyle = stat.color;
            lcon.lineWidth = apppensize*stat.size;
            lcon.lineCap = 'round';
            lcon.lineJoin='round';
            lcon.moveTo(x1, y1);
            lcon.lineTo(x2, y2);
            lcon.stroke();
            lcon.closePath();
        }else if(stat.code=='eraser'){ 
            context.beginPath();
            context.globalCompositeOperation='destination-out';
            context.lineWidth=apppensize*stat.size;
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineJoin='round';
            context.lineCap='round';
            context.stroke();
            context.closePath();

        }else if(stat.code=='layereraser'){ 
            lcon.beginPath();
            lcon.globalCompositeOperation='destination-out';
            lcon.strokeStyle = stat.color;
            lcon.lineWidth = apppensize*stat.size;
            lcon.lineCap = 'round';
            lcon.lineJoin='round';
            lcon.moveTo(x1, y1);
            lcon.lineTo(x2, y2);
            lcon.stroke();
            lcon.closePath();

        }else if(stat.code=='tusereraser'){ 
            tcon.beginPath();
            tcon.globalCompositeOperation='destination-out';	
            tcon.lineWidth=apppensize*stat.size;
            tcon.lineCap='round';
            tcon.moveTo(x1,y1);
            tcon.lineTo(x2,y2);
            tcon.stroke();
            tcon.closePath();

        }else{ 
            context.beginPath();
            context.globalCompositeOperation='source-over';
            context.strokeStyle = stat.color;
            context.lineWidth = apppensize*stat.size;
            context.lineCap = 'round';
            context.lineJoin='round';
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
        }
    }else if(mode==1){//tuser
        if(vstat.code=='eraser'){
            tcon.beginPath();
            tcon.globalCompositeOperation='destination-out';	
            tcon.lineWidth=apppensize*vstat.size;
            tcon.lineCap='round';
            tcon.moveTo(x1,y1);
            tcon.lineTo(x2,y2);
            tcon.stroke();
            tcon.closePath();
        }else if(vstat.code=='secondpen'){

            tcon.beginPath();
            tcon.globalCompositeOperation='source-over';
            tcon.strokeStyle = vstat.color
            //tcon.strokeStyle = environdefine.secondpen[0];
            tcon.lineWidth = apppensize*vstat.size;
            tcon.lineCap = 'round';
            tcon.lineJoin='round';
            tcon.moveTo(x1, y1);
            tcon.lineTo(x2, y2);
            tcon.stroke();
            tcon.closePath();

        }else{
            tcon.beginPath();
            tcon.globalCompositeOperation='source-over';
            tcon.strokeStyle = environdefine.tuser[0];
            tcon.lineWidth = apppensize*vstat.size;
            tcon.lineCap = 'round';
            tcon.lineJoin='round';
            tcon.moveTo(x1, y1);
            tcon.lineTo(x2, y2);
            tcon.stroke();
            tcon.closePath();
        }
    }

}

//convert to Ratio;
function convertToratio(rx, ry){
    var canvaswt=rect.right-rect.left;
    var canvashg=rect.bottom-rect.top;
    var nx=rx/canvaswt;
    var ny=ry/canvashg;

    return [nx,ny];
}

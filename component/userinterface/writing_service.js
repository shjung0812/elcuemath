
//Screen Sync Configuration
var stdwidth = 1440;
var stdfont = 14;
var stdpensize = 1.5;

var marginratio = 1;

var tmpwidth = window.innerWidth;
//var tmpwidth=window.screen.width;
var tmpheight = tmpwidth * gratio;



if (tmpheight > window.innerHeight) {
    //if(tmpheight>window.screen.height){
    var canvaswidth = window.innerHeight / gratio;
    //var canvaswidth=window.screen.height/gratio;
    var widthoriented = 0;
} else {
    var canvaswidth = window.innerWidth;
    //var canvaswidth=window.screen.width;
    var widthoriented = 1;
}

var apppensize = (canvaswidth / stdwidth);

var environdefine = { background: ['#336633', stdpensize * 16, 'background'], firstpen: ['white', stdpensize, 'firstpen'], secondpen: ['black', stdpensize, 'secondpen'], eraser: { color: '', size: stdpensize * 16, code: 'eraser' }, tuser: ['#4aeef1', 'stdpensize', 'tuser'], layer: { color: 'blue', size: stdpensize, code: 'layer' }, layereraser: { size: stdpensize * 16, code: 'layereraser' }, picbackcolor: '#bbbbbb' };
//var environdefine={background:['#336633',stdpensize*16,'background'],firstpen:['white',stdpensize,'firstpen'],secondpen:['#B43104',stdpensize,'secondpen'],eraser:{color:'',size:stdpensize*16,code:'eraser'},tuser:['#4aeef1','stdpensize','tuser'],layer:{color:'blue',size:stdpensize,code:'layer'},layereraser:{size:stdpensize*16,code:'layereraser'}, picbackcolor:'#bbbbbb' };

var stat = { color: environdefine.firstpen[0], size: environdefine.firstpen[1], code: environdefine.firstpen[2] };

var notestat = { size: 2, color: 'black' }


//shsaredinputdiv
var sharedinputdiv = document.getElementById('sharedinputdiv');
sharedinputdiv.style.width = canvaswidth + 'px';
sharedinputdiv.style.height = canvaswidth * gratio + 'px';
sharedinputdiv.style.backgroundColor = environdefine.background[0];


//indicate Picture ..for emiticon, let users knows where cursor is. 
// Stop due to the resource problem
var indicatepic = document.getElementById('indicatePic');
indicatepic.width = canvaswidth;
indicatepic.height = gratio * canvaswidth;
indicatepic.style.width = canvaswidth + 'px';
indicatepic.style.height = canvaswidth * gratio + 'px';
const indcon = indicatepic.getContext('2d');

//layerpic
const layerpic = document.getElementById('layerpic');
layerpic.width = canvaswidth;
layerpic.height = gratio * canvaswidth;
layerpic.style.width = canvaswidth + 'px';
layerpic.style.height = gratio * canvaswidth + 'px';
const lcon = layerpic.getContext('2d');

//tuserpic
const tuserpic = document.getElementById('tuserpic');
tuserpic.width = canvaswidth;
tuserpic.height = gratio * canvaswidth;
tuserpic.style.width = canvaswidth + 'px';
tuserpic.style.height = gratio * canvaswidth + 'px';
const tcon = tuserpic.getContext('2d');

const myPics = document.getElementById('myPics');
myPics.width = canvaswidth
myPics.height = gratio * canvaswidth
myPics.style.width = canvaswidth + 'px';
myPics.style.height = gratio * canvaswidth + 'px';
const context = myPics.getContext('2d');


//self
let isDrawing = false;
let x = 0;
let y = 0;


//The x and y offset of the canvas from the edge of the page
var rect = myPics.getBoundingClientRect();

//Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener('mousedown', e => {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    isDrawing = true;
    socket.emit('menteetomentordraw', { pos: convertToratio(x, y), mousestat: 'down', mentorsocketid: mentorinfo.mentorsocketid, username: username })
});

myPics.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top, stat, 0);
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        socket.emit('menteetomentordraw', { pos: convertToratio(x, y), mousestat: 'move', statoption: stat, mentorsocketid: mentorinfo.mentorsocketid, username: username })
    }
});

window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top, stat, 0);
        //x = 0;
        //y = 0;	
        x = null;
        y = null;
        isDrawing = false;
    }
});


//convert to Ratio;
function convertToratio(rx, ry) {
    var canvaswt = rect.right - rect.left;
    var canvashg = rect.bottom - rect.top;
    var nx = rx / canvaswt;
    var ny = ry / canvashg;

    return [nx, ny];
}




function clearLcon() {
    lcon.clearRect(0, 0, layerpic.width, layerpic.height);
}



function drawLine(ctext, x1, y1, x2, y2, vstat, mode) {
    if (mode == 0) {//user
        if (stat.code == 'eraser') {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'destination-out';
            ctext.lineWidth = apppensize * stat.size;
            ctext.lineCap = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();



        } else {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'source-over';
            ctext.strokeStyle = stat.color;
            ctext.lineWidth = apppensize * stat.size;
            ctext.lineCap = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();

        }



    } else if (mode == 1) {//tuser,  have to use vstat instead stat
        if (vstat.code == 'eraser') {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'destination-out';
            ctext.lineWidth = apppensize * vstat.size;
            ctext.lineCap = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();


        } else if (vstat.code == 'layer') {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'source-over';
            ctext.strokeStyle = vstat.color;
            //ctext.strokeStyle = environdefine[vstat.code].color;
            ctext.lineWidth = apppensize * vstat.size;
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.lineJoin = 'round';
            ctext.lineCap = 'round';
            ctext.stroke();
            ctext.closePath();
        } else if (vstat.code == 'layereraser') {
            console.log('tuser layereraser');
            ctext.beginPath();
            ctext.globalCompositeOperation = 'destination-out';
            ctext.strokeStyle = vstat.color;
            ctext.lineWidth = apppensize * vstat.size;
            ctext.lineCap = 'round';
            ctext.lineJoin = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();
        } else if (vstat.code == 'tusereraser') {
            context.beginPath();
            context.globalCompositeOperation = 'destination-out';
            context.lineWidth = apppensize * vstat.size;
            context.lineCap = 'round';
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
        } else if (vstat.code == 'secondpen') {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'source-over';
            ctext.strokeStyle = vstat.color;
            //ctext.strokeStyle = environdefine[vstat.code][0];
            ctext.lineWidth = apppensize * vstat.size;
            ctext.lineCap = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();


        } else {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'source-over';
            ctext.strokeStyle = environdefine.tuser[0];
            //ctext.strokeStyle = environdefine[vstat.code][0];
            ctext.lineWidth = apppensize * vstat.size;
            ctext.lineCap = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();


        }
    } else if (mode == 2) {
        if (stat.code == 'eraser') {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'destination-out';
            ctext.lineWidth = 32;
            ctext.lineWidth = apppensize * stat.size;
            ctext.lineCap = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();

        } else {
            ctext.beginPath();
            ctext.globalCompositeOperation = 'source-over';
            ctext.strokeStyle = notestat.color;
            ctext.lineWidth = notestat.size;
            ctext.lineCap = 'round';
            ctext.moveTo(x1, y1);
            ctext.lineTo(x2, y2);
            ctext.stroke();
            ctext.closePath();

        }


    }

}


//touchCanvas
var touchX, touchY;
function getTouchPos(e) {
    if (!e) var e = event;
    if (e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
}




function sketchpad_touchStart() {
    getTouchPos();
    x = touchX;
    y = touchY;
    drawLine(context, x, y, touchX, touchY, stat, 0);
    socket.emit('menteetomentordraw', { pos: convertToratio(x, y), mousestat: 'down', statoption: stat, mentorsocketid: mentorinfo.mentorsocketid, username: username })
    event.preventDefault();
}

function sketchpad_touchMove(e) {
    getTouchPos(e);

    drawLine(context, x, y, touchX, touchY, stat, 0);


    if (stat.code == 'eraser') {
        //indcon.fillStyle='#4AA5f1';
        //indcon.font='0.7vw Arial';
        //indcon.fillText(String.fromCodePoint(emojis[getRandomInt(0,emojis.length)]),x,y);
        //indcon.fillText('o',x,y);
        indcon.strokeStyle = '#000000';
        indcon.beginPath();
        indcon.arc(x, y, 10, 0, 2 * Math.PI, true)
        indcon.closePath();
        indcon.stroke();
        indcon.fill();
        //setTimeout(function(){
        //indcon.clearRect(0,0,indicatepic.width,indicatepic.height)
        //},1500);


    }



    x = touchX;
    y = touchY;
    socket.emit('menteetomentordraw', { pos: convertToratio(x, y), mousestat: 'move', statoption: stat, mentorsocketid: mentorinfo.mentorsocketid, username: username })
    event.preventDefault();
}

function sketchpad_touchEnd() {
    if (stat.code == 'eraser') {
        setTimeout(function () {
            indcon.clearRect(0, 0, indicatepic.width, indicatepic.height)
        }, 100);
    }

}
myPics.addEventListener('touchstart', sketchpad_touchStart, false);
myPics.addEventListener('touchmove', sketchpad_touchMove, false);
myPics.addEventListener('touchend', sketchpad_touchEnd, false);


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

let emojis = [0x1F600, 0x1F601, 0x1F603, 0x1F603, 0x1F604, 0x1F605, 0x1F606, 0x1F607, 0x1F609, 0x1F60A, 0x1F642, 0x1F643, 0x1F355, 0x1F354];
//copycanvas
var prvx = 0, prvy = 0;
socket.on('copypicsofmentor', function (ma) {

    var cx = ma.pos[0] * (rect.right - rect.left);
    var cy = ma.pos[1] * (rect.bottom - rect.top);

    if (ma.statoption.code == 'layer' || ma.statoption.code == 'layereraser') {
        var can = lcon;
    } else {
        var can = tcon;
        //var can=context;
    }
    if (ma.mousestat === 'move') {
        drawLine(can, prvx, prvy, cx, cy, ma.statoption, 1);
        prvx = cx;
        prvy = cy;
    } else if (ma.mousestat === 'up') {
        prvx = null;
        prvy = null;

    } else if (ma.mousestat === 'down') {
        prvx = cx;
        prvy = cy;


    }
});

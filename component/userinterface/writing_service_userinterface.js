
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
var drawingFigure = { line: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, isLining: false } }

let isDrawing = false;
let x = 0;
let y = 0;


//The x and y offset of the canvas from the edge of the page
var rect = myPics.getBoundingClientRect();

//Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener('mousedown', e => {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    if (!drawingFigure.line.isLining) {

        isDrawing = true;
        socket.emit('menteetomentordraw', { pos: convertToratio(x, y), mousestat: 'down', mentorsocketid: mentorinfo.mentorsocketid, username: username })

    } else {
        isDrawing = false;

        drawingFigure.line.start.x = x
        drawingFigure.line.start.y = y
    }

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
    if (!drawingFigure.line.isLining) {
        if (isDrawing === true) {
            drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top, stat, 0);
            //x = 0;
            //y = 0;	
            x = null;
            y = null;
            isDrawing = false;
        }

    } else {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        drawingFigure.line.end.x = x
        drawingFigure.line.end.y = y
        context.beginPath()
        context.strokeStyle = stat.color;
        context.lineWidth = apppensize * stat.size;
        context.globalCompositeOperation = 'source-over';

        context.moveTo(drawingFigure.line.start.x, drawingFigure.line.start.y)
        context.lineTo(drawingFigure.line.end.x, drawingFigure.line.end.y)
        context.stroke()
        context.closePath()

        socket.emit('menteetomentordrawobject', {
            positionInfo:
            {
                startPosition: convertToratio(drawingFigure.line.start.x, drawingFigure.line.start.y),
                endPosition: convertToratio(drawingFigure.line.end.x, drawingFigure.line.end.y)
            }, drawobjectmode: 'object_line', mentorsocketid: mentorinfo.mentorsocketid, statoption: stat
        })


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


const cursor = document.createElement('div');
cursor.classList.add('circle-cursor');
document.body.appendChild(cursor);

const cursorStart = document.createElement('div');
cursorStart.classList.add('circle-cursor');
document.body.appendChild(cursorStart);


function sketchpad_touchStart(e) {
    getTouchPos(e);
    x = touchX;
    y = touchY;
    if (!drawingFigure.line.isLining) {
        drawLine(context, x, y, touchX, touchY, stat, 0);
        socket.emit('menteetomentordraw', { pos: convertToratio(x, y), mousestat: 'down', statoption: stat, mentorsocketid: mentorinfo.mentorsocketid, username: username })
        event.preventDefault();

    } else {
        drawingFigure.line.start.x = x
        drawingFigure.line.start.y = y

        
        cursorStart.style.display = 'block'
        cursorStart.style.left = drawingFigure.line.start.x
        cursorStart.style.top = drawingFigure.line.start.y
        cursor.style.display = 'block';

    }

}

function sketchpad_touchMove(e) {
    
    getTouchPos(e);

    if (!drawingFigure.line.isLining) {
        

        drawLine(context, x, y, touchX, touchY, stat, 0);


        if (stat.code == 'eraser') {

            indcon.strokeStyle = '#000000';
            indcon.beginPath();
            indcon.arc(x, y, 10, 0, 2 * Math.PI, true)
            indcon.closePath();
            indcon.stroke();
            indcon.fill();


        }

 
        socket.emit('menteetomentordraw', { pos: convertToratio(x, y), mousestat: 'move', statoption: stat, mentorsocketid: mentorinfo.mentorsocketid, username: username })
        event.preventDefault();

    
    } else {
        cursor.style.left = touchX + 'px';
        cursor.style.top = touchY + 'px';
    }
    x = touchX;
    y = touchY;

}

function sketchpad_touchEnd(e) {
    if (stat.code == 'eraser') {
        setTimeout(function () {
            indcon.clearRect(0, 0, indicatepic.width, indicatepic.height)
        }, 100);
    }
    if (drawingFigure.line.isLining) {
        getTouchPos(e);
        console.log('drawingFigure  touch pad')
        console.log(drawingFigure)

        const x = touchX;
        const y = touchY;
        drawingFigure.line.end.x = x
        drawingFigure.line.end.y = y



        context.beginPath()

        context.moveTo(drawingFigure.line.start.x, drawingFigure.line.start.y)
        context.lineTo(drawingFigure.line.end.x, drawingFigure.line.end.y)
        
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalCompositeOperation = 'source-over';
        
        context.strokeStyle = stat.color;
        context.lineWidth = apppensize * stat.size;

        context.stroke()
        context.closePath()

        socket.emit('menteetomentordrawobject', {
            positionInfo:
            {
                startPosition: convertToratio(drawingFigure.line.start.x, drawingFigure.line.start.y),
                endPosition: convertToratio(drawingFigure.line.end.x, drawingFigure.line.end.y)
            }, drawobjectmode: 'object_line', mentorsocketid: mentorinfo.mentorsocketid, statoption: stat
        })

        
        cursor.style.display = 'none';
        cursor.style.left = 0 + 'px';
        cursor.style.top = 0 + 'px';

        cursorStart.style.display = 'none';
        cursorStart.style.left = 0 + 'px';
        cursorStart.style.top = 0 + 'px';

    }

}
myPics.addEventListener('touchstart', sketchpad_touchStart, false);
myPics.addEventListener('touchmove', sketchpad_touchMove, false);
myPics.addEventListener('touchend', sketchpad_touchEnd, false);

// 커서 모양 변경 함수를 정의합니다.
function changeCursor(isChange) {
    if (isChange) {
        // isChange이 true인 경우 다른 커서 모양을 사용합니다.
        canvas.style.cursor = 'default';
    } else {
        // isChange이 false인 경우 원래 커서 모양을 사용합니다.
        canvas.style.cursor = 'url(/cursor/Dot.cur), default';
    }
}



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
socket.on('drawobjecttomentee', function (m) {
    if (m.originvar.drawobjectmode == 'object_line') {
        tcon.beginPath();
        if (m.originvar.statoption.code == 'secondpen') {
            tcon.strokeStyle = m.originvar.statoption.color;

        } else {
            tcon.strokeStyle = environdefine.tuser[0];
        }

        tcon.lineWidth = apppensize * m.originvar.statoption.size;
        tcon.moveTo(m.originvar.positionInfo.startPosition[0] * (rect.right - rect.left), m.originvar.positionInfo.startPosition[1] * (rect.bottom - rect.top))
        tcon.lineTo(m.originvar.positionInfo.endPosition[0] * (rect.right - rect.left), m.originvar.positionInfo.endPosition[1] * (rect.bottom - rect.top))
        tcon.lineCap = 'round';
        tcon.lineJoin = 'round';
        tcon.globalCompositeOperation = 'source-over';


;

        tcon.stroke()
        tcon.closePath()



    }
});

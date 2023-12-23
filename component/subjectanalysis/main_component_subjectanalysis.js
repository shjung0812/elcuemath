
import {
    subjectAnalysisNavigation
} from '/component/subjectanalysis/navigation_component_subjectanalysis.js'
import * as commonFunction from '/model/utils/functions/removeThings.js'
import * as coloringFunction from '/model/utils/functions/coloringThings.js'
import {
    studentUsernameChosenColor,
    resultDisplayTimePeriodColor,
    subjectanalysisR2ChosenColor,
} from '/model/constants/color/chosenColor.js'

if (mode == 'admin') {
    userinfo='';
}
if (mode == 'admin') {
    username = 'songarim1029';
} else {
    commonFunction.removeAllEleByParentId('main');
}
var endsymbol = '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%';

var rdcall = document.getElementById('resultdisplaydatacall');
var periodlist = [1, 3, 7, 15, 30, 60, 90, 120, 180, 360];
for (var ia = 0; ia < periodlist.length; ia++) {
    var fdiv = document.createElement('div');
    fdiv.className = 'rddperiod';
    fdiv.id = 'chosenrdd' + periodlist[ia];
    fdiv.onclick = function (i) {
        return function () {
            periodrd = i;
            coloringFunction.coloringSingleElement({divListCommonClassName:'rddperiod',prefix:'chosenrdd',specificName:i,color:resultDisplayTimePeriodColor})
            resultDisplay(username, i);
        }
    }(periodlist[ia]);
    fdiv.innerHTML = periodlist[ia];
    rdcall.appendChild(fdiv);
}

var r3id = "r3id.jCdf6GgI6C";
var r2change = document.getElementById('r2change');

// Subject List Navigation area
subjectAnalysisNavigation()

cps.sort(function (a, b) {
    return a.instructorder - b.instructorder
});

socket.on('callstdlistafter', function (a) {
    var userlist = document.getElementById('stdlist');
    for (var ia = 0; ia < a.a.length; ia++) {
        var fdiv = document.createElement('div');
        fdiv.innerHTML = a.a[ia].Displayname;
        fdiv.className = 'usercolorset';
        fdiv.id = 'chosen' + a.a[ia].username;
        fdiv.onclick = function (i) {
            return function () {
                username = i;
                resultDisplay(i, periodrd);
                coloringFunction.coloringSingleElement({divListCommonClassName:'usercolorset',prefix:'chosen',specificName:i,color:studentUsernameChosenColor})

            }
        }(a.a[ia].username);
        userlist.appendChild(fdiv);
    }
    coloringFunction.coloringSingleElement({divListCommonClassName:'usercolorset',prefix:'chosen',specificName:username,color:studentUsernameChosenColor})

})
callStdlist();
function colorR2same(cptid) {
    var orderlist = JSON.parse(document.getElementById('activedisplay').getAttribute('data-r2sameorder'));
    var d = document.getElementById('pconadiv' + cptid);
    var r2id = d.getAttribute('data-r2id')
    var r2listinfo = d.getAttribute('data-r2listinfo')
    var sb = document.getElementsByClassName('pconadiv');
    for (var ib = 0; ib < sb.length; ib++) {
        if (sb[ib].getAttribute('data-r2id') == r2id) {
            sb[ib].parentNode.style.backgroundColor = '#06ff51';
        } else {
            sb[ib].parentNode.style.backgroundColor = '';
        }
    }
    tempAlert(r2listinfo, 3000, ['purple', 'white']);
}
function tempAlert(msg, duration, color) {
    var el = document.createElement("div");
    el.setAttribute("style", "position:absolute;z-index:20;top:3%;left:3%;background-color:" + color[0] + ";padding:2% 4%;color:" + color[1] + ";");
    el.innerHTML = msg;
    setTimeout(function () {
        el.parentNode.removeChild(el);
    }, duration);
    document.body.appendChild(el);
}
function checkWhichR2included(cptid, cptset) {
    var includeList = [];
    for (var ia = 0; ia < cptset.length; ia++) {
        //if(r3id==cptset[ia].parent){
        if (cptset[ia].cptid == cptid) {
            includeList.push((cptset[ia].r2order + 1) + '# ' + cptset[ia].r2listinfo + ' #' + (cptset[ia].r1order + 1) + '# ' + cptset[ia].listinfo)
        }
        //}
    }
    var msg = ''
    for (var ic = 0; ic < includeList.length; ic++) {
        msg = msg + includeList[ic] + '<br>';
    }
    tempAlert(msg, 3000, ['purple', 'white']);
}
function resultDisplay(uname, t) {
    if (uname) {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let today = year + '-' + month + '-' + day;
        let timebefore = new Date((new Date(today).getTime() / 1000 / 60 / 60 / 24 - t) * 1000 * 60 * 60 * 24);
        let bday = timebefore.getDate();
        let bmonth = timebefore.getMonth() + 1;
        let byear = timebefore.getFullYear();
        let btoday = byear + '-' + bmonth + '-' + bday;
        socket.emit('showuserdataresult', { username: uname, time: btoday, timestart: today });
    }
}
//resultDisplay(username,10);
socket.on('showuserdataresultafter', function (a) {
    var rankcallbutton = document.getElementById('activedisplay');
    var indprbstring = '';
    var indprbww = [];
    for (var ia = 0; ia < a.wwpic.length; ia++) {
        var chk = 0;
        for (var ib = 0; ib < indprbww.length; ib++) {
            if (indprbww[ib] == a.wwpic[ia].prbid) {
                chk = 1;
                break;
            }
        }
        if (chk == 0) {
            indprbww.push(a.wwpic[ia].prbid)
        }
    }
    var prbpic = [];
    for (var ia = 0; ia < indprbww.length; ia++) {
        prbpic[ia] = { prbid: indprbww[ia], pic: [] }
        for (var ib = 0; ib < a.wwpic.length; ib++) {
            if (a.wwpic[ib].prbid == indprbww[ia]) {
                prbpic[ia].pic.push([a.wwpic[ib].mpicid, a.wwpic[ib].ansresult, a.wwpic[ib].createdate]);
            }
        }
    }
    // '/usernote/wrsswritingpic/'+a.wrsspic...	
    var indprbhw = [];
    for (var ia = 0; ia < a.hw.length; ia++) {
        var chk = 0;
        for (var ib = 0; ib < indprbhw.length; ib++) {
            if (indprbhw[ib] == a.hw[ia].prbid) {
                chk = 1;
                break;
            }
        }
        if (chk == 0) {
            indprbhw.push(a.hw[ia].prbid)
        }
    }
    var hwprbpic = [];
    for (var ia = 0; ia < indprbhw.length; ia++) {
        hwprbpic[ia] = { prbid: indprbhw[ia], pic: [] }
        for (var ib = 0; ib < a.hw.length; ib++) {
            if (a.hw[ib].prbid == indprbhw[ia]) {
                hwprbpic[ia].pic.push([a.hw[ib].mpicid, a.hw[ib].createdate, a.hw[ib].ratingdetail, a.hw[ib].timepassed]);
            }
        }
    }
    var indprbgl = [];
    for (var ia = 0; ia < a.glpic.length; ia++) {
        var chk = 0;
        for (var ib = 0; ib < indprbgl.length; ib++) {
            if (indprbgl[ib] == a.glpic[ia].prbid) {
                chk = 1;
                break;
            }
        }
        if (chk == 0) {
            indprbgl.push(a.glpic[ia].prbid)
        }
    }
    var glprbpic = [];
    for (var ia = 0; ia < indprbgl.length; ia++) {
        glprbpic[ia] = { prbid: indprbgl[ia], pic: [], ans: [], createdate: [], timepassed: [] }
        for (var ib = 0; ib < a.glpic.length; ib++) {
            if (a.glpic[ib].prbid == indprbgl[ia]) {
                glprbpic[ia].pic.push(a.glpic[ib].mpicid);
                glprbpic[ia].ans.push(a.glpic[ib].ans);
                glprbpic[ia].createdate.push(a.glpic[ib].createdate);
                glprbpic[ia].timepassed.push(a.glpic[ib].timepassed);
            }
        }
    }
    rankcallbutton.setAttribute('data-wrssprbpic', JSON.stringify(prbpic));
    rankcallbutton.setAttribute('data-hwprbpic', JSON.stringify(hwprbpic));
    rankcallbutton.setAttribute('data-instruct', JSON.stringify(a.instruct));
    rankcallbutton.setAttribute('data-glprbpic', JSON.stringify(glprbpic));
    var subjectbox = document.getElementsByClassName('subjectbox');
    for (var ia = 0; ia < subjectbox.length; ia++) {
        var prblist = subjectbox[ia].getAttribute('data-prblist').split(',');
        var wrnum = 0;
        var wrssresult = [];
        for (var ib = 0; ib < prblist.length; ib++) {
            var chk = 0;
            for (var ic = 0; ic < prbpic.length; ic++) {
                if (prbpic[ic].prbid == prblist[ib]) {
                    chk = 1;
                    break;
                }
            }
            if (chk == 1) {
                wrnum += 1;
                wrssresult.push([prbpic[ic].prbid, prbpic[ic].pic]);
            }
        }
        if (wrnum != 0) {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[0].innerHTML = wrnum;
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML=wrnum;
        } else {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[0].innerHTML = '';
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[0].innerHTML='';
        }
        var hwnum = 0;
        var hwresult = [];
        for (var ib = 0; ib < prblist.length; ib++) {
            var chk = 0;
            for (var ic = 0; ic < hwprbpic.length; ic++) {
                if (hwprbpic[ic].prbid == prblist[ib]) {
                    chk = 1;
                    break;
                }
            }
            if (chk == 1) {
                hwnum += 1;
                hwresult.push([hwprbpic[ic].prbid, hwprbpic[ic].pic])
            }
        }
        if (hwnum != 0) {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[1].innerHTML = hwnum;
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML=hwnum;
        } else {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[1].innerHTML = '';
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[1].innerHTML='';
        }
        var insnum = 0;
        var instructprb = [];
        for (var ib = 0; ib < prblist.length; ib++) {
            var chk = 0;
            for (var ic = 0; ic < a.instruct.length; ic++) {
                if (a.instruct[ic].prbid == prblist[ib]) {
                    chk = 1;
                    break;
                }
            }
            if (chk == 1) {
                insnum += 1;
                instructprb.push(a.instruct[ic].prbid);
            }
        }
        if (insnum != 0) {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[2].innerHTML = insnum;
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML=insnum;
        } else {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[2].innerHTML = '';
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[2].innerHTML='';
        }
        var glnum = 0;
        var glresult = [];
        for (var ib = 0; ib < prblist.length; ib++) {
            var chk = 0;
            for (var ic = 0; ic < glprbpic.length; ic++) {
                if (glprbpic[ic].prbid == prblist[ib]) {
                    chk = 1;
                    break;
                }
            }
            if (chk == 1) {
                glnum += 1;
                glresult.push([glprbpic[ic].prbid, glprbpic[ic].pic, glprbpic[ic].ans]);
            }
        }
        if (glnum != 0) {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[3].innerHTML = glnum;
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML=glnum;
        } else {
            subjectbox[ia].getElementsByClassName('r1resultdisplaydiv')[0].childNodes[3].innerHTML = '';
            //r2setdiv[ia].getElementsByTagName('div')[1].getElementsByTagName('div')[3].innerHTML='';
        }
    }
});
var activescene = 0;
function sceneChange2() {
    if (activescene != 2) {
        activescene = 2;
        socket.emit('subjectanalysis2', { mode: 'rankcall' });
    } else if (activescene == 2) {
        activescene = 3;
        socket.emit('subjectanalysis2', { mode: 'rankcallmodechange' });
    }
}
function sceneChange() {
    if (activescene == 0) {
        activescene = 1;
        socket.emit('subjectanalysis2', { mode: 'getdata_modechange' });
    } else if (activescene == 1) {
        activescene = 0;
        socket.emit('subjectanalysis2', { mode: 'getdata' });
    } else {
        activescene = 0;
        socket.emit('subjectanalysis2', { mode: 'getdata' });
    }
    /*
    var activedisplay=document.getElementById('activedisplay');
    if(opt==0){	
        socket.emit('subjectanalysis2',{mode:'getdata'});
    }else if(opt==1){	
        prbOrder();
    }*/
}
//sceneChange();
socket.emit('subjectanalysis2', { mode: 'getdata' });
function saveOrder(opt) {
    sceneChange();
    socket.emit('subjectanalysis2', { mode: opt, rgprblist: rgprblist })
}
function callPrbwaiting(prblist) {
    removeallele('waitinglist');
    var prbwaitingdiv = document.getElementById('waitinglist');
    var waiting = [];
    for (var ia = 0; ia < prblist.length; ia++) {
        var chk = 0;
        for (var ib = 0; ib < rgprblist.length; ib++) {
            if (rgprblist[ib][1] == prblist[ia][1]) {
                chk = 1;
                break;
            }
        }
        if (chk == 0) {
            waiting.push(prblist[ia])
        }
    }
    for (var ia = 0; ia < waiting.length; ia++) {
        var wdiv = document.createElement('div');
        var wdiva = document.createElement('A');
        var wdivadiv = document.createElement('div');
        wdiva.innerHTML = waiting[ia][0];
        //wdiva.innerHTML='['+(ia+1)+'] '+waiting[ia][0];
        wdivadiv.appendChild(wdiva);
        wdiv.id = 'waiting' + waiting[ia][1];
        wdiv.className = 'chosenprb'
        wdiv.onclick = function (i) { return function () { rgprb(i); } }(waiting[ia]);
        wdiv.appendChild(wdivadiv);
        prbwaitingdiv.appendChild(wdiv);
    }
}
function putColoron(classN, idN, colorN, sub) {
    var cn = document.getElementsByClassName(classN);
    for (var ia = 0; ia < cn.length; ia++) {
        cn[ia].style.color = '';
        cn[ia].style.backgroundColor = '';
    }
    document.getElementById(sub + idN[1]).style.backgroundColor = colorN[0];
    document.getElementById(sub + idN[1]).style.color = colorN[1];
}
function rgprb(ele) {
    chosenprb = ele;
    putColoron('chosenprb', ele, ['blue', 'white'], "waiting");
}
function idxOf(arr, itm) {
    var chk = 0;
    for (var ia = 0; ia < arr.length; ia++) {
        if (arr[ia][1] == itm[1]) {
            chk = 1;
            break;
        }
    }
    if (chk == 1) {
        return ia;
    } else {
        return -1;
    }
}
function removeFromrglistRank(ele) {
    var idx = idxOf(rgprblist, ele);
    if (idx > -1) {
        rgprblist.splice(idx, 1);
    } else {
        alert('error from remove rglist');
    }
    givenprblist.push(ele);
    //prbOrder();
    callPrbwaiting(givenprblist);
    rgprb(ele);
}
function removeFromrglist(ele) {
    var idx = idxOf(rgprblist, ele);
    if (idx > -1) {
        rgprblist.splice(idx, 1);
    } else {
        alert('error from remove rglist');
    }
    givenprblist.push(ele);
    prbOrder();
    callPrbwaiting(givenprblist);
    rgprb(ele);
}
function putOrderon(ord) {
    var idx = idxOf(givenprblist, chosenprb);
    if (chosenprb != '') {
        rgprblist.splice(ord, 0, givenprblist[idx]);
        chosenprb = '';
        prbOrder();
        callPrbwaiting(givenprblist);
    } else {
        alert('the prb is not chosen');
    }
}
function prbOrder() {
    //removeallele('confirmedlist');
    //var prblistboard=document.getElementById('confirmedlist');
    removeallele('activedisplay');
    var prblistboard = document.getElementById('activedisplay');
    if (rgprblist.length == 0) {
        var porder0 = document.createElement('div');
        var porder0a = document.createElement('A');
        porder0a.innerHTML = 'porder0';
        porder0.appendChild(porder0a);
        porder0.onclick = function (i) { return function () { putOrderon(i); } }(0);
        prblistboard.appendChild(porder0);
    } else {
        for (var ia = 0; ia <= rgprblist.length; ia++) {
            if (ia != rgprblist.length) {
                var porder = document.createElement('div');
                var pcon = document.createElement('div');
                pcon.className = 'itemwaiting';
                porder.className = 'orderwaiting';
                var pordera = document.createElement('A');
                var pcona = document.createElement('A');
                pordera.innerHTML = 'porder' + ia;
                var pconadiv = document.createElement('div');
                var findr2id;
                var findr2listinfo;
                for (var ic = 0; ic < cps.length; ic++) {
                    if (cps[ic].cptid == rgprblist[ia][1] && cps[ic].parent == r3id) {
                        findr2id = cps[ic].r2id;
                        findr2listinfo = cps[ic].r2listinfo;
                        break;
                    }
                }
                pconadiv.setAttribute('data-r2id', findr2id);
                pconadiv.setAttribute('data-r2listinfo', findr2listinfo);
                pconadiv.className = 'pconadiv';
                pconadiv.id = 'pconadiv' + rgprblist[ia][1];
                var pconnum = document.createElement('a');
                pconnum.innerHTML = '[' + (ia + 1) + '] ';
                pconnum.onclick = function (i,r2id) {
                    return function () {
                        colorR2same(i);
                        

                        checkWhichR2included(i, cps)
                    }
                }(rgprblist[ia][1],findr2id);
                //pcona.innerHTML='['+(ia+1)+']'+rgprblist[ia][0];
                pcona.innerHTML = rgprblist[ia][0];
                pconadiv.appendChild(pconnum);
                pconadiv.appendChild(pcona);
                pcona.onclick = function (i) { return function () { removeFromrglist(i); } }(rgprblist[ia]);
                pordera.onclick = function (i) { return function () { putOrderon(i); } }(ia);
                porder.appendChild(pordera);
                pcon.appendChild(pconadiv);
                prblistboard.appendChild(porder);
                prblistboard.appendChild(pcon);
            } else {
                var porder = document.createElement('div');
                porder.className = 'orderwaiting';
                var pordera = document.createElement('A');
                pordera.innerHTML = 'porder' + ia;
                pordera.onclick = function (i) { return function () { putOrderon(i); } }(ia);
                porder.appendChild(pordera);
                prblistboard.appendChild(porder);
            }
        }
    }
    //MathJax.Hub.Queue(["Typeset",MathJax.Hub,"containerbox1"])	
}
function removeallele(parentid) {
    var parent = document.getElementById(parentid);
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}
socket.on('subjectanalysis2callprb', function (a) {
    var wrssprbpicget = document.getElementById('activedisplay').getAttribute('data-wrssprbpic');
    var hwprbpicget = document.getElementById('activedisplay').getAttribute('data-hwprbpic');
    var instructget = document.getElementById('activedisplay').getAttribute('data-instruct');
    var glprbpicget = document.getElementById('activedisplay').getAttribute('data-glprbpic');
    if (wrssprbpicget !== null) {
        var wrssprbpic = JSON.parse(wrssprbpicget);
    } else {
        var wrssprbpic = [];
    }
    if (hwprbpicget !== null) {
        var hwprbpic = JSON.parse(hwprbpicget);
    } else {
        var hwprbpic = [];
    }
    if (instructget !== null) {
        var instruct = JSON.parse(instructget);
    } else {
        var instruct = [];
    }
    if (glprbpicget !== null) {
        var glprbpic = JSON.parse(glprbpicget);
    } else {
        var glprbpic = [];
    }
    function pullwrsspic(piclist, refnode, prbid) {
        var displaypic = document.getElementsByClassName('displaypic');
        while (displaypic.length != 0) {
            displaypic[0].remove();
        }
        var pullwrsspic = document.createElement('div');
        pullwrsspic.id = 'pullwrsspic';
        pullwrsspic.className = 'displaypic';
        for (var ie = 0; ie < piclist.length; ie++) {
            var picdiv = document.createElement('div');
            var picdiva = document.createElement('a');
            picdiva.innerHTML = piclist[ie][2];
            picdiv.appendChild(picdiva);
            var picimg = document.createElement('img');
            picimg.src = '/usernote/wrsswritingpic/' + piclist[ie][0];
            picdiv.appendChild(picimg);
            picdiv.onclick = function (i) {
                return function () {
                    sendRecord(3, prbid, i)
                    socket.emit('vdrgsharehomework', { menteesocketid: chosenusersocketid, mentorsocketid: socket.id, mode: 'shareresultpic_noprb', auxaddr: '/wrsswritingpic/', userfile: i, username: chosenusername });
                }
            }(piclist[ie][0]);
            pullwrsspic.appendChild(picdiv);
        }
        refnode.parentNode.insertBefore(pullwrsspic, refnode.nextSibling);
    }
    function pullhwpic(piclist, refnode, prbid) {
        var displaypic = document.getElementsByClassName('displaypic');
        while (displaypic.length != 0) {
            displaypic[0].remove();
        }
        /*	
        var tmppullhwpic=document.getElementById('pullhwpic');
        if(tmppullhwpic){
            tmppullhwpic.remove();
        }*/
        var pullhwpic = document.createElement('div');
        pullhwpic.id = 'pullhwpic';
        pullhwpic.className = 'displaypic';
        var solveobj = [];
        for (var ie = 0; ie < piclist.length; ie++) {
            var picdiv = document.createElement('div');
            picdiv.id = 'img' + piclist[ie][0];
            var picdiva = document.createElement('a');
            picdiva.innerHTML = piclist[ie][1] + ', ' + piclist[ie][3];
            var picimg = document.createElement('img');
            picimg.src = '/usernote/mmcphomework/' + piclist[ie][0];
            solveobj.push({ prbid: prbid, solvepic: piclist[ie][0], evalresult: piclist[ie][2] })
            picdiv.appendChild(picimg);
            picdiv.appendChild(picdiva);
            picimg.onclick = function (i) {
                return function () {
                    sendRecord(2, prbid, i)
                    socket.emit('vdrgsharehomework', { menteesocketid: chosenusersocketid, mentorsocketid: socket.id, mode: 'shareresultpic_noprb', auxaddr: '/mmcphomework/', userfile: i, username: chosenusername });
                }
            }(piclist[ie][0]);
            pullhwpic.appendChild(picdiv);
        }
        refnode.parentNode.insertBefore(pullhwpic, refnode.nextSibling);
        assignFunc(solveobj, 'img', 1, username, '', chosenusername)
        realtimeEqualizer(username, chosenusername, 10, 'img', 'hw');
    }
    function pullglpic(piclist, refnode, prbid, cdate, tpassed) {
        var displaypic = document.getElementsByClassName('displaypic');
        while (displaypic.length != 0) {
            displaypic[0].remove();
        }
        /*	
        var tmppullhwpic=document.getElementById('pullhwpic');
        if(tmppullhwpic){
            tmppullhwpic.remove();
        }*/
        var pullglpic = document.createElement('div');
        pullglpic.id = 'pullglpic';
        pullglpic.className = 'displaypic';
        for (var ie = 0; ie < piclist.length; ie++) {
            var picdiv = document.createElement('div');
            var picdiva = document.createElement('a');
            picdiva.innerHTML = cdate[ie] + ', ' + tpassed[ie];
            picdiv.appendChild(picdiva);
            var picimg = document.createElement('img');
            picimg.src = '/usernote/mmcppic/' + piclist[ie];
            picdiv.appendChild(picimg);
            picdiv.onclick = function (i) {
                return function () {
                    sendRecord(4, prbid, i)
                    socket.emit('vdrgsharehomework', { menteesocketid: chosenusersocketid, mentorsocketid: socket.id, mode: 'shareresultpic_noprb', auxaddr: '/mmcppic/', userfile: i, username: chosenusername });
                }
            }(piclist[ie]);
            pullglpic.appendChild(picdiv);
        }
        refnode.parentNode.insertBefore(pullglpic, refnode.nextSibling);
    }
    removeallele('containerbox3');
    var containerbox3 = document.getElementById('containerbox3');
    for (var ia = 0; ia < a.prb.length; ia++) {
        var fdiv = document.createElement('div');
        fdiv.style.marginBottom = '10%';
        fdiv.style.border = '1px solid black';
        var fdivprbcont = document.createElement('div');
        var fdiva = document.createElement('a');
        fdiva.innerHTML = a.prb[ia][1];
        fdivprbcont.appendChild(fdiva);
        fdiv.appendChild(fdivprbcont);
        if (a.prb[ia][8] != null) {
            var picdiv = document.createElement('div');
            picdiv.className = 'picdiv';
            var picimg = document.createElement('img');
            picimg.className = 'picimg';
            picimg.src = a.prb[ia][8];
            picdiv.appendChild(picimg);
            fdiv.appendChild(picimg);
        }
        containerbox3.appendChild(fdiv);
        var resultdisplaydiv = document.createElement('div');
        resultdisplaydiv.className = 'prbresultdisplaydiv';
        var wrssresultdiv = document.createElement('div');
        wrssresultdiv.className = 'wrssprb';
        resultdisplaydiv.appendChild(wrssresultdiv);
        var hwresultdiv = document.createElement('div');
        hwresultdiv.className = 'hwprb';
        resultdisplaydiv.appendChild(hwresultdiv);
        var insresultdiv = document.createElement('div');
        insresultdiv.className = 'insprb';
        resultdisplaydiv.appendChild(insresultdiv);
        var glresultdiv = document.createElement('div');
        glresultdiv.className = 'glprb';
        resultdisplaydiv.appendChild(glresultdiv);
        var chk = 0;
        for (var ib = 0; ib < wrssprbpic.length; ib++) {
            if (wrssprbpic[ib].prbid == a.prb[ia][0]) {
                chk = 1;
                break;
            }
        }
        if (chk == 1) {
            wrssresultdiv.style.backgroundColor = 'blue';
            wrssresultdiv.onclick = function (i, j) {
                return function () {
                    pullwrsspic(i.pic, j, i.prbid);
                }
            }(wrssprbpic[ib], resultdisplaydiv);
        } else {
            wrssresultdiv.style.backgroundColor = '';
        }
        var chk = 0;
        for (var ib = 0; ib < hwprbpic.length; ib++) {
            if (hwprbpic[ib].prbid == a.prb[ia][0]) {
                chk = 1;
                break;
            }
        }
        if (chk == 1) {
            hwresultdiv.style.backgroundColor = 'red';
            hwresultdiv.onclick = function (i, j) {
                return function () {
                    pullhwpic(i.pic, j, i.prbid);
                }
            }(hwprbpic[ib], resultdisplaydiv);
        } else {
            hwresultdiv.style.backgroundColor = '';
        }
        var chk = 0;
        for (var ib = 0; ib < glprbpic.length; ib++) {
            if (glprbpic[ib].prbid == a.prb[ia][0]) {
                chk = 1;
                break;
            }
        }
        if (chk == 1) {
            glresultdiv.style.backgroundColor = 'yellow';
            glresultdiv.onclick = function (i, j) {
                return function () {
                    pullglpic(i.pic, j, i.prbid, i.createdate, i.timepassed);
                }
            }(glprbpic[ib], resultdisplaydiv);
        } else {
            glresultdiv.style.backgroundColor = '';
        }
        var chk = 0;
        for (var ib = 0; ib < instruct.length; ib++) {
            if (instruct[ib].prbid == a.prb[ia][0]) {
                chk = 1;
                break;
            }
        }
        if (chk == 1) {
            insresultdiv.style.backgroundColor = '#7af0ed';
            insresultdiv.onclick = function () {
                var displaypic = document.getElementsByClassName('displaypic');
                while (displaypic.length != 0) {
                    displaypic[0].remove();
                }
            }
        } else {
            insresultdiv.style.backgroundColor = '';
        }
        fdiv.appendChild(resultdisplaydiv);
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "containerbox3"])
});
//socket.emit('subjectanalysis2',{mode:'getdata'});
var numlimit = 30000;
function changeShow(cptid, option) {
    if (option == 'show' || option == 'hide') {
        socket.emit('subjectanalysis2', { mode: 'changeshow', cptid: cptid, option: option })
    } else {
        alert('wrong option');
    }
}
// Order Contents Display area
var viewoption = ['show', 'hide'];
socket.on('subjectanalysis2after', function (a) {
    //MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('tempr1box')])	
    if (activescene == 0) {
        rgprblist = [];
        removeallele('activedisplay');
        var activedisplay = document.getElementById('activedisplay');
        for (var ia = 0; ia < numlimit; ia++) {
            if (a.a[ia].listinfo != endsymbol) {
                if (viewoption.indexOf(a.a[ia].cptoption) != -1) {
                    //if(a.a[ia].cptoption=='show'|| a.a[ia].cptoption=='hide'){	
                    rgprblist.push([a.a[ia].listinfo, a.a[ia].cptid])
                    //rgprblist.push([a.a[ia].listinfo,a.a[ia].numid])
                    var fdiv = document.createElement('div');
                    fdiv.id = a.a[ia].cptid + 'order'
                    fdiv.className = 'subjectbox'
                    fdiv.setAttribute('data-topictitle', a.a[ia].listinfo);
                    fdiv.setAttribute('data-numid', a.a[ia].numid);
                    fdiv.setAttribute('data-prblist', a.a[ia].prblist);
                    if (a.a[ia].cptoption == 'hide') {
                        fdiv.style.marginLeft = '5%';
                        fdiv.style.fontSize = '.8em';
                    } else if (a.a[ia].cptoption = 'show') {
                        fdiv.style.marginTop = '1%';
                    }
                    var fdiva1 = document.createElement('a');
                    if (mode == 'admin') {
                        fdiva1.onclick = function (i, j) {
                            return function () {
                                function callingBack(i, j) {
                                    var tpinputlist = document.getElementsByClassName('tpinput')
                                    for (var ia = 0; ia < tpinputlist.length; ia++) {
                                        var fdiva2 = document.createElement('a');
                                        fdiva2.innerHTML = tpinputlist[ia].parentNode.getAttribute('data-topictitle');
                                        fdiva2.onclick = function (z, w) {
                                            return function () {
                                                callingBack(z, w);
                                            }
                                        }(tpinputlist[ia].parentNode, tpinputlist[ia].parentNode.getAttribute('data-numid'));
                                        tpinputlist[ia].parentNode.appendChild(fdiva2);
                                        tpinputlist[ia].nextSibling.remove();
                                        tpinputlist[ia].remove();
                                    }
                                    var tpinput = document.createElement('input');
                                    tpinput.id = 'tpinput' + j;
                                    tpinput.className = 'tpinput';
                                    tpinput.value = i.childNodes[1].getAttribute('data-content');
                                    //tpinput.value=i.childNodes[1].innerHTML;
                                    i.appendChild(tpinput);
                                    var tpbutton = document.createElement('button');
                                    tpbutton.innerHTML = 'change';
                                    i.appendChild(tpbutton);
                                    tpbutton.onclick = function (k) {
                                        return function () {
                                            var topicmsg = document.getElementById('tpinput' + k).value.replace(/\\/g, "\\\\");
                                            socket.emit('subjectanalysis2', { mode: 'update', listinfo: topicmsg, cptid: k })
                                        }
                                    }(j)
                                    i.childNodes[1].remove();
                                }
                                callingBack(i, j);
                            }
                        }(fdiv, a.a[ia].cptid);
                    }



                    var findr2id = '';
                    var findr2listinfo = '';
                    for (var ic = 0; ic < cps.length; ic++) {
                        if (cps[ic].cptid == a.a[ia].cptid && cps[ic].parent == r3id) {
                            findr2id = cps[ic].r2id;
                            findr2listinfo = cps[ic].r2listinfo;
                            break;
                        }
                    }

                    fdiva1.innerHTML = '[' + (ia + 1) + ']  ';
                    var fdiva2 = document.createElement('a');
                    fdiva2.innerHTML = a.a[ia].listinfo;
                    fdiva2.setAttribute('data-content', a.a[ia].listinfo);
                    fdiva2.onclick = function (j, i,r2id) {
                        return function () {
                            socket.emit('subjectanalysis2', { mode: 'callprb', prblist: j })
                            colorR2same(i);
                              coloringFunction.coloringSingleElement({divListCommonClassName:'r2changeelement',prefix:'r2changeelement',specificName:r2id,color:subjectanalysisR2ChosenColor})

                            var r1divc = document.getElementsByClassName('r1div');
                            for (var ib = 0; ib < r1divc.length; ib++) {
                                r1divc[ib].style.border = '';
                            }
                            var r1panel = document.getElementById(i + 'panel')
                            if (r1panel) {
                                r1panel.style.border = '3px solid #C973D8';
                            }
                        }
                    }(a.a[ia].prblist, a.a[ia].cptid,findr2id);
                    fdiv.appendChild(fdiva1)
                    fdiv.appendChild(fdiva2)
                    var wr2 = document.createElement('a');
                    wr2.innerHTML = '|R2';
                    wr2.onclick = function (i) {
                        return function () {
                            checkWhichR2included(i, cps)
                        }
                    }(a.a[ia].cptid);
                    fdiv.appendChild(wr2);
                    var wr2 = document.createElement('a');

                    /*
                    var wr2=document.createElement('a');
                    wr2.innerHTML='|C';
                    wr2.onclick=function(i){		
                        return function(){	
                            //checkWhichR2included(i,cps)
                            colorR2same(i);
                        }
                    }(a.a[ia].cptid);*/
                    fdiv.appendChild(wr2);
                    wr2.setAttribute('data-r2id', findr2id);
                    wr2.setAttribute('data-r2listinfo', findr2listinfo);
                    wr2.className = 'pconadiv';
                    wr2.id = 'pconadiv' + a.a[ia].cptid;
                    var wr2 = document.createElement('a');
                    if (mode == 'admin') {
                        wr2.innerHTML = '|S|';
                        wr2.onclick = function (i) {
                            return function () {
                                //checkWhichR2included(i,cps)
                                //colorR2same(i);
                                this.innerHTML = '|H|'
                                changeShow(i, 'hide');
                            }
                        }(a.a[ia].cptid);
                    } else {
                        wr2.innerHTML = '|';
                    }
                    fdiv.appendChild(wr2);
                    var rddiv = document.createElement('div');
                    rddiv.className = 'r1resultdisplaydiv';
                    var wrdiv = document.createElement('div');
                    rddiv.appendChild(wrdiv);
                    wrdiv.className = 'wrsscount';
                    var hwdiv = document.createElement('div');
                    rddiv.appendChild(hwdiv);
                    hwdiv.className = 'hwcount';
                    var insdiv = document.createElement('div');
                    rddiv.appendChild(insdiv);
                    insdiv.className = 'inscount';
                    var gldiv = document.createElement('div');
                    rddiv.appendChild(gldiv);
                    gldiv.className = 'glcount';
                    fdiv.appendChild(rddiv);
                    activedisplay.appendChild(fdiv);
                }
            } else {
                break;
            }
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "activedisplay"])
    } else if (activescene == 1) {
        rgprblist = [];
        var activedisplay = document.getElementById('activedisplay');
        activedisplay.setAttribute('data-r2sameorder', JSON.stringify(a.a));
        console.log(a);
        for (var ia = 0; ia < a.a.length; ia++) {
            if (a.a[ia].instructorder == null) {
                rgprblist.push([a.a[ia].listinfo, a.a[ia].cptid])
            } else {
                rgprblist.unshift([a.a[ia].listinfo, a.a[ia].cptid])
            }
            //rgprblist.push([a.a[ia].listinfo,a.a[ia].cptid])
        }
        prbOrder();
    } else if (activescene == 2) {
        // rankcall contents display
        removeallele('activedisplay');
        rgprblist = [];
        //var activedisplay=document.getElementById('activedisplay');
        //activedisplay.setAttribute('data-r2sameorder',JSON.stringify(a.a));
        //rgprblist=[];
        for (var ia = 0; ia < a.b.length; ia++) {
            if (a.b[ia].instructorder == null) {
                rgprblist.push([a.b[ia].listinfo, a.b[ia].cptid])
            } else {
                rgprblist.unshift([a.b[ia].listinfo, a.b[ia].cptid])
            }
        }
        var r2setdiv = document.getElementById('activedisplay');
        //var r2setdiv = document.getElementById('r2set');
        var indr2set = [];
        for (var ia = 0; ia < a.a.length; ia++) {
            var chk = 0;
            for (var ib = 0; ib < indr2set.length; ib++) {
                if (indr2set[ib][0] == a.a[ia].parentcol) {
                    chk = 1;
                    break;
                }
            }
            if (chk == 0) {
                indr2set.push([a.a[ia].parentcol, a.a[ia].r2listinfo]);
            }
        }
        r2obj = [];
        for (var ia = 0; ia < indr2set.length; ia++) {
            r2obj[ia] = { r2id: indr2set[ia][0], r2listinfo: indr2set[ia][1], r1set: [] }
            for (var ib = 0; ib < a.a.length; ib++) {
                if (a.a[ib].parentcol == indr2set[ia][0]) {
                    r2obj[ia].r1set.push({ r1id: a.a[ib].childcol, r1prb: a.a[ib].prblist, r1listinfo: a.a[ib].listinfo })
                }
            }
        }
        for (var ia = 0; ia < r2obj.length; ia++) {
            var r2div = document.createElement('div');
            r2div.className = 'r2div';
            r2div.id = 'rankcall' + r2obj[ia].r2id;
            var r2divadiv = document.createElement('div');
            r2divadiv.className = 'r2divadiv';
            r2divadiv.id = 'rd' + r2obj[ia].r2id;
            var r2divanum = document.createElement('a');
            r2divanum.innerHTML = (ia + 1) + '. ';
            r2divadiv.appendChild(r2divanum);
            var r2diva = document.createElement('a');
            r2diva.innerHTML = r2obj[ia].r2listinfo;
            r2divadiv.appendChild(r2diva);
            r2divadiv.onclick = function (i, j) { return function () { r1Call(i, j); putColoron('r2divadiv', [0, 'rd' + j], ['purple', 'white'], ""); } }(r2obj[ia].r1set, r2obj[ia].r2id);
            var r2prblist = '';
            for (var ib = 0; ib < r2obj[ia].r1set.length; ib++) {
                if (ib == 0) {
                    r2prblist = r2obj[ia].r1set[ib].r1prb;
                } else {
                    r2prblist = r2prblist + ',' + r2obj[ia].r1set[ib].r1prb;
                }
            }
            r2div.setAttribute('data-prblist', r2prblist)
            var resultdisplaydiv = document.createElement('div');
            resultdisplaydiv.className = 'r2resultdisplaydiv';
            var wrssresultdiv = document.createElement('div');
            resultdisplaydiv.appendChild(wrssresultdiv);
            wrssresultdiv.className = 'wrsscount';
            var hwresultdiv = document.createElement('div');
            resultdisplaydiv.appendChild(hwresultdiv);
            hwresultdiv.className = 'hwcount';
            var indresultdiv = document.createElement('div');
            indresultdiv.className = 'inscount';
            resultdisplaydiv.appendChild(indresultdiv);
            var glresultdiv = document.createElement('div');
            glresultdiv.className = 'glcount';
            resultdisplaydiv.appendChild(glresultdiv);
            r2div.appendChild(r2divadiv);
            r2div.appendChild(resultdisplaydiv);
            r2setdiv.appendChild(r2div);
        }
    } else if (activescene == 3) {
        /*
        rgprblist=[];
        var activedisplay=document.getElementById('activedisplay');
        activedisplay.setAttribute('data-r2sameorder',JSON.stringify(a.a));
        for(var ia=0; ia<a.a.length; ia++){
            if(a.a[ia].instructorder==null){
                rgprblist.push([a.a[ia].listinfo,a.a[ia].cptid])
            }else{
                rgprblist.unshift([a.a[ia].listinfo,a.a[ia].cptid])
            }
            //rgprblist.push([a.a[ia].listinfo,a.a[ia].cptid])
        }*/
        var activedisplay = document.getElementById('activedisplay');
        activedisplay.setAttribute('data-r2sameorder', JSON.stringify(a.a));
        prbOrder();
    } else {
    }
});
if (mode == 'admin') {
    var createtopicdiv = document.getElementById('createtopicbox');
    var topicinput = document.createElement('input');
    topicinput.id = 'topicinput';
    createtopicdiv.appendChild(topicinput);
    var topicbutton = document.createElement('button');
    topicbutton.innerHTML = 'creation';
    createtopicdiv.appendChild(topicbutton);
    topicbutton.onclick = function () {
        return function () {
            var topicmsg = document.getElementById('topicinput').value;
            if (topicmsg != '') {
                socket.emit('subjectanalysis2', { mode: 'insert', topicmsg: topicmsg })
                document.getElementById('topicinput').value = '';
            } else {
                alert('empty');
            }
        }
    }();
}
function r1Call(r1obj,r2id){
    var tempr1set=document.getElementById('tempr1set'+r2id);
    if(tempr1set){
        tempr1set.remove();
    }else{
        tempr1setclass=document.getElementsByClassName('tempr1set');
        for(var ia=0; ia<tempr1setclass.length; ia++){
            tempr1setclass[ia].remove();
        }
        var tempr1set=document.createElement('div');
        tempr1set.id='tempr1set'+r2id;
        tempr1set.className='tempr1set';
        for(var ia=0; ia<r1obj.length; ia++){
            var r1div=document.createElement('div');
            r1div.className='r1div';
            r1div.id=r1obj[ia].r1id;	
            var r1divadiv=document.createElement('div');
            r1divadiv.className='r1divadiv';
            r1divadiv.id='rd'+r1obj[ia].r1id;
            var r1divanum=document.createElement('a');
            r1divanum.innerHTML=ia+1+'. ';
            r1divadiv.appendChild(r1divanum);
            r1divanum.onclick=function(j){
                return function(){
                    socket.emit('subjectanalysis2',{mode:'callprb',prblist:j})
                }
            }(r1obj[ia].r1prb);
            var r1diva=document.createElement('a');
            if(r1obj[ia].r1prb!=''){
                r1diva.innerHTML=r1obj[ia].r1listinfo+ '<a style="font-size:.8em">('+r1obj[ia].r1prb.split(",").length+')</a>';
            }else{
                r1diva.innerHTML=r1obj[ia].r1listinfo+ '<a style="font-size:.8em">('+0+')</a>';
            }
            r1divadiv.appendChild(r1diva);
            var chk=0;
            var chk1=0;
            for(ib=0; ib<cps.length; ib++){
                if(endsymbol==cps[ib].listinfo){
                    chk1=1;
                }
                if(cps[ib].cptid == r1obj[ia].r1id && chk1==0){
                    chk=1;
                    break;
                }
            }
            if(chk==1){
                r1diva.parentNode.style.backgroundColor='red';
                r1diva.parentNode.style.color='white';
            }else{
                r1diva.onclick=function(j){
                    return function(){
                    for(var ia=0; ia<rgprblist.length;ia++){
                        if(rgprblist[ia][1]==j){
                            removeFromrglistRank(rgprblist[ia]);	
                            break;
                        }
                    }
                }}(r1obj[ia].r1id);
            }
            r1div.appendChild(r1divadiv);
            tempr1set.appendChild(r1div);
        }
        var refnode=document.getElementById('rankcall'+r2id);
        refnode.parentNode.insertBefore(tempr1set,refnode.nextSibling);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,tempr1set])	
    }
}	
function callStdlist(){
if(mode!='admin'){
    socket.emit('callstdlist',{username:userinfo.username,mode:'teacherstd'});	
}else{
    socket.emit('callstdlist');	
}
}

import {
    subjectanalysisR2ChosenColor,
} from '/model/constants/color/chosenColor.js'
import * as coloringFunction from '/model/utils/functions/coloringThings.js'
import * as insertFunction from '/model/utils/functions/insertThings.js'

import {changeShow} from '/controller/subjectanalysis_controller/subjectanalysis_levelControl_controller.js'


export function subjectAnalysisNavigation() {
    var r2changeDiv = document.getElementById('r2change');

    var indr2 = [];
    for (var ic = 0; ic < cps.length; ic++) {
        if (cps[ic].parent == "r3id.jCdf6GgI6C") {
            var chk = 0;
            for (var ia = 0; ia < indr2.length; ia++) {
                if (cps[ic].r2id == indr2[ia].r2id) {
                    chk = 1;
                    break;
                }
            }
            if (chk == 0) {
                var fdiv = document.createElement('div');
                indr2.push(cps[ic])
                var fdiva = document.createElement('a');
                fdiva.innerHTML = '[' + indr2.length + ']' + cps[ic].r2listinfo;
                fdiv.appendChild(fdiva);
                fdiva.className = 'r2changeelement';
                fdiva.id='r2changeelement'+cps[ic].r2id

                fdiva.onclick = function (i,fdivj) {
                    return function () {
                        coloringFunction.coloringSingleElement({divListCommonClassName:'r2changeelement',prefix:'r2changeelement',specificName:i,color:subjectanalysisR2ChosenColor})

                        var sb = document.getElementsByClassName('pconadiv');
                        for (var ib = 0; ib < sb.length; ib++) {
                            if (sb[ib].getAttribute('data-r2id') == i) {
                                sb[ib].parentNode.style.backgroundColor = '#06ff51';
                            } else {
                                sb[ib].parentNode.style.backgroundColor = '';
                            }
                        }
                        var tempr1box = document.getElementById('tempr1box');
                        if (tempr1box) {
                            tempr1box.remove();
                        }
                        var tempr1box = document.createElement('div');
                        tempr1box.id = 'tempr1box';
                        var num = 0;
                        for (var ia = 0; ia < cps.length; ia++) {
                            if (cps[ia].r2id == i) {
                                num += 1;
                                var r1div = document.createElement('div');
                                r1div.id = cps[ia].cptid + 'panel';
                                r1div.className = 'r1div';
                                var r1diva = document.createElement('a');
                                r1diva.innerHTML = num + ') ' + cps[ia].listinfo;
                                r1diva.onclick = function (j, k) {
                                    return function () {
                                        socket.emit('subjectanalysis2', { mode: 'callprb', prblist: j })
                                        var ordercpt = document.getElementsByClassName('subjectbox');
                                        for (var ib = 0; ib < ordercpt.length; ib++) {
                                            ordercpt[ib].style.border = '';
                                        }
                                        const targetelement = document.getElementById(k + 'order')
                                        targetelement.style.border = '1px solid red';
                                        //const targetelementposition=targetelement.getBoundingClientRect();
                                        //document.getElementById('activedisplay').scrollTo({ top: targetelementposition.top, left: 0, behavior: 'smooth' })
                                        const activedisplayContainer = document.getElementById('activedisplay');
                                        const activedisplayTotalLength=activedisplayContainer.scrollHeight
                                        const containerRect = activedisplayContainer.getBoundingClientRect();
                                        const nodeRect = targetelement.getBoundingClientRect();


                                        const relativeTop=nodeRect.top-containerRect.top

                                        const scrollY = nodeRect.top - containerRect.top + nodeRect.height / 2 - containerRect.height / 2;
                                        console.log('relativeTop',relativeTop,'activedisplayTotalLength',activedisplayTotalLength,'containerRect.height',containerRect.height)
                                        // const scrollY = containerRect.height*(relativeTop/activedisplayTotalLength)
                                        console.log('scrollY',scrollY)
                                        activedisplayContainer.scrollTo({
                                            top: scrollY,
                                            behavior: 'smooth' // 부드러운 스크롤을 위해 추가합니다. 필요하지 않다면 제거할 수 있습니다.
                                        })
                                    }
                                }(cps[ia].prblist, cps[ia].cptid);
                                r1div.appendChild(r1diva);
                                tempr1box.appendChild(r1div);
                                if (cps[ia].cptoption == 'show') {
                                    r1div.style.backgroundColor = 'green';
                                    r1div.style.color = 'white';
                                } else if (cps[ia].cptoption == 'hide') {
                                    var r1divshow = document.createElement('a');
                                    r1diva.className = 'r1diva';
                                    r1divshow.className = 'r1divshow';
                                    if (mode == 'admin') {
                                        r1divshow.innerHTML = '|S|';
                                        r1divshow.onclick = function (i) {
                                            return function () {
                                                this.innerHTML = 'KK';
                                                this.parentNode.style.backgroundColor = 'green';
                                                changeShow(i, 'show');
                                            }
                                        }(cps[ia].cptid);
                                    }
                                    r1div.appendChild(r1divshow);
                                } else {
                                    r1div.style.backgroundColor = 'black';
                                }
                            }
                        }
                        // this.appendChild(tempr1box);
                        // insertFunction.tembBoxDisplayInsertEndMethod({insertElement:tempr1box,parentElement:r2changeDiv})
                        insertFunction.tembBoxDisplayInsertMiddleMethodToggleClickClose({insertElement:tempr1box,refElementForNextSibling:fdivj,parentElement:r2changeDiv})
                        
                    }
                }(cps[ic].r2id,fdiv)
                r2changeDiv.appendChild(fdiv);
            }
        }
    }
}
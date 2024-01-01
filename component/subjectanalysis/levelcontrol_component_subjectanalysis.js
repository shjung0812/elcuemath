import {levelControlFunction} from '/controller/subjectanalysis_controller/subjectanalysis_levelControl_controller.js'

export const levelControlComponent = ()=>{
    const createtopicbox=document.getElementById('createtopicbox')
    const r1OrderChangeModeButoon=document.createElement('button')
    r1OrderChangeModeButoon.innerText='R1ModeChange'
    createtopicbox.appendChild(r1OrderChangeModeButoon)
    r1OrderChangeModeButoon.onclick=function(){
        return function(){
            levelControlFunction()
        }
    }()


    // button(onclick="sceneChange()") Mode Change
    // button(id='saveorder', onclick='saveOrder("orderset")') saver Order
    // button(onclick="sceneChange2()") Rankcall


}
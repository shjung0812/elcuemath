import {callNextr1,callPrvr1} from "/component/hwuserhistory/pickingSubject_component_hwuserhistory.js"
import {switchMode} from "/controller/hwuserhistory_controller/hwuserhistory_switchMode_controller.js"

export const controlButtonNext = ()=>{
    const nextButton=document.getElementById('next')
    nextButton.onclick=callNextr1
    const prvButton=document.getElementById('prv')
    prvButton.onclick=callPrvr1
}


export const switchModeButton = ()=>{
    const switchModeDiv=document.getElementById('switchMode')
    switchModeDiv.onclick=function(){
      return function(){
        switchMode()

      }  
    }()

}

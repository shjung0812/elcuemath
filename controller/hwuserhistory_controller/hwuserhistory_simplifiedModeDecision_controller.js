export const simplifiedModeDecision = ()=>{
    console.log('simplifiedMode',simplifiedMode)
    if(Number(simplifiedMode)){
        r2list=r2listOrigin.filter((item)=>item.r2listinfo.split('#')[0]=='w')
        
    }else{
        r2list=r2listOrigin;
    }

}
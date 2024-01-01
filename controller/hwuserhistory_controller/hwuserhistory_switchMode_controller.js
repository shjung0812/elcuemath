export const switchMode = ()=>{
    if(simplifiedMode){
        r2list=r2listOrigin.filter((item)=>item.r2listinfo.split('#')[0]=='w')
        simplifiedMode=false
    }else{
        r2list=r2listOrigin;
        simplifiedMode=true;
    }

}
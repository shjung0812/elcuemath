
const {Prb,Content}=require('../models')
module.exports={
    testServiceLogic:async (message)=>{
        console.log('message in serviㅇㅇce', message)
        console.log('Prb+',await Prb.findAll())
        return ''


    },
    saveWriting:async({delta,title})=>{
        Content.create({
           quill_content:delta,
           title
        

        })

    }
}
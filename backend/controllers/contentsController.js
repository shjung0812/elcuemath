const writingContentsService = require('../service/writingContentsService')
module.exports = {
    contentsTest: async (req, res) => {
        await writingContentsService.testServiceLogic('my message')
        res.send('hi')

    },
    saveWriting:async(req,res)=>{
        const {delta,title} = req.body;
        console.log(req.body)
        console.log('delta',delta)
        await writingContentsService.saveWriting({delta,title})

    }
}
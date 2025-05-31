
const { Prb, Content } = require('../models')
module.exports = {
    testServiceLogic: async (message) => {
        console.log('message in serviㅇㅇce', message)
        console.log('Prb+', await Prb.findAll())
        return ''


    },
    saveWriting: async ({ delta, title }) => {
        Content.create({
            quill_content: delta,
            title


        })

    },
    getAllContents: async () => {
        try {
            const contents = await Content.findAll();
            return contents;
        } catch (error) {
            console.error('Error fetching all contents:', error);
            // 에러를 다시 던지거나, 특정 에러 응답을 반환하거나, 빈 배열 등을 반환할 수 있습니다.
            throw new Error('Failed to retrieve contents.'); // 또는 throw error;
        }
    }

}
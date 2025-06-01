
const { Prb, Content } = require('../models')
module.exports = {
    testServiceLogic: async (message) => {
        console.log('message in serviㅇㅇce', message)
        console.log('Prb+', await Prb.findAll())
        return ''


    },
    saveWriting: async ({ delta, title }) => {
            const deltaJsonString = JSON.stringify(delta);

        Content.create({
            quill_content: deltaJsonString,
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
    },
    deleteWriting: async (id) => {
        try {
            const deletedCount = await Content.destroy({
                where: { id: id }
            });

            return deletedCount;
        } catch (error) {
            console.error('Error deleting a content:', error);
            // 에러를 다시 던지거나, 특정 에러 응답을 반환하거나, 빈 배열 등을 반환할 수 있습니다.
            throw new Error('Failed to delete contents.'); // 또는 throw error;
        }
    },
    updateWritingReplace: async (id, title,newDelta) => {
    try {
        
      const [updatedRowsCount] = await Content.update({
        quill_content: JSON.stringify(newDelta), // 새로운 Delta로 전체 교체
        title,
        updatedAt: new Date(),
      }, {
        where: { id: Number(id) },
      });

      console.log('updatedRowsCount',updatedRowsCount)

    //   if (updatedRowsCount === 0) {
    //     throw new Error(`Failed to replace content with ID ${id}. It might not exist.`);
    //   }

      const updatedContent = await Content.findByPk(id);
      console.log('Content replaced successfully:', updatedContent);
      return updatedContent;

    } catch (error) {
      console.error('Error replacing content:', error);
      throw error;
    }
  }


}
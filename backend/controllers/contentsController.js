const writingContentsService = require('../service/writingContentsService')
module.exports = {
    contentsTest: async (req, res) => {
        await writingContentsService.testServiceLogic('my message')
        res.send('hi')

    },
    saveWriting: async (req, res) => {
        const { delta, title } = req.body;
        console.log(req.body)
        console.log('delta', delta)
        await writingContentsService.saveWriting({ delta, title })

    },
    getWriting: async (req, res) => {
        try {
            // 1. 서비스 계층에서 모든 콘텐츠를 가져옵니다.
            const contents = await writingContentsService.getAllContents();

            // 2. 성공적으로 데이터를 가져왔다면, HTTP 200 OK 상태 코드와 함께 데이터를 JSON 형태로 응답합니다.
            return res.status(200).json({
                success: true,
                message: 'All writing contents retrieved successfully.',
                data: contents
            });

        } catch (error) {
            // 3. 서비스 계층에서 에러가 발생했거나, 다른 문제가 생겼을 경우 에러를 처리합니다.
            console.error('Error in getWriting controller:', error);

            // 클라이언트에 HTTP 500 Internal Server Error 상태 코드와 함께 에러 메시지를 응답합니다.
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve writing contents.',
                error: error.message // 개발 환경에서는 에러 메시지를 포함하는 것이 디버깅에 유용합니다.
                // 프로덕션 환경에서는 보안을 위해 일반적인 에러 메시지를 사용하는 것이 좋습니다.
            });
        }
    }

}
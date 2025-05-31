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
    },
 deleteWriting: async (req, res) => {
    const { id } = req.params; // URL 파라미터에서 삭제할 콘텐츠의 ID 추출

    try {
        // 1. 서비스 계층에서 특정 ID를 가진 콘텐츠를 삭제합니다.
        // 이 함수는 삭제 성공 시 true 또는 삭제된 행의 개수를 반환할 수 있습니다.
        const result = await writingContentsService.deleteWriting(id);

        // 2. 삭제 결과에 따라 응답을 보냅니다.
        // 예를 들어, 서비스에서 true를 반환하거나 삭제된 행의 개수가 1 이상일 경우 성공으로 간주합니다.
        if (result) {
            return res.status(200).json({
                success: true,
                message: `콘텐츠 (ID: ${id})가 성공적으로 삭제되었습니다.`,
                // 삭제 후 클라이언트에게 특별히 전달할 데이터가 없다면 data 필드는 생략하거나 null로 설정합니다.
                data: null
            });
        } else {
            // 삭제할 콘텐츠를 찾지 못했거나 삭제에 실패한 경우
            return res.status(404).json({
                success: false,
                message: `ID ${id}에 해당하는 콘텐츠를 찾을 수 없거나 삭제에 실패했습니다.`,
                data: null
            });
        }

    } catch (error) {
        // 3. 서비스 계층에서 에러가 발생했거나, 다른 문제가 생겼을 경우 에러를 처리합니다.
        console.error(`콘텐츠 (ID: ${id}) 삭제 중 오류 발생:`, error);

        // 클라이언트에 HTTP 500 Internal Server Error 상태 코드와 함께 에러 메시지를 응답합니다.
        return res.status(500).json({
            success: false,
            message: '콘텐츠 삭제 중 서버 오류가 발생했습니다.',
            error: error.message // 개발 환경에서는 에러 메시지를 포함하는 것이 디버깅에 유용합니다.
                                  // 프로덕션 환경에서는 보안을 위해 일반적인 에러 메시지를 사용하는 것이 좋습니다.
        });
    }
}
}
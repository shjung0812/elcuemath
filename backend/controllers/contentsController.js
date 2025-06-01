const writingContentsService = require('../service/writingContentsService')
module.exports = {
    contentsTest: async (req, res) => {
        await writingContentsService.testServiceLogic('my message')
        res.send('hi')

    },
saveWriting: async (req, res) => {
        const { delta, title } = req.body;
        console.log('req.body:', req.body); // 요청 본문 전체
        console.log('delta:', delta); // delta 값 확인

        try {
            // 서비스 계층에서 데이터베이스에 저장하고, 저장된 데이터를 반환받습니다.
            // 예를 들어, 저장된 글의 id, title, quill_content 등을 포함할 수 있습니다.
            const savedContent = await writingContentsService.saveWriting({ delta, title });

            // 저장 성공 시
            return res.status(201).json({ // 201 Created: 새로운 리소스가 성공적으로 생성되었을 때 사용
                success: true,
                message: '글이 성공적으로 저장되었습니다.',
                data: savedContent // 저장된 글의 정보 (id, title 등)를 포함하여 보낼 수 있습니다.
            });

        } catch (error) {
            console.error('글 저장 중 오류 발생:', error); // 서버 로그에 상세 에러 기록

            // 에러 발생 시
            // 에러 유형에 따라 다른 상태 코드와 메시지를 보낼 수 있습니다.
            // 예를 들어, 유효성 검사 실패는 400 Bad Request, 서버 오류는 500 Internal Server Error
            if (error.name === 'SequelizeValidationError') { // Sequelize 유효성 검사 에러
                return res.status(400).json({
                    success: false,
                    message: '입력 데이터가 유효하지 않습니다.',
                    errors: error.errors.map(err => err.message) // 유효성 검사 에러 메시지 배열
                });
            } else if (error.code === 'ER_NO_DEFAULT_FOR_FIELD' || error.message.includes("doesn't have a default value")) {
                // 이전에 겪으셨던 ID 관련 에러 (마이그레이션 및 모델 정의 확인 필요)
                return res.status(500).json({
                    success: false,
                    message: '데이터베이스 오류: ID 필드 설정에 문제가 있습니다. 관리자에게 문의하세요.',
                    details: error.sqlMessage // 에러 상세 메시지 포함 (개발 단계에서 유용)
                });
            } else {
                // 그 외 알 수 없는 서버 에러
                return res.status(500).json({
                    success: false,
                    message: '글 저장에 실패했습니다. 서버 오류입니다.',
                    error: error.message // 실제 서비스에서는 보안상 에러 메시지를 축약할 수 있습니다.
                });
            }
        }
    },
updateSavedDelta: async (req, res) => {
        const { delta,title } = req.body; // 클라이언트에서 body로 delta와 id를 보냄
        const { id } = req.params; // URL 파라미터에서 삭제할 콘텐츠의 ID 추출
        console.log('delta, id',delta, id)


        // 입력값 유효성 검사 (기본적인 검증)
        if (!id) {
            return res.status(400).json({ message: 'Content ID is required.' });
        }
        if (!delta) {
            return res.status(400).json({ message: 'Delta content is required.' });
        }
        // delta가 Quill Delta의 유효한 객체 형태인지 추가 검증할 수 있습니다.
        // 예를 들어, `delta.ops`가 배열인지 확인하는 등.
        if (!Array.isArray(delta.ops)) {
             return res.status(400).json({ message: 'Invalid Delta format. "ops" array is missing.' });
        }


        try {
            // 서비스 계층의 updateWriting 함수 호출
            // 이 함수는 위에서 구현한 'updateWritingReplace' 또는 'updateWritingMerge' 중 하나가 될 것입니다.
            const updatedContents = await writingContentsService.updateWritingReplace(id,title, delta);
            // 만약 병합 방식을 사용한다면:
            // const updatedContents = await writingContentsService.updateWritingMerge(id, delta);


            // 업데이트 성공 시 응답
            if (updatedContents) {
                return res.status(200).json({
                                    success: true,

                    message: 'Content updated successfully.',
                    data: updatedContents // 업데이트된 콘텐츠 데이터를 클라이언트에 반환
                });
            } else {
                // ID는 유효했으나 어떤 이유로 업데이트된 내용이 없는 경우 (매우 드뭄)
                return res.status(404).json({ 
                                    success: false,

                    message: 'Content not found or could not be updated.' });
            }

        } catch (error) {
            console.error('Error in updateSavedDelta:', error.message);

            // 서비스 계층에서 던진 에러를 잡아 클라이언트에 적절한 에러 응답
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            // 그 외 일반적인 서버 에러
            return res.status(500).json({ message: 'Failed to update content due to a server error.', error: error.message });
        }
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
const express = require('express');
const router = express.Router();
const cmsController = require('../backend/controllers/cmsController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure directory exists (optional, assuming it exists based on previous checks)
        const dir = 'public/prismpics';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Temporary filename, will be renamed in controller
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// 전체 커리큘럼 트리 조회
router.get('/curriculum', cmsController.getCurriculum);

// 노드 이동
router.patch('/node/move', cmsController.moveNode);

// 개념별 문제 목록 조회
router.get('/r1/:id/problems', cmsController.getProblems);

// 문제 순서 변경
router.patch('/r1/:id/problems/reorder', cmsController.reorderProblems);

// 미분류 문제 목록 조회
router.get('/problems/unlinked', cmsController.getUnlinkedProblems);

// 문제 수정 (이미지 업로드 포함)
router.put('/problem/:id', upload.single('image'), cmsController.updateProblem);

// 문제 추가
router.post('/problems', cmsController.createProblem);

// 노드 추가 (R1, R2, R3)
router.post('/nodes', cmsController.createNode);

// 노드 이동 (부모 변경)
router.post('/nodes/move', cmsController.moveNode);

// 노드 수정 (이름 변경)
router.put('/nodes', cmsController.updateNode);

// 노드 순서 변경 (Swap)
router.post('/nodes/reorder', cmsController.swapNodeOrder);

module.exports = router;

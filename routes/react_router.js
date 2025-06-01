const express = require('express');
const router = express.Router();
const path = require('path');

const reactAppBuildPath = path.join(__dirname, '../src', 'dist'); // 실제 React 빌드 폴더 경로로 변경해주세요
router.get('/', (req, res) => {
  res.sendFile(path.join(reactAppBuildPath, 'index.html'));
});
module.exports = router;

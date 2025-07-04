const express = require('express');
const router = express.Router();
const path = require('path');

const reactAppBuildPath = path.join(__dirname, '../frontend', 'dist'); // 실제 React 빌드 폴더 경로로 변경해주세요
router.get('/{*wildcard}', (req, res) => {
    console.log('wild')
  // res.sendFile(path.join(reactAppBuildPath, 'index.html'));
  // res.sendFile('index.html');

     res.sendFile(path.join(reactAppBuildPath, 'index.html'), (err) => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});
module.exports = router;

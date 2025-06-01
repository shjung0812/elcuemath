const express = require('express');
const router = express.Router();
const path = require('path');

// const subjectanalysisRouter = require('./subjectanalysis_router/main');


const subjectanalysisRouter = require('./subjectanalysis_router');
router.use('/subjectanalysis', subjectanalysisRouter);

const ads_router = require('./ads_router');
router.use('/correspondence', ads_router);

const contents_router=require('./mathcontents/contents_router')
router.use('/contents', contents_router);



const react_router = require('./react_router')
const reactAppBuildPath = path.join(__dirname, '../frontend', 'dist'); // 실제 React 빌드 폴더 경로로 변경해주세요
router.use('/renv', express.static(reactAppBuildPath))

router.use('/renv', react_router);



module.exports = router;
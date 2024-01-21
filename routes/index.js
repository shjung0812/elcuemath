const express = require('express');
const router = express.Router();

// const subjectanalysisRouter = require('./subjectanalysis_router/main');


const subjectanalysisRouter = require('./subjectanalysis_router');
router.use('/subjectanalysis', subjectanalysisRouter);

const ads_router = require('./ads_router');
router.use('/correspondence', ads_router);

module.exports = router;
const express = require('express');
const router = express.Router();

// const subjectanalysisRouter = require('./subjectanalysis_router/main');
const subjectanalysisRouter = require('./subjectanalysis_router/subjectanalysis_main');
// const userRouter = require('./userRoutes');

// router.use('/', mainRouter);
router.use('/subjectanalysis', subjectanalysisRouter);
// router.use('/user', userRouter);

module.exports = router;
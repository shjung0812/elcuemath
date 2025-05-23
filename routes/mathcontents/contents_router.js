const express = require('express');
const router = express.Router();
const contentsController=require('../../backend/controllers/contentsController')
console.log('contentsController',contentsController)
router.get('/test',contentsController.contentsTest)
router.post('/savewriting',contentsController.saveWriting)
module.exports = router;
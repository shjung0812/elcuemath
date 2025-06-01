const express = require('express');
const router = express.Router();
const contentsController=require('../../backend/controllers/contentsController')
console.log('contentsController',contentsController)
router.get('/test',contentsController.contentsTest)
router.post('/savewriting',contentsController.saveWriting)
router.get('/getwriting',contentsController.getWriting)
router.delete('/deletewriting/:id',contentsController.deleteWriting)
router.put('/handlesavedelta/:id',contentsController.updateSavedDelta)
module.exports = router;
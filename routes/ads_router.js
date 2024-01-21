const express = require('express');
const router = express.Router();
var sf = require('../bin/serverflow.js');


router.get('/adtest/scrolling',function(req,res){
    res.render('ads/adtest/scrolling/scrolling')
	
});
router.get('/adtest/proman',function(req,res){
    res.render('ads/adtest/proman/proman')
	
});
module.exports = router;

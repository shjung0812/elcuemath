const express = require('express');
const router = express.Router();
var sf = require('../bin/serverflow.js');


router.get('/subjectanalysis_mentor',function(req,res){
	if(typeof req.query.username !== 'undefined' && typeof req.user !== 'undefined'){
		var username=req.query.username;


        console.error('req.user',req.user)
		sf.getinfodb('select * from r3list',function(a){
		sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id, r.parentcol as parent,cpt.instructorder,cpt.cptoption from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol order by r2.r2order asc, instructorder asc', function(b){
			res.render('vdrg/subjectanalysis2',{cps:b,r3list:a,username:username, userinfo:req.user,mode:'mentor'});
		});
		})





	}else{
		res.render('askLogin',{reasonFail:`학생변수가 선택되어야 합니다. 학생변수 ${req.query.username}, 로그인 상태여야 합니다. ${req.user}`});
	}

});


router.get('/admin/subjectanalysis2',function(req,res){

	sf.getinfodb('select * from r3list',function(a){
	sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id, r.parentcol as parent,cpt.instructorder,cpt.cptoption from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol order by r2.r2order asc, instructorder asc', function(b){
	//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol where r.parentcol="r3id.jCdf6GgI6C" order by r2.r2order asc', function(b){
		res.render('vdrg/subjectanalysis2',{cps:b,r3list:a,username:'',userinfo:'',mode:'admin'});
	});
	})
});

module.exports = router;



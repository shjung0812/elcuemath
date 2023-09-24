var express = require('express');
var app = express();

require('dotenv').config(); // .env 파일을 로드

var path=require('./prismpath.json');
var sf=require(path.prismbin+'serverflow');

var md5=require('md5');
var https=require('https');


//const accountSid = 'ACcbc0e7f44f62464de70540c81b142aef';
//const authToken = "e2940eb8fa849a2ec5f344cfcfe8b2cf";
//var client  = require('twilio')(
//	accountSid, authToken
//);



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
var client = require('twilio')(accountSid, authToken);



var fs = require('fs');
const options = {
	key: fs.readFileSync('./keys/2308aielcue/ai_elcue_org_SHA256WITHRSA.key'),
	//key: fs.readFileSync('./keys/elcue/www_elcue_net_SHA256WITHRSA.key'),
	cert:fs.readFileSync('./keys/2308aielcue/ai_elcue_org.crt')
	//cert:fs.readFileSync('./keys/elcue/www_elcue_net.crt')
}
//var server=require('http').createServer(app);
//var server=https.createServer(app);
var server=https.createServer(options,app);
var io = require('socket.io')(server);
var pagerefresh=sf.nodetime()+' node page refreshed!'+'\n';
fs.appendFile('./log/socketlog.log',pagerefresh,function(err){
	if(err) throw err;
	console.log('Saved');
});


/*
app.all('*',(req,res,next)=>{
	let protocol = req.headers['x-forwarded-proto']||req.protocol;
	if(protocol == 'https'){
		next();
	}else{
		let from ='${protocol}://${req.hostname}${req.url}';
		let to = 'https://${req.hostname}${req.url}';
		console.log('[${req.method]:${from} -> ${to}');
		res.redirect(to);
	}
});*/
var formidable = require('formidable');
var readChunk = import('read-chunk');
var fileType = import('file-type');

//var formidable = require('formidable');
//import {readChunk} from 'read-chunk';
//import {fileTypeFromFile} from 'file-type';



const multer = require('multer');
//const upload=multer({dest:__dirname+'/public'});
var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,__dirname+'/public');
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
});
var upload=multer({storage:storage});




var session = require('express-session');
const FileStore = require('session-file-store')(session);

//app.set('port', process.env.PORT || 80);
app.set('port', process.env.PORT || 443);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/component', express.static(__dirname + "/component"));



var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(session({
	secret: 'mylovesoojung',
	resave: false,
	saveUninitialized: true,
	store: new FileStore()
}));



var flash = require('connect-flash');

app.use(flash());
var passport = require('passport')
,LocalStrategy = require('passport-local').Strategy;

var User = require(path.prismbin+'user');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
	console.log('serialize');
	console.log(user,done);
	done(null,user.username);
});

passport.deserializeUser(function(id,done){
	console.log('deserialize');
	User.findById(id,function(err,user){	
		done(null,user);
	})
});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.findOne({username:username.toLowerCase()},function(err,user){
		if(err){return done(err);}
		if(!user){
		
			return done(null,false,{message:'Incorrect username.'});
		}
		user.validPassword(md5(password)).then(ps=>{
			if(!ps){
				return done(null, false, {message:'Incorrect password.'});
			}else{
				return done(null, user);
			}
		});
		});
	}
));
var ss=require('socket.io-stream');
var path = require('path');

io.of('/draw').on('connection',function(socket){

	console.log('draw connectino established');
	
	socket.on('canvpos',function(pos){
		//io.sockets.in(pos.roomid).emit('canvpos',{data:pos.data});
		console.log(pos.roomid);
		io.sockets.in(pos.roomid).emit('canvpos',{data:pos.data});
	});

	socket.on('roomsid',function(msg){
		console.log(msg);
		io.of('/draw').emit('rooml',msg);
	});

	socket.on('drawtest',function(ma){
		console.log(ma.pos[0], ma.pos[1]);
		socket.emit('copypics',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat});
	});

});


var siesmentorsocketid;
var siesmenteesocketid;
io.of('/sies').on('connection',function(socket){
	console.log('sies connected');
	socket.on('siessendsocketid',function(ma){
		if(ma.userkind==0){
			siesmentorsocketid=ma.socketid;
			console.log('socketid of mentor is received : '+siesmentorsocketid);
			
		}else if(ma.userkind==1){
			siesmenteesocketid=ma.socketid;
			client.tokens.create().then(token=>{
				socket.emit('siessendsocketidafter',{iceservers:token.iceServers});
				console.log('socketid of mentee is received : '+siesmenteesocketid);
			});


		}else{
			console.log('error from getting socket id of mentor or mentee');
		}
	});
	socket.on('webrtctoservernewicecandidate',function(a){
		if(a.destination=='toresponder'){
			socket.broadcast.to(siesmenteesocketid).emit('webrtctorespondernewicecandidate',{newicecandidate:a.newicecandidate});
		}else{
			socket.broadcast.to(siesmentorsocketid).emit('webrtctocallernewicecandidate',{newicecandidate:a.newicecandidate});
		}
	});

	socket.on('webrtccallertoserver',function(a){
		socket.broadcast.to(siesmenteesocketid).emit('webrtcservertoresponder',{offer:a.offer});

	});
	socket.on('webrtcrespondertoserver',function(a){
		socket.broadcast.to(siesmentorsocketid).emit('webrtcservertocaller',{answer:a.answer});
	});


	socket.on('siessharescreen',function(a){
		client.tokens.create().then(token=>{
			socket.emit('siessharescreenafter',{iceservers:token.iceServers});
		});

	});

	socket.on('coursematerialcall',function(){
		console.log('course material call recived..')
		sf.getinfodb('select distinct crsname from defele',function(ma){
			socket.emit('coursematerialsend',{crslist:ma});
			console.log('course material sent to Mentor')
		});
	});
	socket.on('crselementcall',function(ma){
		sf.getinfodb('select distinct pstage,eleprbs, b.vidaddr from defele as a join videocont as b on a.elevideo=b.id where crsname="'+ma.crs+'"', function(mb){
			socket.emit('sentelementlist',{elelist:mb,crsname:ma.crs});
		});
	});
	socket.on('callprblist',function(ma){
		sf.prbsetv2(ma.prblist,function(mb){
			socket.emit('sentprblist',{prblist:mb,sendinput:ma.sendinput});
		});
	});
	socket.on('sentlearningmaterialtomentee',function(ma){
		sf.signalServerDumpRecord([ma.crsname,ma.ele,ma.prbs,ma.vidaddr,ma.mentor,ma.mentee],1,function(){
			sf.prbsetv2(ma.prbs,function(mb){
				socket.broadcast.to(siesmenteesocketid).emit('getlearningmaterialfrommentor',{crsname:ma.crsname,ele:ma.ele,prbs:mb,vidaddr:ma.vidaddr});
			});
		});
	
	});
	socket.on('registersocketid',function(ma){
		siesmenteesocketid=ma.id;
		socket.broadcast.to(siesmentorsocketid).emit('menteerequestaccepted',{menteeid:siesmenteesocketid});
	});
	socket.on('learningresultsent',function(ma){
		sf.signalServerDumpRecord([ma.prbstatepanel,ma.mentor,ma.mentee,'@@@','###'],2,function(rid){
			socket.broadcast.to(siesmentorsocketid).emit('learningresulttomentor',{prbstatepanel:ma.prbstatepanel,mentee:ma.mentee,resultid:rid});
		})
	});

	socket.on('siesmenteerequest',function(ma){
		sf.signalServerDumpRecord([ma.mentor,ma.mentee],3,function(){
			console.log(siesmentorsocketid);
			client.tokens.create().then(token=>{
				socket.broadcast.to(siesmentorsocketid).emit('siesmenteerequesttomentor',{peerid:ma.peerid,iceservers:token.iceServers});
			});


		});
	});

	socket.on('siescallterminatebymentor',function(){
		console.log('call will be terminated : so of mentees ' + siesmenteesocketid);
		socket.broadcast.to(siesmenteesocketid).emit('siescallterminatebymentortomentee');
	});

	socket.on('signalservermentoraccept',function(ma){
		sf.signalServerDumpRecord([ma.mentor,ma.mentee],4,function(){});
	});
	socket.on('connectionstopbymentor',function(ma){
		sf.signalServerDumpRecord([ma.mentor,ma.mentee],5,function(){});
	});	
});


app.get('/sies/sharescreen/mentee',function(req,res){
		res.render('sies/sharescreenmentee');

});

app.get('/sies/sharescreen/mentor',function(req,res){
	res.render('sies/sharescreenmentor');
});



var mentee;
var mentor;
io.of('/mmcc').on('connection',function(socket){
	console.log('socket to /mmcc connected')

	socket.on('calltomentor',function(ma){
		mentee=ma.id;
		socket.broadcast.to(mentor).emit('menteerequestaccepted',{menteeid:mentee});
	});

	socket.on('mentoridsent',function(ma){
		mentor=ma.socketid;
	});

	socket.on('getelementlist',function(ma){
		sf.getinfodb('select distinct pstage,eleprbs, b.vidaddr from defele as a join videocont as b on a.elevideo=b.id where crsname="'+ma.crsname+'"', function(mb){
			socket.emit('sentelementlist',{elelist:mb,crsname:ma.crsname});
		});
	});

	socket.on('getprblist',function(ma){
		sf.prbsetv2(ma.prblist,function(mb){
			socket.emit('sentprblist',{prblist:mb});
		});
	});
	
	socket.on('senttomentee',function(ma){
		sf.prbsetv2(ma.prbs,function(mb){
			//socket.broadcast.to().emit('receivedfrommentee',{id:ma.id});
			socket.broadcast.to(mentee).emit('getfrommentor',{crsname:ma.crsname,ele:ma.ele,prbs:mb,vidaddr:ma.vidaddr});
		});
	
	});

	socket.on('learningresultsent',function(ma){
		console.log(ma.prbstatepanel,ma.socketid);
		console.log(mentor);
		socket.broadcast.to(mentor).emit('learningresulttomentor',{menteeinfo:ma});
	});
});

var mucmlist=[];
io.of('/stream').on('connection',function(socket){
	console.log('here stream io connected!');
	socket.on('streamrespond',function(){
		mucmlist.push(socket.id);
		console.log('respond is connected with id is :'+socket.id);
	});
	ss(socket).on('streamtest',function(stream,data){
		console.log('streamtest Here');
		console.log(stream);
		//var rstream=ss.createStream();
		//ss(socket).emit('streamtestres',[rstream,{data:'data'}]);
		//stream.pipe(rstream);
	});
});
var voicepeerlist=[];
var connectedstatus=[];
function checkuser(csts,userinfo){
	var sa=0;
	for(var ia=0; ia<csts.length; ia++){
		if(csts[ia][0]==userinfo.userid){
			sa=1;
			break;
		}
	}
	if(sa==0){
		return [0,0];// it does not exist
	}else{
		return [1,ia]; // it does exist
	}
		
}
io.on('connection',function(socket){

	socket.on('mucminitialstatus',function(){
		io.emit('mucmresidsent',{csts:connectedstatus});
	});

	socket.on('mucmcallerreset',function(reset){
		io.emit('mucmcallerresetcaller',{peerid:reset.peerid});
	});
	socket.on('mucmpeeridsent',function(mps){
	
		console.log(connectedstatus);		
		if(!checkuser(connectedstatus,mps)[0]){
			connectedstatus.push([mps.userid,mps.peerid])
			io.emit('mucmresidsent',{csts:connectedstatus});
		}else{
			for(var ia=0; ia<connectedstatus.length; ia++){
				if(connectedstatus[ia][0]==mps.userid){
				sa=1;
				break;
			}
			connectedstatus[ia][1]=mps.peerid;
			io.emit('mucmresidsent',{csts:connectedstatus});
	}


		}
		
	});

	socket.on('peeridsent',function(peerid){
		voicepeerlist.push(peerid);
		console.log('peer list is :'+voicepeerlist);
	});

});

var vdchmentorsocketid;
var vdchmenteesocketid;
io.of('/vdch').on('connection',function(socket){
	console.log('vdch connected');
	socket.on('vdchsendsocketid',function(ma){
		if(ma.userkind==0){
			siesmentorsocketid=ma.socketid;
			console.log('socketid of mentor is received : '+vdchmentorsocketid);
			
		}else if(ma.userkind==1){
			siesmenteesocketid=ma.socketid;
			client.tokens.create().then(token=>{
				socket.emit('vdchsendsocketidafter',{iceservers:token.iceServers});
				console.log('socketid of mentee is received : '+vdchmenteesocketid);
			});


		}else{
			console.log('error from getting socket id of mentor or mentee');
		}
	});
	socket.on('webrtctoservernewicecandidate',function(a){
		if(a.destination=='toresponder'){
			socket.broadcast.to(siesmenteesocketid).emit('webrtctorespondernewicecandidate',{newicecandidate:a.newicecandidate});
		}else{
			socket.broadcast.to(siesmentorsocketid).emit('webrtctocallernewicecandidate',{newicecandidate:a.newicecandidate});
		}
	});

	socket.on('webrtccallertoserver',function(a){
		socket.broadcast.to(siesmenteesocketid).emit('webrtcservertoresponder',{offer:a.offer});
		console.log('inserver from mentor to mentee offer is transferred');
	});
	socket.on('webrtcrespondertoserver',function(a){
		socket.broadcast.to(siesmentorsocketid).emit('webrtcservertocaller',{answer:a.answer});
	});


});	





app.get('/', function(req, res) {
	if(!req.session.num){
		req.session.num=1;
	}else{
		req.session.num +=1;
	}

	res.render('frontpage',{logincode:req.body.logincode});

});

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
	
});
app.get('/chattest', function(req, res) {
	res.render('cdctchat');
});

app.get('/test/redirect',function(req,res){
	console.log('he comes');
	res.redirect('https://www.naver.com');
});

app.get('/audiocall', function(req, res) {
	res.render('audiocall');
});

app.get('/audiocall/choicepage', function(req, res) {
	res.render('audcchoicepage');
});

app.get('/audiocall/choicepage/callerpage', function(req, res) {
	res.render('audccallerpage',{plist:voicepeerlist});
});
app.get('/audiocall/choicepage/anspage', function(req, res) {
	res.render('audcanspage');
});
app.get('/vdrg/cameracheck',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('vdrg/cameracheck');
		}
	
	});

});


app.get('/vdrg/teacherstart',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			sf.getinfodb('select prbid,createdate,timepassed,username from mmcphomework where createdate >= date_add(now(),interval -8 day) union select prbid, createdate,timepassed,username from mmcppic where createdate >= date_add(now(), interval -8 day)',function(b){
			//sf.getinfodb('select prbid,createdate,timepassed,username from mmcphomework',function(b){
			sf.getinfodb('select pm.username,pm.Displayname from prismusers as pm join mmttconnection as mm on mm.childcol=pm.username  where mm.conopt=0 and mm.parentcol="'+req.user.username+'" and pm.position=11 order by pm.userregi asc',function(a){
		//	sf.getinfodb('select mm.parentcol,rd.username,rd.hisopt, ps.solvekind as solvekindde,pr.solvekind as solvekindhw,rd.createdate from psreconnect as ps right join rdcthistory as rd on ps.solvepic=rd.numid join mmttconnection as mm on mm.childcol=rd.username left join psreconnect as pr on pr.solvepic=rd.cptinfo where rd.createdate >= date_add(now(), interval -8 day) and mm.parentcol="'+req.user.username+'"',function(c){
			sf.getinfodb('select rd.createdate, rd.username,ps.solvekind,ps.createdate as evaldate,ps.ratingdetail from rdcthistory as rd join psreconnect as ps on ps.solvepic=rd.cptinfo join mmttconnection as mm on mm.childcol=rd.username where rd.createdate>= date_add(now(), interval -8 day) union select rd.createdate, rd.username, ps.solvekind, ps.createdate as evaldate, ps.ratingdetail from rdcthistory as rd join psreconnect as ps on ps.solvepic=rd.numid join mmttconnection as mm on mm.childcol = rd.username where rd.createdate >= date_add(now(), interval -8 day) union select rd.createdate, rd.username, ps.solvekind, ps.createdate as evaldate, ps.ratingdetail from rdcthistory as rd left join psreconnect as ps on ps.solvepic=rd.cptinfo left join psreconnect as pss on pss.solvepic=rd.numid join mmttconnection as mm on mm.childcol=rd.username where rd.createdate>= date_add(now(), interval -8 day)  and pss.solvepic is null',function(c){
				res.render('teacherstart',{userinfo:req.user,hwdata:b,stdlist:a,psred:c});
			});
			});

			});

		}
	
	});

});
app.get('/vdrg/userstart',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			sf.getinfodb('select prbid,createdate,timepassed from mmcphomework where username="'+req.user.username+'" union select prbid, createdate,timepassed from mmcppic where username="'+req.user.username+'"',function(b){
				res.render('userstart',{userinfo:req.user,hwdata:b});
			});

		}
	
	});

});

app.get('/streamtest', function(req, res) {
	res.render('cdctstream');
});



app.get('/mucm',function(req,res){
	res.render('mucm/mucmhome');
});

app.get('/mucm/caller',function(req,res){
	res.render('mucm/mucmcaller',{mucmlist:mucmlist});
});

app.get('/mucm/responder',function(req,res){
	res.render('mucm/mucmresponder');
});


var mucmresponder;
var mucmcaller;
io.of('/mucm').on('connection',function(socket){
	console.log('mucm connected');


	socket.on('webrtctoservernewicecandidate',function(a){
		if(a.destination=='toresponder'){
			socket.broadcast.to(mucmresponder).emit('webrtctorespondernewicecandidate',{newicecandidate:a.newicecandidate});
		}else{
			socket.broadcast.to(mucmcaller).emit('webrtctocallernewicecandidate',{newicecandidate:a.newicecandidate});
		}
	});

	socket.on('mucmsocketidregister',function(a){
		if(a.user=='caller'){
			mucmcaller=a.socketid;
			console.log('mucmmentor id is registered'+mucmcaller);
		}else if(a.user=='responder'){
			mucmresponder=a.socketid;
			console.log('mucmmentee id is registered'+mucmresponder);
		}


	});

	socket.on('mucmstartvideochat',function(){
		client.tokens.create().then(token=>{
			socket.emit('mucmstartvideochatafter',{iceservers:token.iceServers});
		});

	});
	socket.on('webrtccallertoserver',function(a){
		console.log('in_server, offer is transferred to mentee');
		socket.broadcast.to(mucmresponder).emit('webrtcservertoresponder',{offer:a.offer});
	});
	socket.on('webrtcrespondertoserver',function(a){
		socket.broadcast.to(mucmcaller).emit('webrtcservertocaller',{answer:a.answer});
	});
});










app.get('/mucm/mediatest',function(req,res){
	res.render('mucm/mucmmediatest');
});

app.get('/mucm/selfrespond',function(req,res){
	res.render('mucm/mucmselfrespond');
});



app.get('/mmcc/home',function(req,res){
	res.render('mmcc/mmcchome');
});

app.get('/mmcc/mentor',function(req,res){
	sf.getinfodb('select distinct crsname from defele',function(ma){
		res.render('mmcc/mmccmentor',{crslist:ma});
	});
	
});

app.get('/mmcc/mentee',function(req,res){
	res.render('mmcc/mmccmentee');
});


app.get('/sies/home',function(req,res){
	res.render('sies/sieshome');
});

app.get('/sies/mentor',function(req,res){
	res.render('sies/siesmentor');
});

app.get('/sies/mentor/display',function(req,res){
	var userid=req.query.userid;
	var resultid=req.query.resultid;
	console.log(userid,resultid);
	res.render('sies/siesmentordisplay');
});

app.get('/sies/mentee',function(req,res){
	res.render('sies/siesmentee');
});




// display communication record 
app.get('/sies/commrecord',function(req,res){
	sf.getinfodb('select * from commrecord',function(ma){
		res.render('sies/commrecord',{record:ma});
		
	});
});


app.get('/admin',function(req,res){
	if(!req.session.num){
		req.session.num=1;
	}else{
		req.session.num +=1;
	}

	sf.LoginCheck(req.user,0,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('cdctadmin',{sessiontest:req.session.num,user:req.user});
		}
	
	});



});

app.get('/student',function(req,res){
	res.send('student');
});


//password change
app.get('/mypage/passwordchange',function(req,res){
	sf.LoginCheck(req.user,[11,12,0,1],function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mypage/passwordchange',{userinfo:req.user});
		}
	
	});
})


io.of('/mypage').on('connection',function(socket){
	console.log('mypage connected');

	socket.on('mypagesetpassword',function(a){
		console.log(a);
		sf.getinfodb('select password from prismusers where username="'+a.username+'"',function(b){
			if(b.length==0){
				var msg='You are not logged. login again';
				socket.emit('mypagesetpasswordafter',{code:0,msg:msg});
			}else if(b.length==1){
				if(b[0].password==md5(a.currpassword)){
					var msg='password is changed successfully';
					sf.getinfodb('update prismusers set password="'+md5(a.repassword)+'" where username="'+a.username+'"',function(){
						socket.emit('mypagesetpasswordafter',{code:1,msg:msg});
					});
					
				}else{
					var msg='You insert Incorrect password';
					socket.emit('mypagesetpasswordafter',{code:2,msg:msg});
				}
			}else{
				var msg='Unexpected error';
				console.log('unexpected error in mypage change password');
				socket.emit('mypagesetpasswordafter',{code:3,msg:msg});
			}
		});
	});
	
});


//login

app.get('/login',function(req,res){
	res.render('login');
	console.log(req.flash());
});


app.get('/log/home',function(req,res){
	res.render('log/loghome');
});
app.get('/log/login',function(req,res){

	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			fs.readFile('./log/userlogin.log','utf8',function(err,data){
				res.render('log/login',{data:data.split('\n'),userinfo:req.user});
			});
		}
	
	});

});

app.get('/log/pagerefresh',function(req,res){
	fs.readFile('./log/userpagerefresh.log','utf8',function(err,data){
		res.render('log/pagerefresh',{data:data.split('\n')});
	});
});

app.get('/log/mmcphomework',function(req,res){
	fs.readFile('./log/usermmcphomework.log','utf8',function(err,data){
		res.render('log/mmcphomeworklog',{data:data.split('\n'),userinfo:req.user});
	});
});
app.get('/log/socketcheck',function(req,res){
	fs.readFile('./log/socketlog.log','utf8',function(err,data){
		res.render('log/socketlog',{data:data.split('\n')});
	});
});
app.get('/log/socketidchange',function(req,res){

	fs.readFile('./log/socketidchange.log','utf8',function(err,data){
		res.render('log/socketidchange',{data:data.split('\n')});
	});
});

app.get('/log/foreverout',function(req,res){
	fs.readFile('./log/foreverout.log','utf8',function(err,data){
		res.render('log/foreverout',{data:data.split('\n')});
	});
});


app.get('/maintainsystem/sync',function(req,res){

	sf.LoginCheck(req.user,0,function(err){
		if(err){
			res.send(err);
		}else{
			fs.readFile('./syncserver/synclog.txt','utf8',function(err,data){
				res.render('log/synclog',{data:data.split('\n')});
			});
		}
	
	});



});

io.of('/maintainsystem').on('connection',function(socket){
	console.log('maintainsystem connected');
	socket.on('syncturnon',function(a){
		console.log('syncturnon');

		var exec = require('child_process').exec;

		var child0=exec('./syncserver/mgMain_awsAUX.sh '+a.targetday,function(err,stdout,stderr){if(err){throw err;}else{console.log(`${stdout}`);console.log(`${stderr}`)}});




		/*
		const { exec } = require('child_process');
		exec('./syncserver/mgMain_awsAUX.sh', (err,stdout,stderr)=>{
			if(err){
				console.log(err)
			} else {
				console.log(`stdout:${stdout}`);
				console.log(`stderr:${stderr}`);
			}
		});*/
		//var child=c('./syncserver/mgMain_awsAUX.sh',function(err,stdout,stderr){if(err){throw err;}});
	});

		//var child0=exec('cp ./spam/crtfromweb/'+refresh+'.js ./spam/',function(err,stdout,stderr){if(err){throw err;}});
		//var child = exec('cp -rf ./spam/*.js ./public/jscontent',function(err,stdout,stderr){ if(err){throw err;}});

});



app.get('/auth/register',function(req,res){
	res.render('register',{registercode:req.query.registercode});
});
var regi=io.of('/regi');


regi.on('connection',function(socket){
	socket.on('checkusernameduplicate',function(a){
		sf.getinfodb('select * from prismusers',function(b){
			var chk=0;
			for(var ia=0; ia<b.length; ia++){
				if(b[ia].username==a.username){
					chk=1;	
					break;
				}
			}
			socket.emit('checkusernameduplicateafter',{chk:chk});
		});
	});
});
app.post('/login',
	//passport.authenticate('local',{successRedirect:'/',
	passport.authenticate('local',{
					failureRedirect: '/login',
					failureFlash: true}),function(req,res){
		var msg=sf.nodetime()+' - username: '+req.user.username+',  position: '+req.user.position+'\n';
		if(req.user.position===0){
			res.redirect('/admin');
			fs.appendFile('./log/userlogin.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});

		}else if(req.user.position===11){//11
			res.redirect('/vdrg/userstart');
			//res.redirect('/vdrg/userinterface');
			fs.appendFile('./log/userlogin.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});


		}else if(req.user.position===11){
			res.redirect('/nusd/mentee/gospace');
		}else if(req.user.position===12){
			res.redirect('/mmcp/interface');
		}else if(req.user.position===1){//1
			//res.redirect('/vdrg/mentorcenter');
			res.redirect('/vdrg/teacherstart');
				
			fs.appendFile('./log/userlogin.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});

		}else if(req.user.position===1){
			res.redirect('/nusd/mentor');
		}else {
			res.send('system error in login field');
		}

});
app.post('/auth/register',function(req,res){
var username = req.body.username;
var upassword = md5(req.body.password);
var apassword = md5(req.body.passwordagain);
var uemail = req.body.phoneNumber;
var udipname= req.body.displayName;
var uaffiliation=req.body.affiliation;
var register = {username:username, password:upassword, email:uemail, DisplayName:udipname,position:11,regdate:sf.nodetime()};
//var register = {username:username, password:upassword, email:uemail, DisplayName:udipname, affiliation:uaffiliation};


	sf.getinfodb_par('insert into prismusers SET ?',register,function(err,result){
		if(err.warningCount){
			res.send(err);
		}else{
			res.send('<h2>Id Created successfully.... </h2><div><a href="/"> Click to Login </a></div>');
			//res.redirect('/st/ecufrontpg?userid='+username+'&displayname='+udipname);
		}
	});

});



//drawing
app.get('/drawing/addfunc',function(req,res){
	res.render('drawing/addfunc');
});
app.get('/drawingtest',function(req,res){
	res.render('drawing/drawingtst3')
});

app.get('/drawing/adminfeed',function(req,res){
	res.render('drawing/adminfeed');
});
app.get('/drawing/drawingking',function(req,res){
	res.render('drawing/drawingking',{roomid:req.query.roomid});
});

app.get('/drawing/drawingfield',function(req,res){
	res.render('drawing/drawingfield',{kingid:req.query.roomid})
});



app.get('/drawing/mdn',function(req,res){
	res.render('drawing/mdntest');
});

app.get('/drawing/mousedrawing',function(req,res){
	res.render('drawing/mousedrawing');	
});

// number send project
app.get('/nusd/createtext',function(req,res){
	sf.getinfodb('select * from textlist as a left join n_terminal as b on a.textid=b.terminalid', function(r){
		res.render('nusd/createtext',{textlist:r});
	});
});


app.post('/nusd/createtext',function(req,res){
	var texttitle=req.body.texttitle;
	sf.GetObjIdv2('ttt','textlist','textid',10,function(r){
		var textl = {texttitle:texttitle, textid:r}
		sf.getinfodb_par('insert into textlist set ?',textl,function(){
			res.redirect('/nusd/createtext');
		});
	});
});

app.get('/nusd/terminalconnect',function(req,res){
	res.render('nusd/terminalconnect',{oid:req.query.oid});
});

app.post('/nusd/terminalconnect',function(req,res){
	var terminal = {startnum:req.body.startnum, endnum:req.body.endnum, terminalid:req.body.oid};
	sf.getinfodb_par('insert into n_terminal set ?',terminal,function(){
		res.redirect('/nusd/createtext');
	});
});

app.get('/nusd/mentor',function(req,res){
		//res.render('nusd/mentor',{r:r,userlist:nusdmanage.userlist});

	//sf.getinfodb('select * from textlist as a left join n_terminal as b on a.textid=b.terminalid', function(r){
	//		res.render('cpt/cptlecprblist',{rs:rs});
//	sf.getinfodb('select cptid,prblist,listinfo,createdate from cptproblemset',function(rs){
		res.render('nusd/mentor',{userlist:nusdmanage.userlist});
	//});



});
app.get('/nusd/mentor/cptpanel',function(req,res){
	sf.getinfodb('select cptid,prblist,listinfo,createdate from cptproblemset',function(rs){
		res.render('nusd/cptpanel',{userlist:nusdmanage.userlist,rs:rs});
	});

});
app.get('/nusd/mentee',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('nusd/mentee',{userinfo:req.user});
			console.log(req.user);
		}
	
	});
});
app.get('/nusd/mentee/gospace',function(req,res){
	console.log(req.session);
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
	
			res.render('nusd/gospace',{userinfo:req.user});
		}
	
	});


});
app.get('/nusd/mentee/img',function(req,res){
	res.render('nusd/menteeimg',{imgaddr:req.query.imgaddr});
});

var nusdmanage={userlist:[]};
io.of('/nusd').on('connection',function(socket){
	console.log('nusd connected');



	socket.on('sendquestionpictoserver',function(a){
		console.log('sendquestion');
		socket.broadcast.to(nusdmanage.mentorsocketid).emit('sendquestionpictomentor',{picname:a.picname});
	});


	socket.on('rankcall',function(){
		sf.getinfodb('select * from rkconnect as a join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol order by rkorder asc, r2order asc',function(a){
		//sf.getinfodb('select * from rkconnect as a join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol order by rkorder asc',function(a){
			socket.emit('rankcallafter',{a:a});
		});
	});

	socket.on('reloadusernote',function(a){
		sf.getinfodb('select * from usernote where username="'+a.username+'" order by udate desc',function(b){
			var chk=0; 
			var num;
			for(var ia=0; ia<nusdmanage.userlist.length; ia++){
				if(nusdmanage.userlist[ia].username==a.username){
					chk=1;
					num=ia;
					break;
				}
			}

			if(chk==1){
				socket.emit('sendusernote',{a:b});
				console.log('Usernote to mentee');
			}else{
				console.log('Usernote user is not exist');
			}


		});
	});



	socket.on('nusdcallprblist',function(plist){
		var prblist=plist.plist.split(',');
		sf.prbsetv2(prblist,function(prbcon){
			socket.emit('nusdgetprblist',{prbcon:prbcon});
		})
	});
	socket.on('nusdsocketidregister',function(a){
		if(a.position==0){
			var ma=0;
			for(var ia=0; ia<nusdmanage.userlist.length; ia++){
				if(nusdmanage.userlist[ia].username==a.username){
					ma=1;
					break;
				}
			}

			if(ma!=1){
				nusdmanage.userlist.push(a);
				socket.broadcast.to(nusdmanage.mentorsocketid).emit('mentoruserlistrefresh',{userlist:nusdmanage.userlist});
			}else{
				nusdmanage.userlist[ia].socketid=a.socketid;
			}
		}else if(a.position==2){
			nusdmanage.mentorsocketid=a.socketid;
		}

		console.log(nusdmanage);
	});


	socket.on('sendmentortorefresh',function(){
	});

	socket.on('numbersent',function(a){
		//send to mentee
	
		var chk=0; 
		for(var ia=0; ia<nusdmanage.userlist.length; ia++){
			if(nusdmanage.userlist[ia].username==a.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(nusdmanage.userlist[ia].socketid).emit('tomenteenusd',{nusdlist:a.nusdlist,opt:a.opt,prbobj:a.prbobj});
			//socket.broadcast.to(siesmenteesocketid).emit('getlearningmaterialfrommentor',{crsname:ma.crsname,ele:ma.ele,prbs:mb,vidaddr:ma.vidaddr});
			console.log('drawing sent');
		}else{
			console.log('user is not exist');
		}
	});
	//socket.emit('copypics',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat});
	
	socket.on('mentortomenteedraw',function(ma){
		console.log('nusd : '+ma.pos[0], ma.pos[1]);
		var chk=0; 
		for(var ia=0; ia<nusdmanage.userlist.length; ia++){
			if(nusdmanage.userlist[ia].username==ma.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(nusdmanage.userlist[ia].socketid).emit('copypicsofmentor',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption});
			console.log('Number sent');
		}else{
			console.log('user is not exist');
		}

	});
	socket.on('mentortomenteedrawerase',function(ma){
		var chk=0; 
		for(var ia=0; ia<nusdmanage.userlist.length; ia++){
			if(nusdmanage.userlist[ia].username==ma.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(nusdmanage.userlist[ia].socketid).emit('eraseofmentor',{mode:ma.mode});
			console.log(ma.mode);
			//socket.broadcast.to(siesmenteesocketid).emit('getlearningmaterialfrommentor',{crsname:ma.crsname,ele:ma.ele,prbs:mb,vidaddr:ma.vidaddr});
			console.log('Number sent');
		}else{
			console.log('user is not exist');
		}


	});



	socket.on('menteetomentordraw',function(ma){
		console.log('nusd : '+ma.mousestat);
		//console.log('nusd : '+ma.pos[0], ma.pos[1]);
		
		socket.broadcast.to(nusdmanage.mentorsocketid).emit('copypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption});
	});

	socket.on('chattingtoserver',function(a){
		if(a.chatoption==0){
			var chk=0; 
			for(var ia=0; ia<nusdmanage.userlist.length; ia++){
				if(nusdmanage.userlist[ia].username==a.username){
					chk=1;
					break;
				}
			}

			if(chk==1){
				socket.broadcast.to(nusdmanage.userlist[ia].socketid).emit('chattingtouser',{chatoption:0,chatmsg:a.chatmsg});
				//socket.broadcast.to(siesmenteesocketid).emit('getlearningmaterialfrommentor',{crsname:ma.crsname,ele:ma.ele,prbs:mb,vidaddr:ma.vidaddr});
				console.log('message to mentee');
			}else{
				console.log('user is not exist');
			}
		
		}else if(a.chatoption==1){
			socket.broadcast.to(nusdmanage.mentorsocketid).emit('chattingtouser',{chatoption:1,chatmsg:a.chatmsg,username:a.username});

		}else if(a.chatoption==2){
			socket.broadcast.to(nusdmanage.mentorsocketid).emit('chattingtouser',{chatoption:2,chatmsg:a.chatmsg,username:a.username});
		}else if(a.chatoption==3){
			var chk=0; 
			for(var ia=0; ia<nusdmanage.userlist.length; ia++){
				if(nusdmanage.userlist[ia].username==a.username){
					chk=1;
					break;
				}
			}

			if(chk==1){
				socket.broadcast.to(nusdmanage.userlist[ia].socketid).emit('chattingtouser',{chatoption:3,chatmsg:a.chatmsg});
				//socket.broadcast.to(siesmenteesocketid).emit('getlearningmaterialfrommentor',{crsname:ma.crsname,ele:ma.ele,prbs:mb,vidaddr:ma.vidaddr});
				console.log('self message to mentee');
			}else{
				console.log('user is not exist');
			}


		}
	});
});
app.post('/qprbupload',function(req,res){
	console.log('qprbupload xhr');
	var form = new formidable.IncomingForm();
	//form.uploadDir = path.join(__dirname,'public/prismpics/');
	form.keepExtensions= true;

	form.on('fileBegin',function(name,file){
		var ext=file.originalFilename.split('.')[file.originalFilename.split('.').length-1]
		file.filepath = __dirname+'/public/prismpics/'+name+'.'+ext;
		file.newFilename=name+'.'+ext;
		sf.getinfodb('update prb set prbpickor="/prismpics/'+name+'.'+ext+'" where prbid="'+name+'"',function(){});
	});

	form.on('file',function(name,file){
		//console.log(name);
		//console.log(file);	
	});
	form.parse(req,function(a,b,c){//err,key_value1, keyvalue2;
		res.send('xhr qprb succeed');
	});
});

app.get('/mmcp/monitor',function(req,res){
	var username=req.query.username;
	if(Object.keys(req.query).length===0){
		var msg='Wrong Access  <a href="/">LogIn </a>'
		res.send(msg);
	}else{
		if(typeof req.query.username !== 'undefined'){
			var username=req.query.username;
			res.render('mmcp/mmcpmonitor',{username:username});
		//	res.render('mmcp/teacherhwcheck',{username:username,userinfo:req.user});

		}else{
			var msg='Wrong Access<a href="/">LogIn </a>'
			res.send(msg);
		}
	}

});

app.get('/mmcp/selectandprb',function(req,res){
	res.render('mmcp/selectprb')
});
app.get('/mmcp/prbprint',function(req,res){
	var prblist=req.query.prblist;
	sf.prbsetv2(prblist.split(','),function(prbcon){

		if(typeof req.query.prblist !== 'undeinfed'){
			res.render('mmcp/prbprint',{prbcon:prbcon})

		}else{
			var msg='Wrong Access<a href="/">LogIn </a>'
			res.send(msg);
		}

	});

});

app.post('/mmcphomework',function(req,res){
	console.log('mmcphomework xhr');
	form = new formidable.IncomingForm();

	//form.multiples = true;
	//form.uploadDir = path.join(__dirname,'public/nusd/screensave');
	form.uploadDir = path.join(__dirname,'public/usernote/mmcphomework');
	form.keepExtensions = true;
	form.parse(req,function(a,b,c){//err,key_value1, keyvalue2;
		//sf.GetObjId('uno','usernote',10,function(uid){
			var rinfo={roundnum:b.roundnum,timeallocated:b.timeallocated,operationid:b.operationid,mmcpconid:b.mmcpconid,mmcpid:b.mmcpid,prbid:b.prbid,mpicid:c.file.originalFilename,username:b.username,createdate:sf.nodetime(),mpicorder:b.picnum,timepassed:b.timepassed};
			sf.getinfodb_par('insert into mmcphomework SET ?',rinfo,function(){
				res.send('xhr mmcphomework succeed');
			});

		//});

	});
	form.on('fileBegin',function(name,file){
		file.filepath = __dirname+'/public/usernote/mmcphomework/'+file.originalFilename;
	});


});



app.post('/mmcp',function(req,res){
	console.log('mmcp xhr');
	form = new formidable.IncomingForm();

	//form.multiples = true;
	//form.uploadDir = path.join(__dirname,'public/nusd/screensave');
	form.uploadDir = path.join(__dirname,'public/usernote/mmcppic');
	form.keepExtensions = true;
	form.parse(req,function(a,b,c){//err,key_value1, keyvalue2;
		//sf.GetObjId('uno','usernote',10,function(uid){
			var rinfo={roundnum:b.roundnum,timeallocated:b.timeallocated,operationid:b.operationid,mmcpconid:b.mmcpconid,mmcpid:b.mmcpid,prbid:b.prbid,mpicid:c.file.originalFilename,username:b.username,createdate:sf.nodetime(),mpicorder:b.picnum,timepassed:b.timepassed, ans:b.ans,mmcpkind:b.mmcpkind};
			sf.getinfodb_par('insert into mmcppic SET ?',rinfo,function(){
				res.send('xhr mmcp succeed');
			});

		//});

	});
	form.on('fileBegin',function(name,file){
		file.filepath = __dirname+'/public/usernote/mmcppic/'+file.originalFilename;
		//file.path = __dirname+'/public/nusd/screensave/'+file.name
	});


});
app.post('/wrsswriting',function(req,res){
	console.log('wrsswriting');
	form = new formidable.IncomingForm();

	form.uploadDir = path.join(__dirname,'public/usernote/wrsswritingpic');
	form.keepExtensions = true;
	form.parse(req,function(a,b,c){//err,key_value1, keyvalue2;

		var rinfo={prbid:b.prbid, cptid:b.cptid,username:b.username,createdate:sf.nodetime(),mpicid:c.file.originalFilename,ansresult:b.ansresult};
		sf.getinfodb_par('insert into wrsswritingpic SET ?',rinfo,function(){
			res.send('succeed');
		});


	});
	form.on('fileBegin',function(name,file){
		file.filepath = __dirname+'/public/usernote/wrsswritingpic/'+file.originalFilename
		//file.path = __dirname+'/public/nusd/screensave/'+file.name
	});
	form.on('error',function(err){
		console.log(err);
	});
	form.on('file',function(name,file){
	});
})

//xhr
app.post('/xhr',function(req,res){
	console.log('xhr');
	var photos = [],
	form = new formidable.IncomingForm();

	//form.multiples = true;
	//form.uploadDir = path.join(__dirname,'public/nusd/screensave');
	form.uploadDir = path.join(__dirname,'public/usernote');
	form.keepExtensions = true;
	form.parse(req,function(a,b,c){//err,key_value1, keyvalue2;

		sf.GetObjId('uno','usernote',10,function(uid){
			var rinfo={uid:uid,imgaddr:'/usernote/'+c.file.originalFilename,username:b.username,udate:sf.nodetime()};
			sf.getinfodb_par('insert into usernote SET ?',rinfo,function(){
				res.send('succeed');
			});

		});

	});
	form.on('fileBegin',function(name,file){
		file.filepath = __dirname+'/public/usernote/'+file.originalFilename
		//file.path = __dirname+'/public/nusd/screensave/'+file.name
	});
	form.on('error',function(err){
		console.log(err);
	});
	form.on('file',function(name,file){
		//fs.rename(file.path, form.uploadDir+'/'+file.name);
		/*
		if(photos.length ===3){
			fs.unlink(file.path);
			return true;
		}
		
		var buffer = null,
		type = null,
		filename = '';

		buffer = readChunk.sync(file.path, 0, 262);
		type = fileType(buffer);
		
		if(type!==null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')){
			filename = Date.now() + '-' + file.name;
			photos.push({
				status:true,
				filename: filename+'.'+type.ext,
				type: type.ext,
				publicPath: 'uploads/'+ filename
			});
		}else {
			console.log('2');
			photos.push({
				status:false,
				filename:file.name,
				message: 'Invalid file type'
			});
			fs.unlink(file.path);
		}*/
	});
});



app.get('/nusd/screenimage',function(req,res){
	const statfolder='./public';
	const currentfolder='/nusd/screensave/';
	const imgfolder = statfolder+currentfolder;

	var screenlist=[];
	fs.readdir(imgfolder,(err,files)=>{
		files.forEach(file=>{
			console.log(file);
			screenlist.push(file);
		})
		res.render('nusd/screenimg',{currentfolder:currentfolder,screenlist:screenlist})
	});
});

//
app.get('/admin/eer',function(req,res){
	var stchk=req.query.stchk;
	if(stchk==0 || typeof stchk == 'undefined'){
		res.render('eer/eerini');
	}else if(stchk==1){
		sf.EERGetSlkList(function(slab,block){
			res.render('eer/eercrtslk',{slab:slab,block:block});
		});
	}else if(stchk==2){
		var slabid=req.query.slabid;
		sf.EERConnectSlabToBlock(slabid,function(blocklist){
			res.render('eer/eerconnectslk',{blocklist:blocklist,slabid:slabid});
		});
	}else if(stchk==3){
		sf.EERGetSlkList(function(slab,block){
			res.render('eer/eerslablist',{slab:slab});
		});
	}else if(stchk==4){
		var slabid=req.query.slabid;
		sf.EERBlocklistOfSlab(slabid,function(blocklist){
			res.render('eer/eerblocklevel',{blocklist:blocklist,slabid:slabid});
		});
	}else if(stchk==5){
		var slkid=req.query.slkid;
		sf.EERGetCaseList(slkid,function(caselist){
			res.render('eer/eerpickcaselist',{caselist:caselist,slkid:slkid});
		});
	}else if(stchk==6){
		sf.EERGetSlkList(function(slab,block){
			res.render('eer/eerpfoslablist',{slab:slab});
		});
	}else if(stchk==7){
		var slabid=req.query.slabid;
		sf.EERBlocklistOfSlab(slabid,function(blocklist){
			res.render('eer/eerpfoblocklist',{blocklist:blocklist,slabid:slabid});
		});
	}else if(stchk==8){
		var slkid=req.query.slkid;
		var slabid=req.query.slabid;
		sf.EERGetCaseList(slkid,function(caselist){
			res.render('eer/eerpfocaselist',{caselist:caselist,slkid:slkid,slabid:slabid});
		});
	}else if(stchk==9){
		var caseid=req.query.caseid;
		var slkid=req.query.slkid;
		sf.PFO(slkid,caseid,function(ra){
			console.log(ra);
			res.render('eer/eerpfodisplay');
		});


	}
});

var eer=io.of('/eer');
eer.on('connection',function(socket){
	console.log('eer connected!!');
	socket.on('eeradd',function(eer){
		sf.EERadd(eer.pcsid);
		socket.emit('rsteeradd');
	});
	socket.on('eerupdate',function(eer){
		sf.EERUpdate(eer.pcsid,eer.recvnum);
		socket.emit('rsteerupdate');
	});
	socket.on('eeromit',function(eer){
		sf.EEROmit(eer.caseid,eer.cslevel);
		socket.emit('rsteeromit');
	});

});

var pls=io.of('/pls');
pls.on('connection',function(socket){
	console.log('pls connected!!');
	socket.on('plsadd',function(pls){
		sf.PLSadd(pls.pcsid);
		socket.emit('rstplsadd');
	});
	socket.on('plsupdate',function(pls){
		sf.PLSUpdate(pls.pcsid,pls.recvnum);
		socket.emit('rstplsupdate');
	});
	/*socket.on('plsremove',function(a){
		sf.PLSRemove(pls.pcsid,pls.recvnum);
		socket.emit('rstplsremove');
	});*/
	socket.on('plspcpupdate',function(b){
		var str={pcsinfo:b.newinput};
	 	sf.getinfodb_par('update pcscate SET ? where pcsid="'+b.pcpid+'"',str,function(rst){});
		socket.emit('rstplspcpupdate');
	});
	socket.on('plssamelevel',function(pls){
		sf.PLSSameUpdate(pls.pcsid,pls.recvnum);
		socket.emit('rstplssamelevel');
	});
	socket.on('plsclear',function(){
		sf.getinfodb('update pcscate set cslevel=0 where pcsopt="csindex"',function(rs){});
	});
	socket.on('plsregistercrpcp',function(pls){
		//sf.getinfodb('',function(rs){});
		str={normid:pls.caseid,cateopt:'case_crpcp',childitem:pls.pcpid};
		sf.getinfodb_par('insert pcsconnect SET ?',str,function(rs){});
		socket.emit('rstplsregistercrpcp');
		
	});
	socket.on('removecrpcp',function(pls){
		sf.getinfodb('delete from pcsconnect where normid="'+pls.caseid+'" and childitem="'+pls.pcpid+'" and cateopt="case_crpcp"',function(rs){});
		socket.emit('rstremovecrpcp');
	});
	socket.on('plsomit',function(pls){
		sf.PLSOmit(pls.caseid,pls.cslevel);
		socket.emit('rstplsomit');
	});
});



app.get('/admin/cpt',function(req,res){///작업 다시; 수식을 불러올때 너무 느리다. 

	sf.LoginCheck(req.user,0,function(err){
		if(err){
			res.send(err);
		}else{

			if(Object.keys(req.query).length===0){
				var msg='Login First Please <a href="/">LogIn </a>'
				res.send(msg);

			}else{
				var stchk=req.query.stchk;
				if(typeof stchk=='undefined' || stchk=='0'){
					res.render('cpt/cpt');
				}else if(stchk=='1'){
					res.render('cpt/cptprbset');
					//sf.getinfodb('select pcsid,pcsinfo from pcscate where pcsopt="csindex" order by numid desc',function(pcs){
						//sf.PCSPickingFreePrbcon(function(unassprbcon,unassprbidstr){
						//sf.NUSDpickingFreeprb(function(fl)
							//res.render('cpt/cptprbset',{pcs:pcs,unassstr:unassprbidstr,unassprb:fl});
						//});
						//});
					//});
					
					
				}else if(stchk=='2'){
					sf.getinfodb('select cptid,prblist,listinfo,createdate from cptproblemset',function(rs){
						res.render('cpt/cptlecprblist',{rs:rs});
					});
				}else if(stchk=='3'){
					
					if(typeof req.query.listinfo!=='undefined' && typeof req.query.prblist!='undefined'){
						var listinfo=req.query.listinfo;
						var prblist=req.query.prblist;
						var o1prblist=prblist.split(',');
						sf.prbsetv2(o1prblist,function(prbcon){
							res.render('cpt/cptprbcon',{prbcon:prbcon});
						});
					}else{
						var msg='Login First Please <a href="/">LogIn </a>'
						res.send(msg);
					}
				}else if(stchk=='4'){
					//res.render('cpt/cptr2create');
					res.render('cpt/r2create');
				}else if(stchk=='5'){
					if(typeof req.query.plist!=='undefined' && typeof req.query.cptid!='undefined'){
						var plist=req.query.plist;
						var cptid=req.query.cptid;
					}else{
						var plist=0;
						var cptid=0;
					}

					res.render('cpt/order',{plist:plist,cptid:cptid})
				}else if(stchk=='6'){
					res.render('cpt/r1order');
				}else if(stchk=='7'){
					res.render('cpt/r2order');
				}else if(stchk=='8'){
					res.render('cpt/r3create');
				}else if(stchk=='9'){
					sf.getcptStructure(function(a){
						res.render('vdrg/hwuserhistory',{r2list:a[0].r2list,username:{username:'wjdtjrgus'}});
						//res.render('cpt/contentsmap',{r2list:a[0].r2list});
					});
				}else if(stchk=='10'){
					res.render('vdrg/userclasshistory',{userinfo:{username:'wjdtjrgus'}});


				}


			}
		}
	});
	
});

app.get('/r2tor1/form',function(req,res){
	var rd=req.query.rd;
	if(rd==0){
		var prblist=req.query.prblist;
		var listinfo=req.query.listinfo;
		if(listinfo!=''){
		sf.GetObjId('cpt','cptproblemset',10,function(cptid){
			var crsdt={prblist:prblist,listinfo:listinfo,createdate:sf.nodetime(),cptid:cptid,userid:'shjung'};
			sf.getinfodb_par('insert into cptproblemset SET ?',crsdt,function(rst){});
		});
		}
	}else if(rd==1){
		var prblist=req.query.prblist;
		var listinfo=req.query.listinfo;
		var cptid=req.query.cptid;
		var crsdt={prblist:prblist,listinfo:listinfo};
		 sf.getinfodb_par('update cptproblemset SET ? where cptid="'+cptid+'"',crsdt,function(rst){
		});
	}

	res.redirect('/admin/cpt?stchk=4');
});


app.get('/admin/cpt/form',function(req,res){
	var rd=req.query.rd;
	if(rd==0){
		var prblist=req.query.prblist;
		var listinfo=req.query.listinfo;
		if(listinfo!=''){
		sf.GetObjId('cpt','cptproblemset',10,function(cptid){
			var crsdt={prblist:prblist,listinfo:listinfo,createdate:sf.nodetime(),cptid:cptid,userid:'shjung',cptoption:'show'};
			sf.getinfodb_par('insert into cptproblemset SET ?',crsdt,function(rst){});
		});
		}
	}else if(rd==1){
		var prblist=req.query.prblist;
		var listinfo=req.query.listinfo;
		var cptid=req.query.cptid;
		var crsdt={prblist:prblist,listinfo:listinfo};
		 sf.getinfodb_par('update cptproblemset SET ? where cptid="'+cptid+'"',crsdt,function(rst){
		});
	}else if(rd==2){
		var cptid=req.query.cptid;
		var crsdt={cptid:cptid};
		 sf.getinfodb('delete rk,cpt from rkconnect as rk join  cptproblemset as cpt on rk.childcol=cpt.cptid where rk.conkind="rc21" and cpt.cptid="'+cptid+'"',function(rst){});
	}else{
		res.send('Error');
	}

	res.redirect('../cpt?stchk=1');
	
});

var cpt=io.of('/cpt');
cpt.on('connection',function(socket){
	console.log('CPT Connected');

	socket.on('cpdcallr0',function(a){
		
		//sf.getinfodb('select prblist,listinfo,cptid from cptproblemset', function(b){
		sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
		sf.prbsetv2(a.plist.split(','),function(plist){
			//socket.emit('cpdcallr0after',{plist:plist});
			socket.emit('cptprbcon',{crprbcon:plist, cps:b});
		});		
		});		

	});

	socket.on('cpdcallr1',function(a){
		sf.getinfodb('select * from rkconnect as rk join r2list as r2 on rk.parentcol=r2.r2id join cptproblemset as cpt on rk.childcol=cpt.cptid where r2.r2id="'+a.r2id+'" and rk.conkind="rc21" order by rk.rkorder', function(b){
			socket.emit('cpdcallr1after',{b:b});
		});
	});



	socket.on('cpdcallr2',function(a){
		sf.getinfodb('select r2.r2id, r2.r2listinfo from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id join r2list as r2 on rk.childcol=r2.r2id where r3.r3id="'+a.r3id+'" and rk.conkind="rc32" order by r2.r2order asc',function(b){
			socket.emit('cpdcallr2after',{b:b});
		});
	});



	socket.on('cpdcallr3',function(){
		sf.getinfodb('select * from r3list',function(a){
			socket.emit('cpdcallr3after',{a:a});	
		});

	});

	socket.on('unassr1',function(b){
		sf.R2toR1FreePicking(b.r3id,function(a){
			socket.emit('unassr1after',{a:a});
		});
	});

	socket.on('callunassprb',function(){
		sf.NUSDpickingFreeprb(function(fl){
		
			socket.emit('callunassprbafter',{fl:fl});
		});
	});
	socket.on('cptcallr1',function(a){
		sf.getinfodb('select * from rkconnect as rk join r2list as r2 on rk.parentcol=r2.r2id join cptproblemset as cpt on rk.childcol=cpt.cptid where r2.r2id="'+a.r2id+'" and rk.conkind="rc21" order by rk.rkorder', function(b){
			socket.emit('cptcallr1after',{b:b});
		});
	});


	socket.on('cptcallr2',function(a){
		sf.getinfodb('select r2.r2id, r2.r2listinfo from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id join r2list as r2 on rk.childcol=r2.r2id where r3.r3id="'+a.r3id+'" and rk.conkind="rc32" order by r2.r2order asc',function(b){
			socket.emit('cptcallr2after',{b:b});
		});
	});


	socket.on('cptcallr3set',function(){
		sf.getinfodb('select * from r3list',function(a){
			socket.emit('cptcallr3setafter',{a:a});	
		});
	});

	socket.on('modifyr3toaddr2',function(a){
		sf.getinfodb('delete from rkconnect where parentcol="'+a.r3id+'" and conkind="rc32"',function(){	
			var async=require('async');
			var count=0;
			
			var chosenlistL=a.chosenlist;
			async.whilst(
				function(callbackfunction){
					callbackfunction(null,count<chosenlistL.length)
					//return count<chosenlistL.length
				},
				function(cback){
					sf.GetObjId('conid','rkconnect',10,function(conid){
						var istr='"'+a.r3id+'","'+chosenlistL[count][0]+'","'+sf.nodetime()+'","'+count+'","'+conid+'","rc32"'
						sf.getinfodb('insert into rkconnect (parentcol, childcol, createdate, rkorder, conid, conkind) values ('+istr+')',function(b){
							count++;
							cback(null);
						});
					});

				},
				function(err){
					if(!err){
						console.log('succeed');
						socket.emit('modifyr3toaddr2after',{chosenlist:a.chosenlist,r3id:a.r3id});
					}else{
						console.log('cpt error',err);
					}
			});

		});
		
	});



	socket.on('listinfoeditforr3',function(a){
		sf.getinfodb('update r3list set listinfo="'+a.listinfo+'" where r3id="'+a.r3id+'"',function(){
			socket.emit('listinfoeditforr3after',{listinfo:a.listinfo, r3id:a.r3id});
		});
	});


	socket.on('callr3list',function(){
		sf.getinfodb('select a.listinfo,a.r3id, b.childcol, b.rkorder from r3list as a join rkconnect as b on a.r3id=b.parentcol where b.conkind="rc32"', function(a){
		sf.getinfodb('select * from r3list', function(b){
				
			//socket.emit('callr3listafter',{b:b});
			socket.emit('callr3listafter',{a:a,b:b});
		});
		});
	});



	socket.on('callr2listforr3',function(){
		sf.getinfodb('select * from r2list',function(a){
			socket.emit('callr2listforr3after',{a:a});
		});
	});

	socket.on('creater3',function(a){
		sf.GetObjId('r3id','r3list',10,function(r3id){
			var insertvar = {listinfo:a.listinfo, createdate:sf.nodetime(), r3id:r3id};
			sf.getinfodb_par('insert into r3list SET ? ',insertvar,function(){
				socket.emit('creater3after',{r3id:r3id,listinfo:a.listinfo});
			});

		});
	});




	socket.on('r2ordercallr2list',function(){
		//sf.getinfodb('select a.r2listinfo,a.r2id, b.childcol, b.rkorder from r2list as a join rkconnect as b on a.r2id=b.parentcol where b.conkind="rc21"', function(a){
		sf.getinfodb('select * from r2list order by r2order', function(a){
				
			socket.emit('r2ordercallr2listafter',{a:a});
		});
		//});
	});


	socket.on('establishOrderr2',function(a){
			var async=require('async');
			var count=0;
			async.whilst(
				function(callbackfunction){
					callbackfunction(null,count<a.r2list.length)
					//return count<a.r2list.length
				},
				function(cback){
						sf.getinfodb('update r2list set r2order="'+a.r2list[count][2]+'" where r2id="'+a.r2list[count][0]+'"',function(b){
							count++;
							cback(null);
						});

				},
				function(err){
					if(!err){
						console.log('succeed');
						socket.emit('establishOrderr2after');
					}else{
						console.log('cpt error',err);
					}
			});
	});





	socket.on('establishOrderr1',function(a){
		//sf.getinfodb('delete from rkconnect where parentcol="'+a.r2id+'" and conkind="rc21"',function(){	
			var async=require('async');
			var count=0;
			
			async.whilst(
				function(callbackfunction){
					callbackfunction(null,count<a.r1list.length);
					//return count<a.r1list.length
				},
				function(cback){
						sf.getinfodb('update rkconnect set rkorder="'+a.r1list[count][2]+'" where parentcol="'+a.r2id+'" and childcol="'+a.r1list[count][0]+'"',function(b){
							console.log(a.r1list[count])
							console.log(a.r2id)
							count++;
							cback(null);
						});

				},
				function(err){
					if(!err){
						console.log('succeed');
						socket.emit('establishOrderr1after');
					}else{
						console.log('cpt error',err);
					}
			});


		//});
		//console.log(a);

	});

	socket.on('establishOrderprb',function(a){
		sf.getinfodb('update cptproblemset set prblist="'+a.prbstr+'" where cptid="'+a.cptid+'"',function(){
			socket.emit('establishOrderprbafter');
		});
	});

	socket.on('levelCallr2list',function(){
		sf.getinfodb('select cp.listinfo as r1listinfo, cp.cptid as cptid, rl.r2id as r2id, rl.r2listinfo as r2listinfo, rk.rkorder as rkorder  from rkconnect as rk join r2list as rl on rk.parentcol=rl.r2id join cptproblemset as cp on rk.childcol=cp.cptid where conkind="rc21" order by rl.r2order asc',function(a){;
			socket.emit('levelCallr2listafter',{a:a})
		});
	});

	socket.on('levelplist',function(a){
		sf.prbsetv2(a.plist,function(plist){
			socket.emit('levelplistafter',{plist:plist});
		});		

	});
	socket.on('levelCallr1list',function(){
		sf.getinfodb('select cp.prblist,cp.cptid,cp.listinfo from cptproblemset as cp join rkconnect as rk on rk.childcol=cp.cptid where rk.conkind="rc21" order by cp.listinfo desc',function(a){
		//sf.getinfodb('select * from cptproblemset ',function(a){
			socket.emit('levelCallr1listafter',{a:a});
		});
	});
	socket.on('listinfoedit',function(a){
		sf.getinfodb('update r2list set r2listinfo="'+a.listinfo+'" where r2id="'+a.r2id+'"',function(){
			socket.emit('listinfoeditafter',{listinfo:a.listinfo, r2id:a.r2id});
		});
	});
	socket.on('modifyr2toaddr1',function(a){
		sf.getinfodb('delete from rkconnect where parentcol="'+a.r2id+'" and conkind="rc21"',function(){	
			var async=require('async');
			var count=0;
			
			var chosenlistL=a.chosenlist;
			async.whilst(
				function(callbackfunction){
					//return count<chosenlistL.lengt
					callbackfunction(null,count<chosenlistL.length)
				},
				function(cback){
					sf.GetObjId('conid','rkconnect',10,function(conid){
						var istr='"'+a.r2id+'","'+chosenlistL[count][0]+'","'+sf.nodetime()+'","'+count+'","'+conid+'","rc21"'
						sf.getinfodb('insert into rkconnect (parentcol, childcol, createdate, rkorder, conid, conkind) values ('+istr+')',function(b){
							count++;
							cback(null);
						});
					});

				},
				function(err){
					if(!err){
						console.log('succeed');
						socket.emit('modifyr2toaddr1after',{chosenlist:a.chosenlist,r2id:a.r2id});
					}else{
						console.log('cpt error',err);
					}
			});


		});
		
	});
	socket.on('cpt',function(vcpt){
		if(vcpt.opt==0){
			sf.PCSRetrievingCrindex(vcpt.pcsid,function(crprbcon,crprbidstr){
				socket.emit('cptprbcon',{crprbcon:crprbcon,crprbidstr:crprbidstr});	
			});
		}else if(vcpt.opt==1){
			sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order,rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			sf.prbsetv2(vcpt.pcsid,function(ps){
				socket.emit('cptprbcon',{crprbcon:ps,cps:b});
			});		
			});		
		}else if(vcpt.opt==3){
			sf.getinfodb('select prbid from prb where prbkorean like "%'+vcpt.sch+'%" order by prbregi desc', function(c){
				var pid=[];
				for(var id=0; id<c.length; id++){
					pid.push(c[id].prbid)
				}
			sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order,rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			//sf.getinfodb('select prblist,listinfo,cptid from cptproblemset', function(b){
			sf.prbsetv2(pid,function(ps){
				socket.emit('cptprbcon',{crprbcon:ps,cps:b});
			});		
			});		
			});		

		}else if(vcpt.opt==2){
			console.log(vcpt.pcsid);
		}
	});
	socket.on('cptfocus',function(cf){
		var o1prblist=cf.prblist.split(',');
		sf.prbsetv2(o1prblist,function(ps){
			socket.emit('cptfocusprbcon',{ps:ps});
		});		
	});


	socket.on('callr2list',function(){
		sf.getinfodb('select a.r2listinfo,a.r2id, b.childcol, b.rkorder from r2list as a join rkconnect as b on a.r2id=b.parentcol where b.conkind="rc21"', function(a){
		sf.getinfodb('select * from r2list', function(b){
				
			socket.emit('callr2listafter',{a:a,b:b});
		});
		});
	});
	socket.on('callr1list',function(){
		sf.getinfodb('select * from cptproblemset',function(a){
			socket.emit('callr1listafter',{a:a});
		});
	});

	socket.on('creater2',function(a){
		sf.GetObjId('r2id','r2list',10,function(r2id){
			var insertvar = {r2listinfo:a.listinfo, createdate:sf.nodetime(), r2id:r2id};
			sf.getinfodb_par('insert into r2list SET ? ',insertvar,function(){
				socket.emit('creater2after',{r2id:r2id,listinfo:a.listinfo});
			});

		});
	});

});


app.get('/admin/qoc',function(req,res){
	var stchk=req.query.stchk;
	var degsnick='shjung';
	if(typeof stchk=='undefined' || stchk=='0'){
		sf.getinfodb('select crsname from defele where degsnick="'+degsnick+'" group by crsname',function(rs){
			res.render('qoc/qoccrs',{rs:rs});
		});
	}else if(stchk=='1'){
		var crs=req.query.crs;
		sf.RelatedCrs(crs,function(eleset,a){
			res.render('qoc/editcrs',{crs:crs,eleset:eleset});
		});
	}
});



app.get('/admin/coz',function(req,res){
	var stchk=req.query.stchk;
	var degsnick='shjung';
	if(typeof stchk=='undefined' || stchk=='0'){
		sf.getinfodb('select crsname from defele where degsnick="'+degsnick+'" group by crsname',function(rs){
			res.render('./coz/cozcrslist',{rs:rs});
		});
	}else if(stchk=='1'){
		var crs=req.query.crs;
		sf.RelatedCrs(crs,function(eleset,a){
			res.render('coz/cozopencrs',{crs:crs,eleset:eleset});
		});
	}
});



app.get('/admin/coztitle',function(req,res){
	var pcrsname=req.query.crsname;
	var date=new Date();
	var vyear=date.getFullYear();
	var vmonth=date.getMonth()+1;
	var vday=date.getDate();
	if(vday<10){
		vday='0'+vday.toString();
	}
	if(vmonth<10){
		vmonth='0'+vmonth.toString();
	}
	vyear=vyear.toString()[2]+vyear.toString()[3];
	var titleprefix='GG'+vyear+vmonth+vday;
	var fullcrsname=titleprefix+'_'+pcrsname;
	

	var str={degsnick:'shjung',crsname:fullcrsname,pstage:'PRES',elepass:'elefvwt',elenpass:'dump',elevideo:'mov.aaaaaaaaaa',eleprbs:'p00001',ele_criteria:-1,elestatus:0,eletime:sf.nodetime()};
	sf.getinfodb_par('insert defele SET ?',str,function(rs){});


	res.redirect('./coz?stchk=0');
	

});



app.get('/admin/eerget',function(req,res){
	var eermode=req.query.eermode;
	if(eermode=='0'){
		var modimode=req.query.modimode;
		var slkinfo=req.query.slkinfo;
		sf.EERCreateSlk(slkinfo,modimode,function(){
			res.redirect('/admin/eer?stchk=1');
		});	
	}else if(eermode=='1'){
		var slabid=req.query.slabid;
		var blockid=req.query.blockid;
		sf.EERCreateSlkConnect(slabid,blockid,function(){});
		res.redirect('/admin/eer?stchk=1&slabid='+slabid);
	}else if(eermode=='2'){
		var slkid=req.query.slkid;
		var caseid=req.query.caseid;
		sf.EERCreateCaseConnect(slkid,caseid,function(){});
		res.redirect('/admin/eer?stchk=5&slkid='+slkid);
		
	}else{
		res.send('end');
	}

});



app.get('/admin/subjectmanage',function(req,res){
	sf.getinfodb('select * from subcla',function(rs){
		res.render('course/subjmanage',{rs:rs});
	});
});


app.get('/admin/yqwareq',function(req,res){
	var name=req.query.yqwaname;
	var contact=req.query.yqwanum;
	var explanation=req.query.yqwaexplanation;
	var rst=sf.YQWAreq(name,contact,explanation);
	res.send(
	`
<html>
	<head>
		<meta http-equiv='refresh' content="3; url=http://www.elcue.net:3000" />
	</head>
	<body>
		<h1> message : ${rst[1]} </h1>
		<h1> Redirecting in 3 seconds...</h1>
	</body>
</html>
		

	`)

});

app.get('/admin/yqwachk',function(req,res){
	sf.getinfodb('select * from yqwareq',function(rs){
		res.render('yqwachk',{rs:rs});
	});
});



app.get('/mathapp/isprimecheck',function(req,res){
	res.render('mathapplication/mathapp_primenumbercheck.pug');
});

//Object Oriented study

app.get('/test/xml',function(req,res){
	res.render('test/xml');
});

app.post('/num',function(req,res){
	var num = req.body.value;
	res.send(JSON.stringify({v:3,msg:'I LOve You'}))
	res.end('done');
});

app.get('/test/json',function(req,res){
	res.render('test/json');
});

app.get('/test/class',function(req,res){
	res.render('test/class');
});

//bouncingball example
app.get('/test/bouncingball',function(req,res){
	res.render('bouncingball/bouncingball');
});

//prb Ans  create

app.get('/admin/createmysqlpg',function(req,res){
	var stchk=req.query.stchk;
	if(typeof stchk=='undefined'){
			res.render('./course/createmysql',{prblist:[]});
	}else if(stchk==0){
		var list;
		sf.getinfodb('select prbid from prb',function(rs){
			list=sf.SelectorSpamElement(rs,0)
			res.render('./course/createmysql',{prblist:list});
		});
	}else if(stchk==1){
		var list;
		sf.getinfodb('select prbid from prb',function(rs){
			list=sf.SelectorSpamElement(rs,1)
			res.render('./course/createmysql',{prblist:list});
		});
	}else if(stchk==2){
		var list;
		sf.getinfodb('select prbid from prb',function(rs){
			list=sf.SelectorSpamElement(rs,2)
			res.render('./course/createmysql',{prblist:list});
		});
	}else if(stchk==3){
		var prbid=req.query.prbid;
		sf.getinfodb('select * from prb where prbid="'+prbid+'"',function(rs){
			if(rs.length>0){
				res.render('./course/createmysql2',{prbk:rs[0].prbkorean,prbid:rs[0].prbid,prbpic:rs[0].prbpickor,source:rs[0].source});
			}else{
				res.render('./course/createmysql',{prbk:'No Result!',prbid:'none',prbpic:'none'});	
			}
		});
	}else if(stchk==4){
		
	}



});



//test
app.get('/admin/page',function(req,res){
 res.render('./course/inipage')
})

app.get('/admin/catecreate',function(req,res){
	var prblist=req.query.prblist;
	var chkprb=parseInt(req.query.chkprb,10);
	var arprblist=[];
	if(typeof prblist!='undefined'){
		psprblist=prblist.split(',');
		for(var ua=0; ua<psprblist.length; ua++){
			arprblist.push(psprblist[ua]);
		}
	}
	if(chkprb==0){
		sf.getinfodb('select * from prbcateinfo where cateparents="0"',function(rs){
			sf.getinfodb('select * from prb order by prbregi desc limit 30',function(prbls){
				var recentprblist=sf.CDSPrbParsing(prbls);
				res.render('./prbpage/cateprb',{rst:rs,recentprblist:recentprblist});
			});
		});
	}else if(chkprb==1){
		sf.getinfodb('select * from prbcateinfo',function(rs){
			var prbcont=[];
			var count=0;
				async.whilst(
				function(callbackfunction){
					callbackfunction(null,count<arprblist.length)
					//return count<arprblist.length;
				},
				function(callback){
	  				pr.dbconnect(arprblist[count],0,function(k){
					 	count++;
						prbcont.push(k);
					 	callback(null);
					});
				 },
				 function(err){
					 if(err){
						  console.log('error occurred in /ts/prblistchk');
					 }else{
						res.render('./prbpage/cateprb',{rst:rs,prbcont:prbcont,prbids:arprblist});
			 		}
				}
			);
		});
			
				
	}else if(chkprb==2){
		var prtids=req.query.cateids;
		var prtlist=req.query.catelist;
		sf.getinfodb('select * from prbcateinfo where cateparents="'+prtids+'" or cateids="'+prtids+'"',function(rs){
			
			var rst=sf.PCSCateParsing(rs,prtids);
			var golist=sf.PCSChildParsing(rst[1]);
			sf.PCSPrbParsing(prtlist,function(prbcon){
				res.render('./prbpage/pcsparents',{prtlist:prtlist.split(','),prtinfo:rst[0],prtids:prtids,childlist:rst[1],prbcon:prbcon,golist:golist,sprtlist:prtlist});
			});
		});
	}


});


app.get('/admin/pcsclassify',function(req,res){
	var stchk=req.query.stchk;
	if(stchk==-1){
		res.render('./prbpage/epsini');
	}else if(stchk==0){
			sf.CPMcslevelbasedCase(function(rs,ra){
				res.render('./prbpage/pcsini',{rs:rs});
			});
	
	
	}else if(stchk==1){
		var crindex=req.query.crindex;
		var pcsinfo=req.query.pcsinfo;
		sf.PCSPickingFreePrbcon(function(unassprbcon,unassprbidstr){
			sf.PCSRetrievingCrindex(crindex,function(crprbcon,crprbidstr){
			res.render('./prbpage/pcswritecsindex',{unassprbcon:unassprbcon,crprbcon:crprbcon,crindex:crindex,pcsinfo:pcsinfo,unassprbidstr:unassprbidstr, crprbidstr:crprbidstr});
			});
		});
	}else if(stchk==2){
		var cps=req.query.crprbidstr;
		sf.PCSPrbParsing(cps,function(pcps){
//			sf.getinfodb('select pcsid, pcsinfo from pcscate where pcsopt="pcp" order by numid desc',function(pcs){
			sf.PLSCaseList(function(caselist,pcplist0){
			sf.PLScrPCPDisplay(caselist,function(crpcp){
				var freepcp=sf.PLSDisplayFreePCP(crpcp,pcplist0,caselist);
				//sf.PCSRetrievingPCPs(cps,function(pplist,pcplist){//cps 는 crindex에 나오는 문제의 리스트
				sf.PCSRetrievingPCPs1(cps,function(prbase,pcpbase,pcplist){//cps 는 crindex에 나오는 문제의 리스트
				//var prbase=sf.PCSParsingPrbBasePCP(pplist)
				//var pcpbase=sf.PCSParsingPCPBasePrb(pplist);
		//		console.log('pplist');
		//		console.log(pplist);
				console.log('prbase');
				console.log(pcplist);
				var e=JSON.stringify(prbase);
				res.render('./prbpage/pcsconpcp',{pcps:pcps,crpcp:crpcp,pcplist:pcplist,prbase:e,pcpbase:pcpbase,freepcp:freepcp})
				});
		//	});
			});
			});
		});
	}else if(stchk==3){
		sf.PCSPickingFreePrbcon(function(unassprbcon,unassprbidstr){
			sf.getinfodb('select pcsid,pcsinfo from pcscate where pcsopt="csindex"',function(pcs){	
				res.render('./prbpage/pcspcpgrouplist',{pcs:pcs,unassprbidstr:unassprbidstr});
			});
		});
	}else if(stchk==4){
		var pcsid=req.query.pcsid;
		sf.PCSListPCPGroup(pcsid,function(pcpg){
			res.render('./prbpage/pcscombination',{pcpg:pcpg});
		});
	}else if(stchk==5){
		sf.PCSPickingFreePrbcon(function(unassprbcon,unassprbidstr){
			sf.getinfodb('select pcsid,pcsinfo from pcscate where pcsopt="csindex"',function(pcs){	
				res.render('./prbpage/pcspcpgrouplistvideo',{pcs:pcs,unassprbidstr:unassprbidstr});
			});
		});
	}else if(stchk==6){
		var pcsid=req.query.pcsid;
		sf.PCSListPCPGroup(pcsid,function(pcpg){
			sf.PRVCountPCPVideo(pcpg,function(svl){
				sf.PRVPCPCount(pcpg,function(nind){
					res.render('./prbpage/pcscombinationvideo',{pcpg:pcpg,svl:svl,nind:nind});
				});
			});
		});
	}else if(stchk==7){
		sf.PLScslevel(function(plslevel){
			console.log(plslevel);
			res.render('./prbpage/pcscsindexlevel',{plslevel:plslevel});
		});
	}else if(stchk==8){
		sf.PLSCaseList(function(caselist,pcplist){
			sf.PLScrPCPDisplay(caselist,function(crpcp){
				res.render('./prbpage/pcscrpcp',{caselist:caselist,crpcp:crpcp,pcplist:pcplist})
			});
		});
	}else if(stchk==9){
		sf.CPMcslevelbasedCase(function(rs,rb){
			res.render('./prbpage/pcscrpcpbase',{rs:rs});
		});
	}else if(stchk==10){
		sf.CPMcslevelbasedCase(function(rs,rb){
			res.render('./prbpage/cpmcrpcpbasedvideo',{rs:rs});
		});
	}else if(stchk==11){
		res.render('./prbpage/cueqmode');
	}else if(stchk==12){
		var qmode=req.query.qmode;
		sf.CUEqmode(parseInt(qmode),function(userbcrs){
			res.render('./prbpage/cueoption',{userbcrs:userbcrs})
		});
	}else if(stchk==13){
		var qmode=req.query.qmode;
		var crsliststr='';
		var crslist=req.query.crslist;
		var daybefore=req.query.daybefore;
		if(Array.isArray(crslist)){
			for(var ia=0; ia<crslist.length; ia++){
				if(crslist.length -1==ia){
					crsliststr=crsliststr+crslist[ia];
				}else{
					crsliststr=crsliststr+crslist[ia]+',';
				}
			}
		}else{
			crsliststr=crslist;
		}
		res.render('./prbpage/cuecrpcpbasedeval',{userid:req.query.userid,crslist:crsliststr,qmode:qmode,daybefore:daybefore});
		
	}else if(stchk==14){
		var qmode=req.query.qmode;
		sf.CUEqmode(parseInt(qmode),function(crsbuser){
			res.render('./prbpage/cueoptioncrsbuser',{crsbuser:crsbuser})
		});
	}else if(stchk==15){
		var crsname=req.query.crsname;
		var qmode=req.query.qmode;
		var useridliststr='';
		var daybefore=req.query.daybefore;
		var useridlist=req.query.useridlist;
		if(Array.isArray(useridlist)){
			for(var ia=0; ia<useridlist.length; ia++){
				if(useridlist.length -1==ia){
					useridliststr=useridliststr+useridlist[ia];
				}else{
					useridliststr=useridliststr+useridlist[ia]+',';
				}
			}
		}else{
			useridliststr=useridlist;
		}
		res.render('./prbpage/cuecrpcpbasedevalcrsbuser',{userid:useridliststr,crslist:crsname,qmode:qmode,daybefore:daybefore});
	
	}else if(stchk==16){
		sf.PLSCaseList(function(caselist,pcplist){
			sf.PLScrPCPDisplay(caselist,function(crpcp){
				res.render('./prbpage/poc',{caselist:caselist,crpcp:crpcp,pcplist:pcplist})
			});
		});
	}else if(stchk==17){
		sf.EPSstaticmodify(function(rs){
			res.render('epsstatic/epsstatic',{es:rs});
		});

	}else if(stchk==18){
		sf.EnRS(function(enrs,emptyentity){
			res.render('pea/enrs',{enrs:enrs,emptyentity:emptyentity});
		});
	}else if(stchk==19){
		var prbidlist=req.query.prbidlist;
		sf.PCSPrbParsing(prbidlist,function(pcps){
			sf.PLSCaseList(function(caselist,pcplist0){
			sf.PLScrPCPDisplay(caselist,function(crpcp){
				var freepcp=sf.PLSDisplayFreePCP(crpcp,pcplist0,caselist);
				sf.PCSRetrievingPCPs1(prbidlist,function(prbase,pcpbase,pcplist){//prbidlist 는 crindex에 나오는 문제의 리스트
				var e=JSON.stringify(prbase);
				res.render('./pea/pea',{pcps:pcps,crpcp:crpcp,pcplist:pcplist,prbase:e,pcpbase:pcpbase,freepcp:freepcp})
				});
			});
			});
		});
	
	}else if(stchk==20){
		sf.PLSCaseList(function(caselist,pcplist){
			sf.PLScrPCPDisplay(caselist,function(crpcp){
				res.render('./pea/outerpea',{caselist:caselist,crpcp:crpcp,pcplist:pcplist})
			});
		});
	}else if(stchk==21){
		res.render('./pea/peaboard');
	}else if(stchk==22){
		sf.PEAindv(function(prblist){
			res.render('./pea/peaindv',{prblist:prblist});
		});
	}else{
		res.send('end');
	}
});

app.get('/admin/createform',function(req,res){
 var prbid=req.query.prbid;
 var fidjs=req.query.fid+'.js';
 var fid=req.query.fid;
 var rstcode=req.query.rstcode;
// var refresh=req.query.refresh;
 //var exec = require('child_process').exec;

//보안상의 문제로, 시스템 파일을 직접 웹에서 노출시키기가 어렵다고 판단하여 파일을 복사하여 열람하도록했다.
	/*if(refresh){
		//var child0=exec('cp -rf '+refresh+'.js ../',function(err,stdout,stderr){if(err){throw err;}});
		var child0=exec('cp ./spam/crtfromweb/'+refresh+'.js ./spam/',function(err,stdout,stderr){if(err){throw err;}});
		var child = exec('cp -rf ./spam/*.js ./public/jscontent',function(err,stdout,stderr){ if(err){throw err;}});
	}*/

	if ( typeof fid !== 'undefined' && typeof prbid=='undefined'){
		var fpath='./spam/'+fidjs;
		if(fs.existsSync(fpath)){
		var stexec='less ./spam/'+prbid;
		fs.readFile('./spam/'+fidjs,'utf8',function(err,data){
			if(err){ throw err;}else{
				res.render('./course/createjs',{jscont:data,fid:fid});
			}
	 	});
		}else{
			res.redirect('/admin/createform?rstcode=ThereIsNoFileT.T');
		}
	/*
	}else if (typeof fid=='undefined'  && typeof prbid!=='undefined'){
		console.log('here');
		stexec='node ./spam/crtfromweb/prbmain.js '+prbid;
		console.log(stexec);
		var child = exec(stexec,function(error,stdout,stderr){
				res.render('./course/createjs',{output:stdout});
			});
		var a=2;*/
	}else{
	// res.render('./course/createjs',{output:'test'});
		res.render('./course/createjs',{rstcode:rstcode});
	}
 
});

//QPRB 

app.get('/admin/qprb',function(req,res){
	res.render('qprb/qprb');
});

var qprb=io.of('/qprb');
qprb.on('connection',function(socket){
	console.log('qprb connected');

	socket.on('qprbsendprbupload',function(a){
		sf.GetObjId('prb','prb',10,function(prbid){
			socket.emit('qprbsendprbuploadresult',{prbid:prbid})
			var text={prbid:prbid,prbkorean:a.prbtext}
			sf.getinfodb_par('insert into prb SET ?',text,function(rst){
				//socket.emit('qprbsendprbuploadresult',{prbid:prbid})
			});
		});

	});

	socket.on('qprbsendprbcontents',function(a){
		//var textl = {texttitle:texttitle, textid:r}
		//sf.getinfodb_par('insert into textlist set ?',textl,function()

		if(a.option=='create'){
			sf.GetObjId('prb','prb',10,function(prbid){
				var text={prbid:prbid,prbkorean:a.prbtext}
				sf.getinfodb_par('insert into prb SET ?',text,function(rst){
				});
			});
		}else if(a.option=='update'){
			var prbupdate={prbkorean:a.prbtext}
		 	sf.getinfodb_par('update prb SET ? where prbid="'+a.prbid+'"',prbupdate,function(rst){
				console.log(a.prbid + ' is updated');
			});
		}



	});
});	

//mmcp
app.get('/mmcp/mmcphome',function(req,res){
	res.render('mmcp/mmcphome');
});
app.get('/mmcp/mmcphomework',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);

		}else{

			if(Object.keys(req.query).length===0){
				var msg='로그인을 하시고 서술숙제하기를 눌러주세요 <a href="/">LogIn </a>'
				res.send(msg);
			}else{
				if(typeof req.query.mmcpconid !== 'undeinfed' && typeof req.query.mmcpprblist !== 'undefined'){
					var mmcpconid=req.query.mmcpconid;
					var mmcpprblist=req.query.mmcpprblist;
					var prblistv=mmcpprblist.split(',');
					var whclause='';
					for(var ia=0; ia<prblistv.length; ia++){
						if(ia!=prblistv.length-1){
							whclause=whclause+'mmcpid="'+prblistv[ia]+'" or '		
						}else{
							whclause=whclause+'mmcpid="'+prblistv[ia]+'"'		
						}
					}

					sf.getinfodb('select * from mmcpprb where '+whclause,function(c){
						var prbidlist=[];
						var mmcpobj=[];
						for(var ia=0; ia<c.length; ia++){
							prbidlist.push(c[ia].prbid);
							mmcpobj[ia]={};
							mmcpobj[ia].mmcpconid=mmcpconid;
							mmcpobj[ia].mmcpid=c[ia].mmcpid;
							mmcpobj[ia].solutiontime=c[ia].solutiontime;
						}
						sf.prbsetv2(prbidlist,function(prb){
							for(var ia=0; ia<prb.length; ia++){
								mmcpobj[ia].prb=prb[ia];
							}
							res.render('mmcp/mmcphomework',{mmcp:mmcpobj,username:req.user.username});

						});
					});
				}else{
					var msg='로그인을 하시고 서술숙제하기를 눌러주세요 <a href="/">LogIn </a>'
					res.send(msg);

				}
			}
		}
	
	});

});
app.get('/mmcp/connect',function(req,res){

	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/mmcpconnect',{userid:req.user.username});
		}
	
	});

});
app.get('/mmcp/prb',function(req,res){
	res.render('mmcp/mmcpprbreg');

});
app.get('/mmcp/envelope',function(req,res){
	res.render('mmcp/mmcpenv');
});
app.get('/mmcp/assign',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/mmcpassign',{userid:req.user.username});
		}
	
	});

});

app.get('/mmcp/interface',function(req,res){

	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/mmcpinterface',{userid:req.user.username, dsname:req.user.DisplayName});
		}
	
	});


});

app.get('/mmcp/glancetestuserlist',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/teachergluserlist',{userid:req.user.username, dsname:req.user.DisplayName});
		}
	
	});

});
app.get('/mmcp/teacherglcheck',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			if(Object.keys(req.query).length===0){
				var msg='로그인을 하시고 와주세요. <a href="/">LogIn </a>'
				res.send(msg);
			}else{
				if(typeof req.query.username !== 'undeinfed'){
					var username=req.query.username;
					res.render('mmcp/teacherglcheck',{username:username,userinfo:req.user});

				}else{
					var msg='로그인을 하시고 와주세요. <a href="/">LogIn </a>'
					res.send(msg);
				}
			}



		}
	
	});


});


app.get('/mmcp/glancetest/allusers',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/glancetestallusers');
		}
	
	});

});
app.get('/mmcp/glancetest',function(req,res){

	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/glancetestinterface',{userid:req.user.username, dsname:req.user.DisplayName});
		}
	
	});


});
app.get('/mmcp/hwinterface',function(req,res){

	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/mmcphwinterface',{userid:req.user.username, dsname:req.user.DisplayName});
		}
	
	});


});

app.get('/mmcp/teacherhwlog',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{

			fs.readFile('./log/usermmcphomework.log','utf8',function(err,data){
			sf.getinfodb('select prbid,createdate,timepassed,username from mmcphomework union select prbid, createdate,timepassed,username from mmcppic',function(b){
			//sf.getinfodb('select prbid,createdate,timepassed,username from mmcphomework',function(b){
				//socket.emit('callhwdataafter',{hwdata:b});
				res.render('mmcp/teacherhwlog',{data:data,userinfo:req.user,hwdata:b});
			});
			});

		}
	
	});


});

app.get('/mmcp/teacherhwhome',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/teacherhwhome');
		}
	
	});


});
app.get('/mmcp/teacherhwuserlist',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/teacherhwuserlist',{userid:req.user.username, dsname:req.user.DisplayName});
		}
	
	});


});
app.get('/mmcp/teacherhwcheck',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			if(Object.keys(req.query).length===0){
				var msg='로그인을 하시고 와주세요. <a href="/">LogIn </a>'
				res.send(msg);
			}else{
				if(typeof req.query.username !== 'undeinfed'){
					var username=req.query.username;
					res.render('mmcp/teacherhwcheck',{username:username,userinfo:req.user});

				}else{
					var msg='로그인을 하시고 와주세요. <a href="/">LogIn </a>'
					res.send(msg);
				}
			}



		}
	
	});


});





app.get('/mmcp/teachermmcpconnect',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{

			sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			res.render('mmcp/teachermmcpconnect',{userid:req.user.username,cps:b});
			});
		}
	
	});

});

app.get('/mmcp/teacherassign',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/teachermmcpassign',{username:req.user.username});
		}
	
	});

});


app.get('/mmcp/mmcphwhomework',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);

		}else{

			if(Object.keys(req.query).length===0){
				var msg='로그인을 하시고 서술숙제하기를 눌러주세요 <a href="/">LogIn </a>'
				res.send(msg);
			}else{
				if(typeof req.query.mmcpconid !== 'undeinfed' && typeof req.query.mmcpprblist !== 'undefined'){
					var mmcpconid=req.query.mmcpconid;
					var mmcpprblist=req.query.mmcpprblist;
					var prblistv=mmcpprblist.split(',');

						var mmcpobj=[];
						for(var ia=0; ia<prblistv.length; ia++){
							mmcpobj[ia]={};
							mmcpobj[ia].mmcpconid=mmcpconid;
							mmcpobj[ia].solutiontime=10000;
						}
						sf.prbsetv2(prblistv,function(prb){
							for(var ia=0; ia<prb.length; ia++){
								mmcpobj[ia].prb=prb[ia];
							}

							sf.getinfodb('select prbid from mmcphomework where mmcpconid="'+mmcpconid+'" and username="'+req.user.username+'"',function(a){
							res.render('mmcp/mmcphwsolve',{mmcp:mmcpobj,username:req.user.username,solvedprb:a});
							});

						});
				}else{
					var msg='로그인을 하시고 서술숙제하기를 눌러주세요 <a href="/">LogIn </a>'
					res.send(msg);

				}
			}
		}
	
	});

});

app.get('/mmcp/mmcpglancetestparal',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);

		}else{

			if(Object.keys(req.query).length===0){
				var msg='로그인을 하시고 서술숙제하기를 눌러주세요 <a href="/">LogIn </a>'
				res.send(msg);
			}else{
				if(typeof req.query.mmcpconid !== 'undeinfed' && typeof req.query.mmcpprblist !== 'undefined'){
					var mmcpconid=req.query.mmcpconid;
					var breaktime=req.query.breaktime;
					var mmcpprblist=req.query.mmcpprblist;
					var prblistv=mmcpprblist.split(',');
					var whclause='';
					for(var ia=0; ia<prblistv.length; ia++){
						if(ia!=prblistv.length-1){
							whclause=whclause+'mmcpid="'+prblistv[ia]+'" or '		
						}else{
							whclause=whclause+'mmcpid="'+prblistv[ia]+'"'		
						}
					}

					sf.getinfodb('select * from mmcpprb where '+whclause,function(c){
						var prbidlist=[];
						var mmcpobj=[];
						for(var ia=0; ia<c.length; ia++){
							prbidlist.push(c[ia].prbid);
							mmcpobj[ia]={};
							mmcpobj[ia].mmcpconid=mmcpconid;
							mmcpobj[ia].mmcpid=c[ia].mmcpid;
							mmcpobj[ia].solutiontime=c[ia].solutiontime;
						}


						sf.prbsetv2(prbidlist,function(prb){
							for(var ia=0; ia<prb.length; ia++){
								mmcpobj[ia].prb=prb[ia];
							}
							res.render('mmcp/mmcpglancetestparal',{mmcp:mmcpobj,username:req.user.username,breaktime:breaktime});
							//res.render('mmcp/mmcphomework',{mmcp:mmcpobj,username:req.user.username});

						});
					});

				}else{
					var msg='로그인을 하시고 서술숙제하기를 눌러주세요 <a href="/">LogIn </a>'
					res.send(msg);

				}
			}
		}
	
	});

});





app.get('/mmcp/solvespace',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);

		}else{
			if(Object.keys(req.query).length===0){
				var msg='로그인을 하시고 서술숙제하기를 눌러주세요 <a href="/">LogIn </a>'
				res.send(msg);
			}else{
				var mmcpconid=req.query.mmcpconid;
				var mmcpprblist=req.query.mmcpprblist;
				var prblistv=mmcpprblist.split(',');
				var whclause='';
				for(var ia=0; ia<prblistv.length; ia++){
					if(ia!=prblistv.length-1){
						whclause=whclause+'mmcpid="'+prblistv[ia]+'" or '		
					}else{
						whclause=whclause+'mmcpid="'+prblistv[ia]+'"'		
					}
				}

				sf.getinfodb('select * from mmcpprb where '+whclause,function(c){
					var prbidlist=[];
					var mmcpobj=[];
					for(var ia=0; ia<c.length; ia++){
						prbidlist.push(c[ia].prbid);
						mmcpobj[ia]={};
						mmcpobj[ia].mmcpconid=mmcpconid;
						mmcpobj[ia].mmcpid=c[ia].mmcpid;
						mmcpobj[ia].solutiontime=c[ia].solutiontime;
					}


					sf.prbsetv2(prbidlist,function(prb){
						for(var ia=0; ia<prb.length; ia++){
							mmcpobj[ia].prb=prb[ia];
						}
						res.render('mmcp/mmcpsolvespace',{mmcp:mmcpobj,username:req.user.username});
						//res.render('mmcp/mmcphomework',{mmcp:mmcpobj,username:req.user.username});

					});
				});
			}
		}	
	

	});
});


app.get('/mmcp/brief/allusers',function(req,res){
	res.render('mmcp/briefallusers');
});
app.get('/student/historyinventory',function(req,res){
	res.render('mypage/checkmyhistory',{userid:req.user.username, dsname:req.user.DisplayName});
	
});
app.get('/student/classprbhistory',function(req,res){

	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mypage/checkmyclass',{userinfo:req.user.username});
			//res.render('mmcp/briefinspect',{userid:req.user.username, dsname:req.user.DisplayName});
		}
	
	});

});
app.get('/mmcp/brief/inspect',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('mmcp/briefinspect',{userid:req.user.username, dsname:req.user.DisplayName});
		}
	
	});

});
app.get('/mmcp/mmcpinspecthomework',function(req,res){
	res.render('mmcp/mmcpinspecthomework');
});


app.get('/mmcp/mmcpinspectuserpic',function(req,res){
	res.render('mmcp/mmcpinspectuserpic');
});
var mmcp=io.of('/mmcp');
mmcp.on('connection',function(socket){
	console.log('mmcp connected');

	socket.on('callhwdata',function(a){
		sf.getinfodb('select prbid,createdate,timepassed from mmcphomework where username="'+a.username+'"',function(b){
			socket.emit('callhwdataafter',{hwdata:b});
		});
	});


	socket.on('fortabletreport',function(a){
		if(a.modecheck=='getstatecheck'){
			var msg=sf.nodetime()+' State Log - username: '+a.username+', statuscheck : '+a.a+'\n';
			fs.appendFile('./log/usermmcphomework.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});
		}


	});


	socket.on('mmcpusersolveprblist',function(a){
		sf.getinfodb('select distinct prbid from mmcphomework where username="'+a.username+'"',function(b){
			socket.emit('mmcpusersolveprblistafter',{prblist:b});
		});
	});

	socket.on('mmcplog',function(a){
			var msg=sf.nodetime()+', '+'username: '+a.username+', location: '+a.pagename + '\n';
			fs.appendFile('./log/usermmcphomework.log',msg,function(err){
				if(err) throw err;
				console.log('usermmcphomework Saved');
			});
		
	});

	socket.on('mmcpregistermsg',function(a){
		sf.getinfodb('update mmcphomework set comment="'+a.msg+'" where numid="'+a.numid+'"',function(){
			socket.emit('mmcpregistermsgafter');
		});
	});

	socket.on('showuserhistoryprbdisplay',function(a){
		sf.getinfodb('select evalprb,numid,prbid,resultcode,createdate,hisopt,cptinfo from rdcthistory where username="'+a.username+'" and (hisopt="prbsolve" or hisopt="savetoask" or hisopt="instructprb" or hisopt="sharehwresult" or hisopt="sharewrssresult" or hisopt="shareglresult") and createdate > date_sub(now(), interval '+a.time+' day) order by numid desc',function(b){
			console.log(b);
			var plist=[];
			for(var ia=0; ia<b.length; ia++){
				plist.push(b[ia].prbid)	
			}

			sf.prbsetv2(plist,function(c){
				var pset=[];
				for(var ia=0; ia<plist.length; ia++){
					pset[ia]=[c[ia],b[ia].prbid,b[ia].hisopt,b[ia].resultcode,b[ia].createdate,b[ia].cptinfo,b[ia].numid,b[ia].evalprb]
				}
				socket.emit('showuserhistoryprbdisplayafter',{plist:pset});
			});
		});
	});

	socket.on('mmcpcallprb',function(a){
		sf.prbsetv2([a.prbid],function(b){
			console.log(b);
			socket.emit('mmcpcallprbafter',{a:b});
		});
	});


	socket.on('mmcpeditsolutiontime',function(a){
		sf.getinfodb('update mmcpprb set solutiontime="'+a.solutiontime+'" where mmcpid="'+a.mmcpid+'"',function(a){
			socket.emit('mmcpeditsolutiontimeafter');
		}); 
	});


	socket.on('userhomeworkwritingeval',function(a){
		if(a.evalnum==-1){
			var qry='select mp.mpicid, ps.ratingdetail,mp.prbid from mmcphomework as mp left join psreconnect as ps on mp.mpicid=ps.solvepic where ps.ratingdetail is null and mp.username="'+a.studentid+'" and mp.createdate >= "2022-03-04"';
		}else{
			var qry='select mp.mpicid, ps.ratingdetail, mp.prbid from mmcphomework as mp left join psreconnect as ps on mp.mpicid=ps.solvepic where ps.ratingdetail="'+a.evalnum+'" and mp.username="'+a.studentid+'" and mp.createdate >= "2022-03-04"';
		}
		sf.getinfodb(qry,function(b){
			var prblist=[];
			var numid=[];
			for(var ia=b.length-1; ia >= 0; ia--){
				prblist.push(b[ia].prbid);
				numid.push(b[ia].mpicid)
			}
			//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(c){
			sf.prbsetv2(prblist,function(prbcon){
				socket.emit(a.returnsocket,{prbcon:prbcon,cptid:'userhwwritingeval', numid:numid});
			//});
			});

		});
	});




	socket.on('userimmediatehistory',function(a){
		if(a.mode=='immediatehistory'){
		sf.getinfodb('select distinct prbid, numid, hisopt from rdcthistory where username="'+a.studentid+'" and (createdate between date_add(now(),interval -'+a.dtime+' hour) and now())',function(b){

		var prblist=[];
		var numid=[];
		for(var ia=b.length-1; ia >= 0; ia--){
			prblist.push(b[ia].prbid);
			
			numid.push([b[ia].numid,b[ia].hisopt])
		}
		sf.prbsetv2(prblist,function(prbcon){
			socket.emit(a.returnsocket,{prbcon:prbcon,cptid:'immediatehistory', numid:numid});
		});
		});
		}
	});


	socket.on('mmcpcallmcpprblistglance',function(c){
		sf.getinfodb('select * from cptproblemset where cptid="'+c.cptid+'"',function(a){
	
			
			var prblistv=a[0].prblist.split(',');

			var whclause='';
			for(var ia=0; ia<prblistv.length; ia++){
				if(ia!=prblistv.length-1){
					whclause=whclause+'m.prbid="'+prblistv[ia]+'" or '		
				}else{
					whclause=whclause+'m.prbid="'+prblistv[ia]+'"'		
				}
			}

			var mmcpobj=[];
			//sf.getinfodb('select p.prbkorean,m.prbid,m.mmcpid,m.solutiontime from mmcpprb as m right join prb as p on p.prbid=m.prbid',function(b){
			sf.getinfodb('select p.prbkorean,m.prbid,m.mmcpid,m.solutiontime,m.username from mmcpprb as m join prb as p on p.prbid=m.prbid where '+whclause,function(b){
				for(var ia=0; ia<prblistv.length; ia++){
					mmcpobj[ia]={prbid:prblistv[ia],mmcpprb:[],cptid:c.cptid,prbcon:'',prbpic:''};
					for(var ib=0; ib<b.length; ib++){
						if(b[ib].prbid==prblistv[ia]){
							mmcpobj[ia].mmcpprb.push([b[ib].mmcpid,b[ib].solutiontime,b[ib].username]);
						}
					}
				
				}

			/*
			sf.getinfodb('select m.prbid,m.prbkorean,m.prbpickor from prb as m where '+whclause,function(c){
				for(var ia=0; ia<mmcpobj.length; ia++){
					for(var ib=0; ib<c.length; ib++){
						if(mmcpobj[ia].prbid==c[ib].prbid){
							mmcpobj[ia].prbcon=c[ib].prbkorean;
							mmcpobj[ia].prbpic=c[ib].prbpickor;
						}
					}
				}
				socket.emit('mmcpcallmcpprblistglanceafter',{mmcpobj:mmcpobj});
			});*/

			sf.prbsetv2(prblistv,function(prb){
				for(var ia=0; ia<mmcpobj.length; ia++){
					for(var ib=0; ib<prb.length; ib++){
						if(mmcpobj[ia].prbid==prb[ib][0]){
							mmcpobj[ia].prbcon=prb[ib][1];
							mmcpobj[ia].prbpic=prb[ib][8];
							mmcpobj[ia].prbmultiple=[prb[ib][4], prb[ib][5], prb[ib][6], prb[ib][2]];
						}
					}
				}

				socket.emit('mmcpcallmcpprblistglanceafter',{mmcpobj:mmcpobj});
			});

			

			});



		});
	});






	socket.on('mmcpcallmcpprblist',function(c){
		sf.getinfodb('select * from cptproblemset where cptid="'+c.cptid+'"',function(a){
	
			if(a[0].prblist!=''){
				var prblistv=a[0].prblist.split(',');

			}else{
				var prblistv=[];
			}

			sf.prbsetv2(prblistv,function(prb){
				socket.emit('mmcpcallmcpprblistafter',{prbcon:prb});
			});

		});
	});


	socket.on('glprbcallfrommcpid',function(a){
		var mcpidv=a.mcpid.split(',');
		var whclause='';
		for(var ia=0; ia<mcpidv.length; ia++){
			if(ia!=mcpidv.length-1){
				whclause=whclause+'m.mmcpid="'+mcpidv[ia]+'" or '		
			}else{
				whclause=whclause+'m.mmcpid="'+mcpidv[ia]+'"'		
			}
		}

		sf.getinfodb('select p.prbkorean,p.prbid,p.prbpickor, m.solutiontime, m.mmcpid from mmcpprb as m join prb as p on p.prbid=m.prbid where '+whclause,function(b){
		//sf.getinfodb('select m.mmcpid,p.prbkorean,m.solutiontime,p.prbid,p.prbpickor from mmcpprb as m join prb as p on m.prbid = p.prbid where '+whclause,function(b){
			socket.emit('glprbcallfrommcpidafter',{a:b,b:mcpidv,solvedprb:a.solvedprb});
		});
	
	});


	socket.on('prbcallfrommcpid',function(a){
		var mcpidv=a.mcpid.split(',');
		var whclause='';
		for(var ia=0; ia<mcpidv.length; ia++){
			if(ia!=mcpidv.length-1){
				whclause=whclause+'prbid="'+mcpidv[ia]+'" or '		
			}else{
				whclause=whclause+'prbid="'+mcpidv[ia]+'"'		
			}
		}

		sf.getinfodb('select p.prbkorean,p.prbid,p.prbpickor from prb as p where '+whclause,function(b){
		//sf.getinfodb('select m.mmcpid,p.prbkorean,m.solutiontime,p.prbid,p.prbpickor from mmcpprb as m join prb as p on m.prbid = p.prbid where '+whclause,function(b){
			
			socket.emit('prbcallfrommcpidafter',{a:b,b:mcpidv,solvedprb:a.solvedprb,kind:a.kind});
		});
	
	});


	socket.on('realtimeequalizer',function(a){
		sf.getinfodb('select * from psreconnect where (teacherid="'+a.teacherid+'") and (createdate between date_add(now(), interval -'+a.dtime+' hour) and now()) and (userid="'+a.studentid+'") and solvekind="'+a.mode+'"',function(b){
			socket.emit('realtimeequalizerafter',{realstate:b,idprefix:a.idprefix,mode:a.mode});
		});
	});

	socket.on('psreteacherevalprbpic',function(a){
		if(a.servermode=='add'){
			sf.getinfodb('insert into psreconnect (teacherid,solvepic,prbid,solvekind,createdate,ratingdetail,drawerid,userid) values ("'+a.teacherid+'","'+a.picid+'","'+a.prbid+'","'+a.evalmode+'","'+sf.nodetime()+'","'+a.eval+'","drid.aaaaaaaaaa","'+a.studentid+'") on duplicate key update createdate="'+sf.nodetime()+'",ratingdetail="'+a.eval+'"',function(){
			});
		}else if(a.servermode=='remove'){
			sf.getinfodb('delete from psreconnect where solvepic="'+a.picid+'"',function(){});
		}
	});


	socket.on('mmcpcallr1',function(a){
		sf.getinfodb('select * from rkconnect as rk join r2list as r2 on rk.parentcol=r2.r2id join cptproblemset as cpt on rk.childcol=cpt.cptid where r2.r2id="'+a.r2id+'" and rk.conkind="rc21" order by rkorder asc, r2order asc', function(b){
			socket.emit('mmcpcallr1after',{b:b});
		});
	});

	socket.on('mmcpcallr2',function(a){
		sf.getinfodb('select r2.r2id, r2.r2listinfo from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id join r2list as r2 on rk.childcol=r2.r2id where r3.r3id="'+a.r3id+'" and rk.conkind="rc32" order by r2order asc',function(b){
			socket.emit('mmcpcallr2after',{b:b});
		});
	});

	socket.on('mmcpcallr3',function(){
		//sf.getinfodb('select * from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id where ')
		sf.getinfodb('select * from r3list',function(a){
			socket.emit('mmcpcallr3after',{a:a});
		});
	});

	socket.on('briefmmcpglcall',function(a){
		sf.getinfodb('select gl.numid, gl.prbid as prbid, gl.mpicid, gl.createdate, gl.mmcpconid, gl.username, gl.mpicorder, gl.timepassed, gl.operationid, gl.timeallocated,gl.roundnum,mmcpconnect.mmcplistinfo, mmcpconnect.mmcpprblist, mmcpconnect.mmcpkind from mmcppic as gl left join mmcpconnect on gl.mmcpconid=mmcpconnect.mmcpconid where username="'+a.username+'" order by createdate desc',function(b){
			var prbidlist=[];
			for(var ia=0; ia<b.length; ia++){
				prbidlist.push(b[ia].prbid);
			}
			var mmcpobj=[];
			sf.prbsetv2(prbidlist,function(prb){
				for(var ia=0; ia<prb.length; ia++){
					//mmcpobj[ia]={username:b[ia].username,mmcpprb:prb[ia],timepassed:b[ia].timepassed,mmcpid:b[ia].mmcpid,createdate:b[ia].createdate, timeallocated:b[ia].timeallocated, mmcpconid:b[ia].mmcpconid,mpicid:b[ia].mpicid}
					mmcpobj[ia]={username:b[ia].username,numid:b[ia].numid,mmcpprb:prb[ia],timepassed:b[ia].timepassed,prbid:b[ia].prbid,createdate:b[ia].createdate, timeallocated:b[ia].timeallocated, mmcpconid:b[ia].mmcpconid,mpicid:b[ia].mpicid,listinfo:b[ia].mmcplistinfo, mmcpprblist:b[ia].mmcpprblist,mmcpkind:b[ia].mmcpkind}


					//mmcpobj[ia]={username:b[ia].username,comment:b[ia].comment,numid:b[ia].numid,mmcpprb:prb[ia],timepassed:b[ia].timepassed,prbid:b[ia].prbid,createdate:b[ia].createdate, timeallocated:b[ia].timeallocated, mmcpconid:b[ia].mmcpconid,mpicid:b[ia].mpicid,listinfo:b[ia].mmcplistinfo, mmcpprblist:b[ia].mmcpprblist}
				}
			//	sf.getinfodb('select mc.mmcpconid, mc.mmcplistinfo,ua.mmcpconnectid from mmcpuserassign as ua ,mmcpconnect as mc where ua.userid="'+a.username+'"',function(b){
				sf.getinfodb('select mc.mmcpconid, mc.mmcplistinfo,mc.mmcpprblist,ua.mmcpconnectid from mmcpuserassign as ua ,mmcpconnect as mc where ua.userid="'+a.username+'" and (mc.mmcpkind="gl" or mc.mmcpkind="glp") ',function(b){
					
					socket.emit('briefmmcpglcallafter',{a:mmcpobj,b:b});
				});

			});


	
	
		})
	});

	socket.on('briefmmcpglancetestcall',function(a){
		sf.getinfodb('select * from mmcppic where username="'+a.username+'" order by createdate desc',function(b){
			var prbidlist=[];
			for(var ia=0; ia<b.length; ia++){
				prbidlist.push(b[ia].prbid);
			}
			var mmcpobj=[];
			sf.prbsetv2(prbidlist,function(prb){
				for(var ia=0; ia<prb.length; ia++){
					mmcpobj[ia]={username:b[ia].username,mmcpprb:prb[ia],timepassed:b[ia].timepassed,mmcpid:b[ia].mmcpid,createdate:b[ia].createdate, timeallocated:b[ia].timeallocated, mmcpconid:b[ia].mmcpconid,mpicid:b[ia].mpicid}
					socket.emit('briefmmcpglancetestcallafter',{a:mmcpobj});
				}
			});

	
	
		})
	});



	socket.on('briefmmcphomeworkcall',function(a){
		sf.getinfodb('select ps.ratingdetail, hw.numid,hw.prbid, hw.mpicid, hw.createdate, hw.mmcpconid, hw.username, hw.mpicorder, hw.timepassed, hw.operationid, hw.timeallocated, hw.roundnum, mmcphwconnect.mmcplistinfo, mmcphwconnect.mmcpprblist from mmcphomework as hw left join mmcphwconnect on hw.mmcpconid=mmcphwconnect.mmcpconid left join psreconnect as ps on ps.solvepic=hw.mpicid where hw.username="'+a.username+'" and hw.createdate >= "2021-01-01" order by hw.createdate desc',function(b){

		/*
		var mcpidv=a.mcpid.split(',');
		var whclause='';
		for(var ia=0; ia<mcpidv.length; ia++){
			if(ia!=mcpidv.length-1){
				whclause=whclause+'mmcpid="'+mcpidv[ia]+'" or '		
			}else{
				whclause=whclause+'mmcpid="'+mcpidv[ia]+'"'		
			}
		}

		sf.getinfodb('select m.mmcpid,p.prbkorean,m.solutiontime,p.prbid,p.prbpickor from mmcpprb as m join prb as p on m.prbid = p.prbid where '+whclause,function(b){
			socket.emit('prbcallfrommcpidafter',{a:b});
		});*/
	







			var prbidlist=[];
			for(var ia=0; ia<b.length; ia++){
				prbidlist.push(b[ia].prbid);
			}
			var mmcpobj=[];
			sf.prbsetv2(prbidlist,function(prb){
				for(var ia=0; ia<prb.length; ia++){
					mmcpobj[ia]={ratingdetail:b[ia].ratingdetail,username:b[ia].username,numid:b[ia].numid,mmcpprb:prb[ia],timepassed:b[ia].timepassed,prbid:b[ia].prbid,createdate:b[ia].createdate, timeallocated:b[ia].timeallocated, mmcpconid:b[ia].mmcpconid,mpicid:b[ia].mpicid,listinfo:b[ia].mmcplistinfo, mmcpprblist:b[ia].mmcpprblist}
					//mmcpobj[ia]={username:b[ia].username,comment:b[ia].comment,numid:b[ia].numid,mmcpprb:prb[ia],timepassed:b[ia].timepassed,prbid:b[ia].prbid,createdate:b[ia].createdate, timeallocated:b[ia].timeallocated, mmcpconid:b[ia].mmcpconid,mpicid:b[ia].mpicid,listinfo:b[ia].mmcplistinfo, mmcpprblist:b[ia].mmcpprblist}
				}
				sf.getinfodb('select mmcphwconnect.mmcpconid, mmcplistinfo, mmcphwconnect.mmcpprblist from mmcphwassign join mmcphwconnect on mmcphwconnect.mmcpconid=mmcphwassign.mmcpconid where mmcphwassign.userid="'+a.username+'"',function(b){
					socket.emit('briefmmcphomeworkcallafter',{a:mmcpobj,b:b});
				});
			});

	
	
		})
	});
	socket.on('mmcphomeworkcallpiclist',function(a){
		sf.getinfodb('select * from mmcphomework where username="'+a.username+'" and mmcpconid="'+a.mmcpconid+'"',function(b){
			socket.emit('mmcphomeworkcallpiclistafter',{a:b});
		});
	});



	socket.on('mmcpcallpiclist',function(a){
		sf.getinfodb('select * from mmcppic where username="'+a.username+'" and mmcpconid="'+a.mmcpconid+'"',function(b){
			socket.emit('mmcpcallpiclistafter',{a:b});
		});
	});

	socket.on('mmcphomeworkcallmmcpconlist',function(a){
		sf.getinfodb('select mmcpconid, count(mmcpconid) from mmcphomework where username="'+a.username+'" group by mmcpconid having count(mmcpconid)>1',function(b){
		//sf.getinfodb('select mmcpconid, count(mmcpconid), username from mmcppic group by mmcpconid where username="'+a.username+'" having count(mmcpconid)>1',function(b){
			socket.emit('mmcphomeworkcallmmcpconlistafter',{a:b,username:a.username});
		});
	});

	socket.on('mmcpcallmmcpconlist',function(a){
		sf.getinfodb('select mmcpconid, count(mmcpconid) from mmcppic where username="'+a.username+'" group by mmcpconid having count(mmcpconid)>1',function(b){
		//sf.getinfodb('select mmcpconid, count(mmcpconid), username from mmcppic group by mmcpconid where username="'+a.username+'" having count(mmcpconid)>1',function(b){
			socket.emit('mmcpcallmmcpconlistafter',{a:b,username:a.username});
		});
	});

	socket.on('mmcphomeworkcalluserlist',function(){
		sf.getinfodb('select username, count(username) from mmcphomework group by username having count(username)>1', function(a){
			socket.emit('mmcphomeworkcalluserlistafter',{a:a});
		});
	});

	socket.on('mmcppiccalluserlist',function(){
		sf.getinfodb('select username, count(username) from mmcppic group by username having count(username)>1', function(a){
			socket.emit('mmcppiccalluserlistafter',{a:a});
		});
	});


	socket.on('callmmcphwconlistforinterface',function(a){
		sf.getinfodb('select mmcphwassign.mmcpconid, mmcphwconnect.mmcpprblist as prblist, mmcphwconnect.mmcplistinfo as listinfo, mmcphwconnect.numprb from mmcphwassign join mmcphwconnect on mmcphwassign.mmcpconid=mmcphwconnect.mmcpconid  where mmcphwassign.userid="'+a.userid+'" order by mmcphwconnect.createdate desc',function(b){
			socket.emit('callmmcphwconlistforinterfaceafter',{a:b});
			
		});
	});

	socket.on('callmmcpconnectlistforinterface',function(a){
		sf.getinfodb('select * from mmcpuserassign where userid="'+a.userid+'"',function(b){
			/*
			var mmcpobj=[];
			
			var conlistv=b[0].mmcpconnectid.split(',');
			var whclause='';
			for(var ia=0; ia<conlistv.length; ia++){
				if(ia!=conlistv.length-1){
					whclause=whclause+'mmcpconid="'+conlistv[ia]+'" or '		
				}else{
					whclause=whclause+'mmcpconid="'+conlistv[ia]+'"'		
				}
			}*/

			sf.getinfodb('select * from mmcpconnect ',function(c){
			//sf.getinfodb('select * from mmcpconnect where '+whclause,function(c){
				socket.emit('callmmcpconnectlistforinterfaceafter',{a:b,b:c});
			});
	
	
		});
	});

	socket.on('mmcpassigncreate',function(a){
		if(a.option==0){
			sf.GetObjId('asi','mmcpuserassign',10,function(asi){
			var concreate={assigninfo:a.assigninfo,asi:asi,mmcpconnectid:a.mmcpconnectid, createdate:sf.nodetime(),userid:a.userid}
				sf.getinfodb_par('insert into mmcpuserassign set ? ', concreate, function(){
					socket.emit('mmcpassigncreateafter');
				});
			});
		}else if(a.option=1){
			sf.getinfodb('update mmcpuserassign set assigninfo="'+a.assigninfo+'", mmcpconnectid="'+a.mmcpconnectid+'" where asi="'+a.asi+'"',function(){
				
				socket.emit('mmcpassigncreateafter');
			});
		}

	});

	socket.on('mmcpcallunassignedhwconid',function(a){
		sf.getinfodb('select mmcphwconnect.mmcplistinfo, mmcphwconnect.mmcpprblist as prblist, mmcphwconnect.mmcpconid from mmcphwconnect left join mmcphwassign on mmcphwconnect.mmcpconid = mmcphwassign.mmcpconid where mmcphwconnect.username="'+a.username+'" and mmcphwassign.userid is NULL',function(b){
			socket.emit('mmcpcallunassignedhwconidafter',{hwconid:b});
		});
	});

	socket.on('callmmcpcon',function(a){
		sf.getinfodb('select * from mmcpconnect',function(a){
			socket.emit('callmmcpconafter',{a:a});
		});
	});

	socket.on('callstdlist',function(a){
			console.log('stdlist here');
		if(typeof a=='undefined'){
			sf.getinfodb('select pm.username,pm.Displayname,ass.mmcpconnectid,ass.asi, ass.assigninfo from prismusers as pm left join mmcpuserassign as ass on ass.userid=pm.username where pm.position=11',function(a){
				socket.emit('callstdlistafter',{a:a});
			});
		}else if(a.mode=='glanceteacherstd'){
			sf.getinfodb('select pm.username,pm.Displayname,ass.mmcpconnectid,ass.asi, ass.assigninfo from prismusers as pm left join mmcpuserassign as ass on ass.userid=pm.username join mmttconnection as mmtt on pm.username=mmtt.childcol where pm.position=11 and mmtt.parentcol="'+a.username+'"',function(b){
				socket.emit('callstdlistafter',{a:b});
			});

		}else if(a.mode=='teacherstd'){
			sf.getinfodb('select pm.username,pm.Displayname from prismusers as pm join mmttconnection as mm on mm.childcol=pm.username  where mm.conopt=0 and mm.parentcol="'+a.username+'" and pm.position=11 order by pm.userregi asc',function(a){
				socket.emit('callstdlistafter',{a:a});
			});

		}else{
			console.log('stdlist');
			/*sf.getinfodb('select * from (select mmttconnection.childcol, prismusers.DisplayName from mmttconnection join prismusers on prismusers.username=mmttconnection.childcol where mmttconnection.conopt=0 and mmttconnection.parentcol="'+a.username+'") as nm left join  ',function(a){
				socket.emit('callstdlistafter',{a:a});
			});*/
			sf.getinfodb('select mmcphwconnect.mmcplistinfo as listinfo, mmcphwconnect.mmcpconid,mmcphwconnect.mmcpprblist as prblist,mmttconnection.childcol as username, prismusers.DisplayName from mmttconnection join prismusers on prismusers.username=mmttconnection.childcol left join mmcphwassign on prismusers.username=mmcphwassign.userid left join mmcphwconnect on mmcphwassign.mmcpconid=mmcphwconnect.mmcpconid where mmttconnection.conopt=0 and mmttconnection.parentcol="'+a.username+'" order by prismusers.userregi asc, mmcphwconnect.createdate desc',function(a){
				socket.emit('callstdlistafter',{a:a});
			});


		}
	});

	socket.on('callmmcpconnectlistbyuser',function(a){
		sf.getinfodb('select mmcpconnectid from mmcpuserassign where userid="'+a.username+'"',function(b){
			var mpconid=[];
			for(var ia=0; ia<b.length;ia++){
				var mp=b[ia].mmcpconnectid.split(',');
				for(var ib=0; ib<mp.length; ib++){
					var chk=0;
					for(var ic=0; ic<mpconid.length; ic++){
						if(mpconid[ic]==mp[ib]){
							chk=1;
							break;
						}
					}
					if(chk!=1){
						mpconid.push(mp[ib])
					}
				}
			}

			var whcl='';
			for(var ia=0; ia<mpconid.length; ia++){
				if(ia==mpconid.length-1){
					whcl=whcl+'mmcpconid="'+mpconid[ia]+'"';
				}else{
					whcl=whcl+'mmcpconid="'+mpconid[ia]+'"'+' or ';
				}
			}

			if(b.length!=0){
				sf.getinfodb('select * from mmcpconnect where '+whcl,function(c){
					socket.emit('callmmcpconnectlistafter',{a:c});
				});
			}else{
					socket.emit('callmmcpconnectlistafter',{a:[]});
			}
	
	
		});

	});

	socket.on('callmmcpconnectlist',function(a){
		sf.getinfodb('select * from mmcpconnect',function(b){	
			socket.emit('callmmcpconnectlistafter',{a:b});
		});
	});


	socket.on('mmcphwassignupdate',function(a){
		sf.getinfodb('delete from mmcphwassign where userid="'+a.chosenuser+'" and username="'+a.username+'"',function(c){
		sf.getinfodb('insert into mmcphwassign (userid,mmcpconid,username) values '+a.bulkinsert,function(b){
			socket.emit('mmcphwassignupdateafter');
		});
		});
	});
	socket.on('mmcphwconcreate',function(a){
		if(a.option==0){
			sf.GetObjId('hwcon','mmcphwconnect',10,function(mpconid){
			var concreate={mmcplistinfo:a.listinfo,mmcpconid:mpconid,mmcpprblist:a.mmcpprblist, createdate:sf.nodetime(), numprb:a.numprb,username:a.userid}
				sf.getinfodb_par('insert into mmcphwconnect set ? ', concreate, function(){
					socket.emit('mmcpconnectcreateafter');
				});
			});
		}else if(a.option==1){
			sf.getinfodb('update mmcphwconnect set numprb="'+a.numprb+'", mmcplistinfo="'+a.listinfo+'", mmcpprblist="'+a.mmcpprblist+'" where mmcpconid="'+a.mmcpconid+'"',function(){
				
				socket.emit('mmcpconnectcreateafter');
			});


		}

	});


	socket.on('mmcpconnectcreate',function(a){
		if(a.option==0){
			sf.GetObjId('mpcon','mmcpconnect',10,function(mpconid){
			var concreate={mmcplistinfo:a.listinfo,mmcpkind:a.mode,mmcpconid:mpconid,mmcpprblist:a.mmcpprblist, createdate:sf.nodetime(), breaktime:a.breaktime, numprb:a.numprb}
				sf.getinfodb_par('insert into mmcpconnect set ? ', concreate, function(){
					socket.emit('mmcpconnectcreateafter');
				});
			});
		}else if(a.option==1){
			sf.getinfodb('update mmcpconnect set mmcpkind="'+a.mode+'", numprb="'+a.numprb+'", mmcplistinfo="'+a.listinfo+'", mmcpprblist="'+a.mmcpprblist+'", breaktime="'+a.breaktime+'" where mmcpconid="'+a.mmcpconid+'"',function(){
				
				socket.emit('mmcpconnectcreateafter');
			});
		}
		
	});

	socket.on('callmmcpprb',function(a){
		sf.getinfodb('select * from mmcpprb',function(b){
			var prblist=[];
			for(var ia=0; ia<b.length; ia++){
				prblist.push(b[ia].prbid);
			}

			var mmcpobj=[];
			sf.prbsetv2(prblist,function(prb){
				for(var ia=0; ia<prb.length; ia++){
					mmcpobj[ia]={mmcpprb:prb[ia],solutiontime:b[ia].solutiontime,mmcpid:b[ia].mmcpid}
				}
				socket.emit('callmmcpprbafter',{mmcpobj:mmcpobj});
			});
		});
	});

	socket.on('prbregister',function(a){
		sf.GetObjId('mcp','mmcpprb',10,function(mmcpid){
			var prbregi={prbid:a.prbid, solutiontime:a.solutiontime,createdate:sf.nodetime(),mmcpid:mmcpid,username:a.username};
			sf.getinfodb_par('insert into mmcpprb SET ? ',prbregi,function(){
				socket.emit('prbregisterafter',{prbid:a.prbid,mmcpid:mmcpid,cptid:a.cptid});
			});
		});
	});


	socket.on('mmcpcallprblist',function(c){
		sf.getinfodb('select * from cptproblemset where cptid="'+c.cptid+'"',function(a){
			var prblist=a[0].prblist.split(',');
			sf.prbsetv2(prblist,function(b){
				socket.emit('callprblistafter',{prblist:b});
			});
		});
	});



});


//video register

app.get('/vdrg/home',function(req,res){
	res.render('vdrg/vdrghome');
});

app.get('/vdrg/monitoring',function(req,res){
	res.render('vdrg/monitoringuser');
});

//Ans add
app.get('/admin/addans',function(req,res){
	res.render('vdrg/addans');
});


app.get('/vdrg/savedscreen',function(req,res){
	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			//res.render('vdrg/userinterface',{userinfo:req.user});
			res.render('vdrg/savedscreen',{username:req.user});
		}
	
	});

});
app.get('/vdrg/userinterface',function(req,res){

	//res.render('vdrg/userinterface');

	sf.LoginCheck(req.user,11,function(err){
		if(err){
			res.send(err);
		}else{
			res.render('vdrg/userinterface',{userinfo:req.user});
		}
	
	});


});


app.get('/vdrg/mmttallocation',function(req,res){
	res.render('vdrg/mmttallocation');
});
app.get('/vdrg/mentorstart',function(req,res){
	res.render('vdrg/mentorstart');
});
app.get('/vdrg/mentorcenter',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			sf.getinfodb('select cpt.cptoption,cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r.parentcol as r3id from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol order by cpt.instructorder asc', function(b){
			sf.getinfodb('select * from r3list',function(c){
				res.render('vdrg/mentorcenter',{userinfo:req.user,cps:b,c:c});
			})
			});
			//res.render('vdrg/userinterface',{userinfo:req.user});
		}
	
	});

});
app.get('/admin/calcreference',function(req,res){
	res.render('vdrg/calcreference');
});

app.get('/admin/prbvidcon',function(req,res){
	res.render('vdrg/prbvidcon');
});
app.get('/admin/video',function(req,res){
	res.render('vdrg/videolist');
})

//wrss
app.get('/vdrg/wrssmentor/userlist',function(req,res){
	res.render('vdrg/wrss/wrssuserlist')

});

app.get('/vdrg/wrssmentor',function(req,res){
	var username=req.query.username;
	var mentorid=req.query.mentorid;
	res.render('vdrg/wrss/wrssmentor',{username:username, mentorid:mentorid})
});

//webrtc

app.get('/vdrg/webrtctest',function(req,res){
	res.render('vdrg/webrtc/connectingtest');
});
app.get('/vdrg/webrtctestres',function(req,res){
	res.render('vdrg/webrtc/connectingtestres');
});

app.get('/admin/filter',function(req,res){
	res.render('vdrg/filter');
});
app.get('/admin/setleadfilter',function(req,res){
	res.render('vdrg/setleadfilter');
});

app.get('/admin/leadfiltertor1/edit',function(req,res){
	var cptid=req.query.cptid;
	res.render('vdrg/editr1filter',{cptid:cptid});
	
});

app.get('/admin/filter/assignuser',function(req,res){
	res.render('vdrg/assignuser');
});


app.get('/admin/filter/fruconnect',function(req,res){
	var username=req.query.username;
	var filterid=req.query.filterid;
	var cptid=req.query.cptid;
	var filterconid=req.query.filterconid;


	sf.getinfodb('select parentcol from filterconnect where childcol="'+filterconid+'" and  conkind="fru"',function(a){
	
		if(a.length!=0){	
			var fr1id=a[0].parentcol;
		}
		console.log(filterconid);
		res.render('vdrg/fruconnect',{username:username, filterid:filterid, cptid:cptid,filterconid:filterconid,fr1id:fr1id});	
	});
});

app.get('/vdrg/userclasshistory',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			//res.render('mmcp/mmcpconnect',{userid:req.user.username});


			sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
				res.render('vdrg/userclasshistory',{userinfo:req.user,cps:b});
			});


		}
	
	});

	
});

app.get('/vdrg/showuserhistory',function(req,res){
	sf.getcptStructure(function(a){
		//console.log(a[0].r2list);	
		res.render('vdrg/showuserhistory',{r2list:a[0].r2list});
	});
});

app.get('/admin/r1userhistory',function(req,res){
	sf.LoginCheck(req.user,0,function(err){
		if(err){
			res.send(err);
		}else{
			//res.render('mmcp/mmcpconnect',{userid:req.user.username});
			res.render('vdrg/adminr1userhistory',{userinfo:req.user});
		}
	
	});

})

app.get('/vdrg/hwuserhistory',function(req,res){
	sf.LoginCheck(req.user,1,function(err){
		if(err){
			res.send(err);
		}else{
			sf.getcptStructure(function(a){
				res.render('vdrg/hwuserhistory',{r2list:a[0].r2list,username:req.user});
			});

		}
	});


});

function mictime(){
	var hrTime=process.hrtime();
	return hrTime[0]*1000000+hrTime[1]/1000
}
function updateMMTTstatus(){
	vctime=0;

	//var starttime=mictime();
	//console.log('at the beginning of updatevdrg',mmttupdatelist);
	var splicelist=[[],[],[]];

	//console.log(mmttupdatelist);
	//console.log(mmttconnectionstate[0]);
	//console.log(mmttconnectionstate[1]);
	for(var ia=0; ia<mmttconnectionstate.length; ia++){
		var chk=0; 
		for(var ib=0; ib<mmttupdatelist[0].length; ib++){
			if(mmttupdatelist[0][ib][0]==mmttconnectionstate[ia].mentorid){
				chk=1;
				//mmttconnectionstate[ia].mentorsocketid=mmttupdatelist[0][ib][1];
				break;
			}
		}
		if(chk!=1){
			splicelist[0].push(mmttconnectionstate[ia].mentorid);
		}

	}

	for(var ia=0; ia<mmttconnectionstate.length; ia++){
		for(var ib=0; ib<mmttconnectionstate[ia].menteelist.length; ib++){
			var chk=0;
			for(var ic=0; ic<mmttupdatelist[1].length; ic++){
				if(mmttupdatelist[1][ic][0]==mmttconnectionstate[ia].menteelist[ib].username){
					//mmttconnectionstate[ia].menteelist[ib].menteesocketid=mmttupdatelist[1][ic][1];
					chk=1;
					break;
				}
			}
			if(chk==0){
				splicelist[1].push(mmttconnectionstate[ia].menteelist[ib].username);
			}
		}
	}


	for(var ia=0; ia<psc.length; ia++){
		var chk=0;
		for(var ib=0; ib<mmttupdatelist[2].length; ib++){
			if(mmttupdatelist[2][ib][1]==psc[ia][1]){
			//if(mmttupdatelist[2][ib][0]==psc[ia][0] && mmttupdatelist[2][ib][1]==psc[ia][1]){
				chk=1;
				break;
			}
		}
		if(chk==0){
			splicelist[2].push(psc[ia]);
		}
	}

	/*
	for(var ia=0; ia<mmttconnectionstate.length; ia++){
		for(var ic=0; ic<mmttconnectionstate[ia].menteelist.length; ic++){
			var chk=0;
			for(var ib=0; ib<mmttupdatelist[2].length; ib++){
				if(mmttupdatelist[2][ib][0]==mmttconnectionstate[ia].mentorid && mmttupdatelist[2][ib][1]==mmttconnectionstate[ia].menteelist[ic].username){
				//mmttupdatelist[2].push([a.username,a.socketid])
					chk=1;
					break;
				}
			}

			if(chk!=1){
				splicelist[2].push([mmttconnectionstate[ia].mentorid, mmttconnectionstate[ia].menteelist[ic].username]);
			}

		}
		
	}*/

	
	//console.log(mmttconnectionstate);
	//console.log(mmttupdatelist);
	//console.log('one that will be removed', splicelist);

	for(var ic=0; ic<splicelist[0].length; ic++){
		var chk=0;
		for(var ia=0; ia<mmttconnectionstate.length; ia++){
			if(mmttconnectionstate[ia].mentorid==splicelist[0][ic]){
				chk=1;
				break;
			}
		}
		if(chk==1){
			mmttconnectionstate[ia].connectionstate=0;
			//mmttconnectionstate[ia].mentorsocketid='';

		}else{
			mmttconnectionstate[ia].connectionstate=1;
		}
	}


	for(var ia=0; ia<mmttconnectionstate.length; ia++){
	for(var ib=0; ib<mmttconnectionstate[ia].menteelist.length; ib++){
		var chk=0;
		for(var ic=0; ic<splicelist[1].length; ic++){
			if(mmttconnectionstate[ia].menteelist[ib].username==splicelist[1][ic]){
				chk=1;
				break;
				//mmttconnectionstate[ia].menteelist[ib].connectionstate=0;
				//mmttconnectionstate[ia].menteelist[ib].menteesocketid='';


				/*
				if(mmttconnectionstate[ia].selfmentor==1){
				}else{
					var breakvalue=false;
					var allocatedmentorid=mmttconnectionstate[ia].menteelist[ib].allocatedmentorid;
					for(var id=0; id<mmttconnectionstate.length; id++){
						if(mmttconnectionstate[id].mentorid==allocatedmentorid){
							for(var ie=0; ie<mmttconnectionstate[id].wrssmenteelist.length; ie++){
								if(mmttconnectionstate[id].wrssmenteelist[ie].username==mmttconnectionstate[ia].menteelist[ib].username){
									//mmttconnectionstate[id].wrssmenteelist[ie].menteesocketid='';
									mmttconnectionstate[id].wrssmenteelist[ie].menteeconnectionstate=0;
									breakvalue=true;
									break;
								}
							}
							if(breakvalue){
								break;
							}
						
						}
					}
				}*/
			}
		}
		if(chk==1){
		 	mmttconnectionstate[ia].menteelist[ib].connectionstate=0;
		}else{
		 	mmttconnectionstate[ia].menteelist[ib].connectionstate=1;
		}
	}
	}



	for(var ic=0; ic<splicelist[2].length; ic++){
		for(var ia=0; ia<mmttconnectionstate.length; ia++){
			for(var id=0; id<mmttconnectionstate[ia].menteelist.length; id++){

				//console.log('splice2', splicelist[2][ic]);
				//console.log('splice2', mmttconnectionstate[ia].menteelist[id].username);
				//console.log('splice2', mmttconnectionstate[ia].menteelist[id].selfmentor);
				//console.log('splice2', mmttconnectionstate[ia].menteelist[id].allocatedmentorid);

				if(mmttconnectionstate[ia].menteelist[id].username==splicelist[2][ic][1]){
					mmttconnectionstate[ia].menteelist[id].wrssmentorconnectionstate=0;
					//mmttconnectionstate[ia].menteelist[id].wrssmentorsocketid='';
					/*
					var breakvalue=false;
					var allocatedmentorid=mmttconnectionstate[ia].menteelist[id].allocatedmentorid;
					for(var ie=0; ie<mmttconnectionstate.length; ie++){
						if(mmttconnectionstate[ie].mentorid==allocatedmentorid){
							console.log('splice5');
							for(var ig=0; ig<mmttconnectionstate[ie].wrssmenteelist.length; ig++){
								console.log('splice6');
								if(mmttconnectionstate[ie].wrssmenteelist[ig].username==mmttconnectionstate[ia].menteelist[id].username){
								console.log('splice7');
									mmttconnectionstate[id].wrssmenteelist[ig].wrssmentorsocketid='';
									mmttconnectionstate[id].wrssmenteelist[ig].wrssmentorconnectionstate=0;
									breakvalue=true;
									break;
								}
							}
							if(breakvalue){
								break;
							}
						
						}
					}*/



				}else{
					//mmttconnectionstate[ia].menteelist[id].wrssmentorconnectionstate=1;
				}

			
			}
			for(var ie=0; ie<mmttconnectionstate[ia].wrssmenteelist.length; ie++){
				if(mmttconnectionstate[ia].wrssmenteelist[ie].username==splicelist[2][ic][1]){
					mmttconnectionstate[ia].wrssmenteelist[ie].wrssmentorconnectionstate=0;
					//mmttconnectionstate[ia].wrssmenteelist[ie].wrssmentorsocketid='';
				}else{
					//mmttconnectionstate[ia].wrssmenteelist[ie].wrssmentorconnectionstate=1;
				}

			}
		}
	}


	/*
	for(var ic=0; ic<splicelist[2].length; ic++){
		for(var ia=0; ia<mmttconnectionstate.length; ia++){
		for(var id=0; id<mmttconnectionstate[ia].menteelist.length; id++){
			if(mmttconnectionstate[ia].mentorid==splicelist[2][ic][0] && mmttconnectionstate[ia].menteelist[id].username==splicelist[2][ic][1]){
				mmttconnectionstate[ia].menteelist[id].wrssmentorconnectionstate=0;
			}
		}
		}
	}*/
	//console.log('mmttupdatelist', mmttupdatelist);
	mmttupdatelist=[[],[],[]];
	//console.log(mictime()-starttime);	
	reUserRegistrationService();
}
function reUserRegistrationService(){
	mmttupdatelist=[[],[],[]];
	//console.log('start vdrgupdatelist', vdrgupdatelist)
	//console.log('start vdrgmanage', vdrgmanage)
	for(var ia=0; ia<mmttconnectionstate.length; ia++){
		//if(mmttconnectionstate[ia].connectionstate==1){
			io.of('vdrg').to(mmttconnectionstate[ia].mentorsocketid).emit('vdrgreregistrationservicecheck',{userlist:mmttconnectionstate[ia].menteelist});
		//}
		//if(mmttconnectionstate[ia].wrssmentor.wrssmentorconnectionstate==1){
		//}

		for(var ib=0; ib<mmttconnectionstate[ia].menteelist.length; ib++){
			//if(mmttconnectionstate[ia].menteelist[ib].connectionstate==1){
				var breakcheck=false;
				var chk0=0;
				for(var ic=0; ic<mmttconnectionstate.length; ic++){
					if(mmttconnectionstate[ic].mentorid==mmttconnectionstate[ia].menteelist[ib].allocatedmentorid){
						for(var id=0; id<mmttconnectionstate[ic].wrssmenteelist.length; id++){
							if(mmttconnectionstate[ic].wrssmenteelist[id].username==mmttconnectionstate[ia].menteelist[ib].username){
								chk0=1;
								io.of('vdrg').to(mmttconnectionstate[ia].menteelist[ib].menteesocketid).emit('vdrgreregistrationservicecheck',{mentorid:mmttconnectionstate[ia].mentorid,mentorsocketid:mmttconnectionstate[ia].mentorsocketid,connectionstate:mmttconnectionstate[ia].connectionstate,wrssmentorsocketid:mmttconnectionstate[ic].wrssmenteelist[id].wrssmentorsocketid,wrssmentorconnectionstate:mmttconnectionstate[ic].wrssmenteelist[id].wrssmentorconnectionstate});
								breakcheck=true;
									break;
							}
						}
					}
					if(breakcheck){
						break;
					}
				}
				if(chk0==1){
				}else{
				}
				//io.of('vdrg').to(mmttconnectionstate[ia].menteelist[ib].menteesocketid).emit('vdrgreregistrationservicecheck',{mentorid:mmttconnectionstate[ia].mentorid,mentorsocketid:mmttconnectionstate[ia].mentorsocketid,connectionstate:mmttconnectionstate[ia].connectionstate,wrssmentorsocketid:'',wrssmentorconnectionstate:''});
			//}
			//if(mmttconnectionstate[ia].menteelist[ib].wrssmentorconnectionstate==1){
				//io.of('vdrg').to(mmttconnectionstate[ia].menteelist[ib].wrssmentorsocketid).emit('vdrgreregistrationservicecheck',{userlist:mmttconnectionstate[ia].menteelist});
			//}
		}

		for(var ic=0; ic<mmttconnectionstate[ia].menteelist.length; ic++){
		//if(mmttconnectionstate[ia].menteelist[ic].connectionstate==1){
			//if(mmttconnectionstate[ia].menteelist[ic].wrssmentorconnectionstate==1){
				io.of('vdrg').to(mmttconnectionstate[ia].menteelist[ic].wrssmentorsocketid).emit('vdrgreregistrationservicecheck',{menteesocketid:mmttconnectionstate[ia].menteelist[ic].menteesocketid,mentorsocketid:mmttconnectionstate[ia].mentorsocketid});
			//}
		//}
		}
			
	}
	vctime=1;
	timer=setTimeout(updateMMTTstatus,5000);
}
var vctime;
var timer
var mmttconnectionstate=[];
//var mmttupdatelist
var psc;
sf.getMMTTconnection(function(a,b){
	mmttconnectionstate=a;
	psc=b;
	reUserRegistrationService();
})


var vdrg=io.of('/vdrg');
var vdrgupdatelist=[[],[]];
var mmttupdatelist=[[],[],[]];
var vdrgmanage={userlist:[]};
//var sit=setInterval(checkUserReg,10000);


vdrg.on('connection',function(socket){
	console.log('vdrg connected');


	socket.on('subjectanalysis2',function(a){
		if(a.mode=='getdata'){
			//sf.getinfodb('select * from rkconnect join cptproblemset on rkconnect.childcol = cptproblemset.cptid join r2list on r2list.r2id=rkconnect.parentcol order by r2list.r2order asc',function(c){
			sf.getinfodb('select * from cptproblemset where instructorder is not null order by instructorder asc, numid desc',function(c){
				socket.emit('subjectanalysis2after',{a:c});
			});
		}else if(a.mode=='getdata_modechange'){
			sf.getinfodb('select * from cptproblemset order by instructorder desc, numid desc',function(c){
				socket.emit('subjectanalysis2after',{a:c});
			});

		}else if(a.mode=='rankcallmodechange'){
			sf.getinfodb('select * from cptproblemset order by instructorder desc, numid desc',function(c){
				socket.emit('subjectanalysis2after',{a:c});
			});

		}else if(a.mode=='update'){
			sf.getinfodb('update cptproblemset set listinfo="'+a.listinfo+'" where cptid="'+a.cptid+'"',function(d){
				sf.getinfodb('select * from cptproblemset order by instructorder asc',function(c){
					socket.emit('subjectanalysis2after',{a:c});
				});
			});
		}else if(a.mode=='orderset'){
			var csen='';
			for(var ia=0; ia<a.rgprblist.length; ia++){
				if(ia==a.rgprblist.length-1){
					csen=csen+'when "'+a.rgprblist[ia][1]+'" then "'+ia+'"';
				}else{
					csen=csen+'when "'+a.rgprblist[ia][1]+'" then "'+ia+'" ';
				}
			}
			sf.getinfodb('update cptproblemset set instructorder= case cptid '+csen+' end',function(d){
			//sf.getinfodb('update cptproblemset set instructorder= case numid '+csen+' end',function(d){
				sf.getinfodb('select * from cptproblemset where instructorder is not null order by instructorder asc',function(c){
					socket.emit('subjectanalysis2after',{a:c});
				});

			});

		}else if(a.mode=='callprb'){
			sf.prbsetv2(a.prblist.split(','),function(prbcon){
				socket.emit('subjectanalysis2callprb',{prb:prbcon});
			});		
		}else if(a.mode=='insert'){
			if(a.topicmsg!=''){
				sf.GetObjId('cpt','cptproblemset',10,function(cptid){
					var crsdt={prblist:'',listinfo:a.topicmsg,createdate:sf.nodetime(),cptid:cptid,userid:'shjung'};
					sf.getinfodb_par('insert into cptproblemset SET ?',crsdt,function(rst){});
				});
			}

		}else if(a.mode=='rankcall'){
			sf.getinfodb('select * from cptproblemset order by instructorder desc, numid desc',function(c){


			sf.getinfodb('select * from rkconnect as r join rkconnect as a on r.childcol=a.parentcol join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol where r.parentcol="r3id.OXvRUH3d-9" order by a.rkorder asc, r2order asc',function(a){
					socket.emit('subjectanalysis2after',{a:a,b:c});
		
			});
			});

		}else if(a.mode=='changeshow'){
			sf.getinfodb('update cptproblemset set cptoption="'+a.option+'" where cptid="'+a.cptid+'"',function(c){
			sf.getinfodb('select * from cptproblemset where instructorder is not null order by instructorder asc, numid desc',function(d){
				//socket.emit('subjectanalysis2after',{a:d});
			});

			});

		};

	});
	socket.on('subjectanalysis',function(a){
		if(a.mode=='insert'){
			sf.getinfodb('insert into subanaltopiclist (instructorder,topictitle,createtime) select MAX(instructorder) +1, "'+a.topicmsg+'","'+sf.nodetime()+'" from subanaltopiclist',function(b){
			//sf.getinfodb('insert into subanaltopiclist (topictitle,createtime,instructorder) values ("'+a.topicmsg+'","'+sf.nodetime()+'","MAX(instrucorder)+1")',function(b){
				sf.getinfodb('select * from subanaltopiclist',function(c){
					socket.emit('subjectanalysisafter',{a:c});
				});
			});
		}else if(a.mode=='getdata'){
			sf.getinfodb('select * from subanaltopiclist order by instructorder asc',function(c){
				socket.emit('subjectanalysisafter',{a:c});
			});

		}else if(a.mode=='update'){
			sf.getinfodb('update subanaltopiclist set topictitle="'+a.topicmsg+'" where numid="'+a.numid+'"',function(d){
				sf.getinfodb('select * from subanaltopiclist order by instructorder asc',function(c){
					socket.emit('subjectanalysisafter',{a:c});
				});
			});

		}else if(a.mode=='orderset'){
			var csen='';
			for(var ia=0; ia<a.rgprblist.length; ia++){
				if(ia==a.rgprblist.length-1){
					csen=csen+'when '+a.rgprblist[ia][1]+' then "'+ia+'"';
				}else{
					csen=csen+'when '+a.rgprblist[ia][1]+' then "'+ia+'" ';
				}
			}
			sf.getinfodb('update subanaltopiclist set instructorder= case numid '+csen+' end',function(d){
				sf.getinfodb('select * from subanaltopiclist order by instructorder asc',function(c){
					socket.emit('subjectanalysisafter',{a:c});
				});

			});
		}
	});

	socket.on('admincallalluserlist',function(a){
		console.log(a);
		sf.getinfodb('select * from prismusers where position="11"',function(b){

				socket.emit('admincallalluserlistafter',{a:b})
		});
	})

	socket.on('userstatistics',function(a){
		if(a.mode=='r1rhstatistics'){
			sf.getinfodb('select * from rdcthistory where username="'+a.username+'"',function(b){
			sf.getinfodb('select prblist,r2id,r2listinfo,cptid,listinfo,r2order from cptproblemset join rkconnect on cptproblemset.cptid=rkconnect.childcol join r2list on r2list.r2id=rkconnect.parentcol',function(c){
				socket.emit('userstatisticsafter',{a:b,cpt:c});
			});
			});
		}
				
	});

	socket.on('managedata',function(a){
		if(a.mode=='insert'){
			sf.getinfodb('insert into studentinfo(applieddate,teachingplan,teachingresult,note,studentid,teacherid,createdate) values ("'+a.applieddate+'","'+a.teachingplan+'","'+a.teachingresult+'","'+a.note+'","'+a.studentid+'","'+a.teacherid+'","'+sf.nodetime()+'")',function(b){
				socket.emit('managedataafter',{a:a});
			});

		}else if(a.mode=='update'){
			var str={applieddate:a.applieddate,teachingplan:a.teachingplan,teachingresult:a.teachingresult,note:a.note};
		 	sf.getinfodb_par('update studentinfo SET ? where numid="'+a.numid+'"',str,function(rst){
				socket.emit('managedataafter',{a:a});
			});
		}else if(a.mode=='classupdateplan'){
			var str={teachingplan:a.teachingplan};
		 	sf.getinfodb_par('update studentinfo SET ? where numid="'+a.numid+'"',str,function(rst){
				//socket.emit('managedataafter',{a:a});
			});
		}else if(a.mode=='classupdateresult'){
			var str={teachingresult:a.teachingresult};
		 	sf.getinfodb_par('update studentinfo SET ? where numid="'+a.numid+'"',str,function(rst){
				//socket.emit('managedataafter',{a:a});
			});
	
		}else if(a.mode=='classupdatenote'){
			var str={note:a.teachingresult};
		 	sf.getinfodb_par('update studentinfo SET ? where numid="'+a.numid+'"',str,function(rst){
				//socket.emit('managedataafter',{a:a});
			});

		}
	});

	socket.on('studentinfogetdata',function(a){
		sf.getinfodb('select * from studentinfo where studentid="'+a.studentid+'" and teacherid="'+a.teacherid+'" order by applieddate desc',function(b){
			socket.emit('studentinfogetdataafter',{a:b});
		});
	});

	socket.on('mentorsearchword',function(v){
			sf.getinfodb('select prbid from prb where prbkorean like "%'+v.sch+'%"', function(c){
				var pid=[];
				for(var id=0; id<c.length; id++){
					pid.push(c[id].prbid)
				}
			//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			//sf.getinfodb('select prblist,listinfo,cptid from cptproblemset', function(b){

			//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			sf.prbsetv2(pid,function(prbcon){
				socket.emit('vdrggetprblist',{prbcon:prbcon,cptid:'searchword'});
				//socket.emit('cptprbcon',{crprbcon:ps,cps:b});
			//});		
			//});		
			});		
			});		

	});



	socket.on('userhomeworkwritingeval',function(a){
		if(a.evalnum==-1){
			var qry='select mp.mpicid, ps.ratingdetail,mp.prbid from mmcphomework as mp left join psreconnect as ps on mp.mpicid=ps.solvepic where ps.ratingdetail is null and mp.username="'+a.studentid+'" and mp.createdate >= "2022-03-04"';
		}else{
			var qry='select mp.mpicid, ps.ratingdetail, mp.prbid from mmcphomework as mp left join psreconnect as ps on mp.mpicid=ps.solvepic where ps.ratingdetail="'+a.evalnum+'" and mp.username="'+a.studentid+'" and mp.createdate >= "2022-03-04"';
		}
		sf.getinfodb(qry,function(b){
			var prblist=[];
			var numid=[];
			for(var ia=b.length-1; ia >= 0; ia--){
				prblist.push(b[ia].prbid);
				numid.push(b[ia].mpicid)
			}
			//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(c){
			sf.prbsetv2(prblist,function(prbcon){
				socket.emit(a.returnsocket,{prbcon:prbcon,cptid:'userhwwritingeval', numid:numid});
			//});
			});

		});
	});

	socket.on('userimmediatehistory',function(a){
		if(a.mode=='immediatehistory'){
		sf.getinfodb('select distinct prbid, numid, hisopt from rdcthistory where username="'+a.studentid+'" and (createdate between date_add(now(),interval -'+a.dtime+' hour) and now())',function(b){

		var prblist=[];
		var numid=[];
		for(var ia=b.length-1; ia >= 0; ia--){
			prblist.push(b[ia].prbid);
			
			numid.push([b[ia].numid,b[ia].hisopt])
		}
		//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
		sf.prbsetv2(prblist,function(prbcon){
			socket.emit(a.returnsocket,{prbcon:prbcon,cptid:'immediatehistory', numid:numid});
		//});
		});
		});
		}else if(a.mode=='userevalhistory'){
			sf.getinfodb('select prbid,solvepic from psreconnect as p where (select max(createdate) from psreconnect as q where q.prbid=p.prbid) = createdate and ratingdetail <= "'+a.evalnum+'" and userid="'+a.studentid+'" order by createdate asc',function(b){
			var prblist=[];
			var numid=[];
			for(var ia=b.length-1; ia >= 0; ia--){
				prblist.push(b[ia].prbid);
				numid.push(b[ia].solvepic)
			}
			//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(c){
			sf.prbsetv2(prblist,function(prbcon){
				socket.emit(a.returnsocket,{prbcon:prbcon,cptid:'userevalhistory', numid:numid});
			});

			
			//});
			});
		}
	});

	socket.on('calluserhwlist',function(a){
	sf.getinfodb('select mmcphwconnect.mmcpconid, mmcplistinfo, mmcphwconnect.mmcpprblist from mmcphwassign join mmcphwconnect on mmcphwconnect.mmcpconid=mmcphwassign.mmcpconid where mmcphwassign.userid="'+a.username+'"',function(b){
		socket.emit('calluserhwlistafter',{b:b});
	});
	});
	socket.on('getwebrtclog',function(a){
		fs.readFile('./log/userpagerefresh.log','utf8',function(err,data){
			var split1data=data.split('\n');
			var split2data=[];
			console.log(a);
			for(var ia=split1data.length-1; ia>split1data.length-100; ia--){
				if(split1data[ia].split(' ')[8]==a.username+',' || split1data[ia].split(' ')[8]=='wrss-'+a.mentorid+','){
					split2data.push(split1data[ia]);
				}
			}
			socket.emit('getwebrtclogafter',{data:split2data});
			//var userrelateddata=splitdata;
			//es.render('log/login',{data:data.split('\n'),userinfo:req.user});
		});

	});

	socket.on('hwuserhistoryprbresult',function(a){
		sf.prbsetv2(a.prblist,function(prbcon){
			socket.emit('hwuserhistoryprbresultafter',{prbcon:prbcon, wrsspic:a.wrsspic,hwpic:a.hwpic,instructprb:a.instructprb,glpic:a.glpic});
		})

	});


	socket.on('callstdlist',function(a){
		if(typeof a=='undefined'){
			sf.getinfodb('select pm.username,pm.Displayname,ass.mmcpconnectid,ass.asi, ass.assigninfo from prismusers as pm left join mmcpuserassign as ass on ass.userid=pm.username where pm.position=11',function(a){
				socket.emit('callstdlistafter',{a:a});
			});
		}else if(a.mode=='teacherstd'){
			sf.getinfodb('select pm.username,pm.Displayname from prismusers as pm join mmttconnection as mm on mm.childcol=pm.username  where mm.conopt=0 and mm.parentcol="'+a.username+'" and pm.position=11 order by pm.userregi asc',function(a){
				socket.emit('callstdlistafter',{a:a});
			});

		}else{
			/*sf.getinfodb('select * from (select mmttconnection.childcol, prismusers.DisplayName from mmttconnection join prismusers on prismusers.username=mmttconnection.childcol where mmttconnection.conopt=0 and mmttconnection.parentcol="'+a.username+'") as nm left join  ',function(a){
				socket.emit('callstdlistafter',{a:a});
			});*/
			sf.getinfodb('select mmcphwconnect.mmcplistinfo as listinfo, mmcphwconnect.mmcpconid,mmcphwconnect.mmcpprblist as prblist,mmttconnection.childcol as username, prismusers.DisplayName from mmttconnection join prismusers on prismusers.username=mmttconnection.childcol left join mmcphwassign on prismusers.username=mmcphwassign.userid left join mmcphwconnect on mmcphwassign.mmcpconid=mmcphwconnect.mmcpconid where mmttconnection.conopt=0 and mmttconnection.parentcol="'+a.username+'" order by prismusers.userregi asc, mmcphwconnect.createdate desc',function(a){
				socket.emit('callstdlistafter',{a:a});
			});


		}
	});



	socket.on('showuserdataresult',function(a){
		
		//sf.getinfodb('select prbid, ansresult, mpicid,createdate from wrsswritingpic where username="'+a.username+'" and createdate > date_sub(now(), interval '+a.time+' day) order by createdate asc',function(b){
		sf.getinfodb('select prbid, ansresult, mpicid,createdate from wrsswritingpic where username="'+a.username+'" and ((Date("'+a.time+'") < Date(createdate)) and (Date(createdate) <= Date("'+a.timestart+'"))) order by createdate asc',function(b){
		sf.getinfodb('select mm.prbid, mm.mpicid, mm.createdate,ps.ratingdetail,mm.timepassed from mmcphomework as mm left join psreconnect as ps on mm.mpicid=ps.solvepic where mm.username="'+a.username+'" and ((Date("'+a.time+'") < Date(mm.createdate)) and (Date(mm.createdate) <= Date("'+a.timestart+'"))) order by mm.createdate asc',function(c){
		sf.getinfodb('select prbid, createdate from rdcthistory where username="'+a.username+'" and (hisopt="instructprb" or hisopt="sharehwresult" or hisopt="sharehomeworkresult") and ((Date("'+a.time+'") < Date(createdate)) and (Date(createdate) <= Date("'+a.timestart+'"))) order by createdate asc',function(d){
		sf.getinfodb('select mmcppic.prbid, mmcppic.createdate,mmcppic.mpicid,mmcppic.ans,mmcppic.timepassed, mmcpprb.solutiontime from mmcppic join mmcpprb on mmcppic.mmcpid=mmcpprb.mmcpid where mmcppic.username="'+a.username+'" and mmcppic.mpicid is not null and ((Date("'+a.time+'") < Date(mmcppic.createdate)) and (Date(mmcppic.createdate) <= Date("'+a.timestart+'"))) order by mmcppic.createdate asc',function(e){
			
			socket.emit('showuserdataresultafter',{wwpic:b, hw:c,instruct:d,glpic:e,username:a.username});
		});
		});
		});
		});
		//var qry='select evalprb,numid,prbid,resultcode,createdate,hisopt,cptinfo from rdcthistory where username="'+a.username+'" and (hisopt="prbsolve" or hisopt="savetoask" or hisopt="instructprb") and createdate > date_sub(now(), interval '+a.time+' day) order by numid desc';
	});

	socket.on('socketstoptest',function(a){
		if(a.mode=='frommentor'){
			console.log('socketstoptest : from mentor to user ', a);
			socket.broadcast.to(a.usersocketid).emit('socketstoptesttouser');
		}else if(a.mode=='fromuser'){
			console.log('socketstoptest : from user to mentor', a);
			console.log(a.mentorinfo.mentorsocketid);
			socket.broadcast.to(a.mentorinfo.mentorsocketid).emit('socketstoptestafter');
			//socket.broadcast.to(a.mentorinfo.mentorsocketid).emit('socketstoptestafter',{mentorinfo:a.mentorinfo});
			socket.broadcast.to(a.mentorinfo.wrssmentorsocketid).emit('socketstoptestafter');
			
		}
		
	});

	socket.on('callwrsswritingpic',function(a){
		//sf.getinfodb('select distinct prbid from rdcthistory where username="'+a.studentid+'" and (createdate between date_add(now(),interval -'+a.dtime+' hour) and now())',function(b){
		sf.getinfodb('select * from wrsswritingpic where username="'+a.username+'" and (createdate between date_add(now(), interval -5 hour) and now())',function(b){
			//socket.emit('getcurrentvdrgusersafter',{users:mmttconnectionstate,userfile:a.userfile});
			socket.emit('callwrsswritingpicafter',{wwpic:b,users:mmttconnectionstate});
		})
	});

	socket.on('fortabletreport',function(a){
		if(a.modecheck=='webrtc'){
			var msg=sf.nodetime()+' WebRTC Log - usertype: '+a.usertype+', username: '+a.username+', msglist : '+a.msglist+'\n';
			fs.appendFile('./log/userpagerefresh.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});
		}else if(a.modecheck=='getstatecheck'){
			var msg=sf.nodetime()+' State Log - username: '+a.username+', statuscheck : '+a.a+'\n';
			fs.appendFile('./log/socketlog.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});

		}else if(a.modecheck=='socketcheck'){
			var msg=sf.nodetime()+' SOCKET Log - username: '+a.username+', statuscheck : '+a.a+'\n';
			fs.appendFile('./log/socketlog.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});

		}else if(a.modecheck=='socketidchange'){
			var msg=sf.nodetime()+' SOCKET.id Monitor - username: '+a.username+', status : '+a.a+'\n';
			fs.appendFile('./log/socketidchange.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});

		}


	});

	socket.on('wrssgetconnect',function(a){
		if(a.conoption=='connect'){
			socket.broadcast.emit('wrssgetconnectwrssafter');
		}else if(a.conoption=='disconnect'){
			socket.broadcast.emit('wrssgetconnectwrssafter');
		}else if(a.conoption=='reload'){
			socket.broadcast.to(a.usersocketid).emit('wrssgetconnectafter',{signalkind:'reload'});
		}else if(a.conoption=='pcobjectreload'){
			socket.broadcast.to(a.usersocketid).emit('wrssgetconnectafter',{signalkind:'pcobjectreload'});
		}

		/*
		if(a.conoption=='connect'){
			var chk=0;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				for(var ib=0;ib<mmttconnectionstate[ia].menteelist.length; ib++){
					if(mmttconnectionstate[ia].mentorid==a.mentorid){
						if(mmttconnectionstate[ia].menteelist[ib].username==a.username){
							socket.broadcast.to(mmttconnectionstate[ia].menteelist[ib].menteesocketid).emit('wrssgetconnectafter',{signalkind:'go'});
						}else{
							socket.broadcast.to(mmttconnectionstate[ia].menteelist[ib].menteesocketid).emit('wrssgetconnectafter',{signalkind:'stop'});
						}
										
					}
				}
			}
		}else if(a.conoption=='disconnect'){
			var chk=0;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				for(var ib=0;ib<mmttconnectionstate[ia].menteelist.length; ib++){
					if(mmttconnectionstate[ia].mentorid==a.mentorid){
						socket.broadcast.to(mmttconnectionstate[ia].menteelist[ib].menteesocketid).emit('wrssgetconnectafter',{signalkind:'stop'});
					}
				}
			}
		
		}else if(a.conoption=='reload'){
			console.log(a.usersocketid);
			socket.broadcast.to(a.usersocketid).emit('wrssgetconnectafter',{signalkind:'reload'});
		
		}*/

	});

	socket.on('wrssigvcontrol',function(a){
		socket.broadcast.to(a.menteesocketid).emit('wrssigvcontrolafter',{igvcontrol:a.igvcontrol});
	});

	socket.on('mmttserverstateupdate',function(){
		clearTimeout(timer)
		sf.getMMTTconnection(function(a,b){
			console.log(a);
			psc=b;
			mmttconnectionstate=a;
			reUserRegistrationService();
		})


	});
	socket.on('mmttupdate',function(a){
		sf.getinfodb('select childcol,numid from mmttconnection where parentcol="'+a.mmttmentorid+'"',function(oldlist){
				for(var ia=0; ia<oldlist.length; ia++){
					var chk=0;
					for(var ib=0; ib<a.chosenlist.length; ib++){
						if(oldlist[ia].childcol==a.chosenlist[ib]){
							chk=1;
							break;
						}
					}
					
					if(chk==0){
						sf.getinfodb('delete from mmttconnection where childcol="'+oldlist[ia].childcol+'"',function(){});
					}
				}

			var async=require('async');
			var count=0;
			async.whilst(
				function(callbackfunction){
					callbackfunction(null, a.chosenlist.length);
				//	return count<a.chosenlist.length
				},
				function(cback){

					var chk=0;
					for(var ib=0; ib<oldlist.length; ib++){
						if(a.chosenlist[count]==oldlist[ib].childcol){	
							chk=1;
							break;
						}
					}
					if(chk==0){
							sf.getinfodb('insert into mmttconnection (parentcol,childcol,conopt) values ("'+a.mmttmentorid+'","'+a.chosenlist[count][0]+'","'+a.chosenlist[count][1]+'")',function(){
								count++;
								cback(null);
							});
					
					}else{
						
						//sf.getinfodb('update mmttconnection set conopt="'+a.conopt+'" where childcol="'+a.chosenlist[count]+'"',function(){
							count++;
							cback(null);
						//});
					}
				},
				function(err){
					if(!err){
						socket.emit('mmttupdateafter');
						console.log(4);
					}else{
						console.log('mmttupdate error',err);
					}
			});
		});
	});
	socket.on('mmtttomentorcenter',function(a){
		if(a.mode=='tomentorcenter'){
			sf.getinfodb('delete from mmttconnection where parentcol="'+a.mentorid+'" and childcol="'+a.username+'" and conopt=1',function(b){
				socket.emit('mmtttomentorcenterafter',{msg:'mentorcenter deleted'});
			});	
		}else if(a.mode=='towrss'){
			//sf.getinfodb('select prblist, fcptid from mmttinstantprb where instantid=(select instantid from mmttinstantprb where mentorid="'+a.mentorid+'" and username="'+a.username+'" order by numid desc limit 1)', function(ma){
			sf.getinfodb('select numid from mmttconnection where parentcol="'+a.mentorid+'" and childcol="'+a.username+'" and conopt=1',function(b){
				if(b.length==0){
					sf.getinfodb('insert into mmttconnection (parentcol, childcol, conopt) values ("'+a.mentorid+'","'+a.username+'",1)',function(c){
						socket.emit('mmtttomentorcenterafter',{msg:'wrss is changed'});
					});
				}else{
						socket.emit('mmtttomentorcenterafter',{msg:'Already WRSS! there are unknown error. check!'});
				}
			});	
		}
	});
	socket.on('mmttcallunassignedusername',function(){
		sf.getinfodb('select pr.username from prismusers as pr left join mmttconnection as mmt on pr.username=mmt.childcol where pr.position=11 and mmt.parentcol is null',function(a){
			socket.emit('mmttcallunassignedusernameafter',{a:a});
		});
	});

	socket.on('mmttcallmentorlist',function(){
		sf.getinfodb('select pr.DisplayName, pr.username, mmt.childcol, mmt.conopt from prismusers as pr left join mmttconnection as mmt on pr.username=mmt.parentcol where pr.position=1',function(a){
			socket.emit('mmttcallmentorlistafter',{a:a});
		}); 		
	});


	socket.on('vdrgreregistrationserviceresponse',function(a){
		if(a.position=='mentee'){
			mmttupdatelist[1].push([a.username, a.socketid])
		}else if(a.position=='mentor'){
			mmttupdatelist[0].push([a.username, a.socketid])
		}else if(a.position=='wrssmentor'){
			mmttupdatelist[2].push([a.mentorid,a.username, a.socketid])
		}
	});

	socket.on('vdrgpicsizecontrol',function(a){
		/*
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==a.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('vdrgpicsizecontrolafter',{size:a.size, username:a.username});
		}else{
			console.log('failed in icecandidate')
		}*/
		socket.broadcast.to(a.usersocketid).emit('vdrgpicsizecontrolafter',{size:a.size});

	});

	socket.on('vdrgsharehomework',function(a){
		if(a.mode=='shareprb'){
			socket.broadcast.to(a.mentorsocketid).emit('vdrgsharehomeworkafter',{userfile:a.userfile,auxaddr:a.auxaddr,menteesocketid:a.menteesocketid,username:a.username,mode:a.mode});
				//socket.broadcast.to(a.mentorsocketid).emit('vdrgsharehomeworkafter',{userfile:a.userfile,auxaddr:a.auxaddr,menteesocketid:a.menteesocketid,username:a.username});
			//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			sf.prbsetv2([a.prbid],function(prbcon){
				socket.broadcast.to(a.mentorsocketid).emit('vdrggetprblist',{prbcon:prbcon,cptid:''});
			//})
			})


		}else if(a.mode=='shareprb_ind'){
			var chk=0;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				if(mmttconnectionstate[ia].mentorid==a.mentorid){
					chk=1;
					break;
				}
			}
			if(chk==1){
				//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
				sf.prbsetv2([a.prbid],function(prbcon){
					socket.broadcast.to(mmttconnectionstate[ia].mentorsocketid).emit('vdrggetprblist',{prbcon:prbcon,cptid:''});
				//})
				})
			}

		}else if(a.mode=='shareresultpic_noprb'){
			socket.broadcast.to(a.menteesocketid).emit('vdrgsharehomeworkafter',{userfile:a.userfile,auxaddr:a.auxaddr});
			console.log(a.mentorsocketid);
			socket.emit('vdrgsharehomeworkafter',{userfile:a.userfile,auxaddr:a.auxaddr,menteesocketid:a.menteesocketid,username:a.username});

		}else{
			socket.broadcast.to(a.menteesocketid).emit('vdrgsharehomeworkafter',{userfile:a.userfile,auxaddr:a.auxaddr});
			socket.broadcast.to(a.mentorsocketid).emit('vdrgsharehomeworkafter',{userfile:a.userfile,auxaddr:a.auxaddr,menteesocketid:a.menteesocketid,username:a.username});
			//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			sf.prbsetv2([a.prbid],function(prbcon){
				socket.broadcast.to(a.mentorsocketid).emit('vdrggetprblist',{prbcon:prbcon,cptid:''});
			//})
			})

		}

	
	});

	socket.on('getcurrentvdrgusers',function(a){
		socket.emit('getcurrentvdrgusersafter',{users:mmttconnectionstate,userfile:a.userfile,prbid:a.prbid});
	});

	socket.on('studentconcentrationcheck',function(a){
		socket.broadcast.to(a.mentorsocketid).emit('studentconcentrationcheckafter',{username:a.username,constatus:a.constatus});
		console.log(a);
	});
	socket.on('vdrgwrsssocketidregister',function(a){
	});
	socket.on('webrtctoservernewicecandidate',function(a){
		if(a.destination=='toresponder'){
			/*
			var chk=0; 
			for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
				if(vdrgmanage.userlist[ia].username==a.username){
					chk=1;
					break;
				}
			}

			if(chk==1){
				socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('webrtctorespondernewicecandidate',{newicecandidate:a.newicecandidate});
			}else{
				console.log('failed in icecandidate')
			}*/
			socket.broadcast.to(a.usersocketid).emit('webrtctorespondernewicecandidate',{newicecandidate:a.newicecandidate,mentormode:a.mentormode,wrssmentorsocketid:a.wrssmentorsocketid});

		}else{
			socket.broadcast.to(a.mentorsocketid).emit('webrtctocallernewicecandidate',{newicecandidate:a.newicecandidate});
		}
	});

	socket.on('webrtccallertoserver',function(a){
		/*
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==a.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('webrtcservertoresponder',{offer:a.offer});

		}else{
			socket.emit('vdrggetusersocketidafter',{usersocketid:vdrgmanage.userlist[ia].socketid,userstate:0});
			console.log('user is not exist');
		}*/
		socket.broadcast.to(a.usersocketid).emit('webrtcservertoresponder',{offer:a.offer,mentormode:a.mentormode,wrssmentorsocketid:a.wrssmentorsocketid});
		var msg=sf.nodetime()+' WebRTC Log - usertype: wrssmentor, username: '+a.username+', msglist : (in server) offer from wrss'+'\n';
		fs.appendFile('./log/userpagerefresh.log',msg,function(err){
			if(err) throw err;
			console.log('Saved');
		});




	});
	socket.on('webrtcrespondertoserver',function(a){
		socket.broadcast.to(a.mentorsocketid).emit('webrtcservertocaller',{answer:a.answer});
	});



	socket.on('communicationready',function(a){
		client.tokens.create().then(token=>{
			socket.emit('communicationreadyafter',{iceservers:token.iceServers});
		});
				
	});

	socket.on('vdrggetusersocketid',function(a){
			/*
			var chk=0; 
			for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
				if(vdrgmanage.userlist[ia].username==a.username){
					chk=1;
					break;
				}
			}

			if(chk==1){
				//socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('chattingtouser',{chatoption:3,chatmsg:a.chatmsg});

				client.tokens.create().then(token=>{
					console.log(token);
					socket.emit('vdrggetusersocketidafter',{usersocketid:vdrgmanage.userlist[ia].socketid,userstate:1,iceservers:token.iceServers});
				});
				console.log('self message to mentee');
			}else{
				socket.emit('vdrggetusersocketidafter',{usersocketid:vdrgmanage.userlist[ia].socketid,userstate:0});
				console.log('user is not exist');
			}*/
			console.log('vdrggtusername')
			console.log('client')
			console.log(client)
			client.tokens.create().then(token=>{
				console.log(token);
				socket.emit('vdrggetusersocketidafter',{iceservers:token.iceServers,opt:a.opt});
			});


	});


	socket.on('vdrgupdateleadfilterinfo',function(a){
		sf.getinfodb('update leadfilter set filterinfo="'+a.filterinfo+'" where filterid="'+a.leadfilter+'"',function(){
			socket.emit('vdrgupdateleadfilterinfoafter',{filterinfo:a.filterinfo, leadfilter:a.leadfilter});
		});
	});



	socket.on('vdrgsendscreeninfo',function(a){
		socket.broadcast.to(vdrgmanage.copysocketid).emit('vdrgsendscreeninfoafter',{userlist:vdrgmanage.userlist,imgobj:a.imgobj});
		
	});

	socket.on('vdrgevaluationprb',function(a){
		sf.getinfodb('update rdcthistory set evalprb="'+a.evalnum+'" where numid="'+a.numid+'"',function(b){
			socket.emit('vdrgevaluationprbafter',{classname:a.classname,evalnum:a.evalnum,numid:a.numid});
		});
		
	});
	socket.on('vdrgcopysocketregister',function(a){

		/*
		}else if(a.position==2){
			vdrgmanage.mentorsocketid=a.socketid;
			socket.emit('vdrgsocketidregisterafter',{userlist:vdrgmanage.userlist});
		}*/

		vdrgmanage.copysocketid=a.socketid;
		socket.emit('vdrgcopysocketidregisterafter',{userlist:vdrgmanage.userlist});
		//socket.broadcast.to(vdrgmanage.copysocketid).emit('vdrgcopyuserlistrefresh',{userlist:vdrgmanage.userlist});
		
	});

	socket.on('showuserhistoryprbdisplay',function(a){
		if(a.username!==undefined){
			var qry='select evalprb,numid,prbid,resultcode,createdate,hisopt,cptinfo from rdcthistory where username="'+a.username+'" and (hisopt="prbsolve" or hisopt="savetoask" or hisopt="instructprb" or hisopt="sharehwresult" or hisopt="sharewrssresult" or hisopt="shareglresult") and createdate > date_sub(now(), interval '+a.time+' day) order by numid asc';
		
		}else{
			var qry='select evalprb,numid,prbid,resultcode,createdate,hisopt,cptinfo from rdcthistory where (hisopt="prbsolve" or hisopt="savetoask" or hisopt="instructprb" or hisopt="sharehwresult" or hisopt="sharewrssresult" or hisopt="shareglresult") and createdate > date_sub(now(), interval '+a.time+' day) order by numid asc';
		}


		sf.getinfodb(qry,function(b){
			var plist=[];
			for(var ia=0; ia<b.length; ia++){
				plist.push(b[ia].prbid)	
			}

			//for(var ia=0; ia<plist.length;ia++){
				//console.log(plist[ia]);
			//}
			sf.prbsetv2(plist,function(c){
				var pset=[];
				for(var ia=0; ia<plist.length; ia++){
					pset[ia]=[c[ia],b[ia].prbid,b[ia].hisopt,b[ia].resultcode,b[ia].createdate,b[ia].cptinfo,b[ia].numid,b[ia].evalprb]
				}
				socket.emit('showuserhistoryprbdisplayafter',{plist:pset});
			});
		});
	});

	socket.on('showuserhistorycalluserlist',function(a){
		sf.getinfodb('select username, DisplayName from prismusers',function(a){
			socket.emit('showuserhistorycalluserlistafter',{a:a});
		});
	});


	socket.on('callfiltersetmentorcenter',function(a){
		sf.getinfodb('select lf.filterinfo,cpt.cptid,cpt.listinfo,lf.filterid, fc.filterconid as filterconid from leadfilter as lf join filterconnect as fc on lf.filterid =  fc.parentcol join cptproblemset as cpt on fc.childcol=cpt.cptid where fc.conkind="filtertor1"',function(a){
		sf.getinfodb('select fc.childcol as filterconid, fv.prbset as prbset from filterr1vari as fv join filterconnect as fc on fv.fr1id=fc.parentcol where fc.conkind="fru"',function(b){
		sf.rdcsRootcontentsobj(function(c){

			//sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
		//sf.getinfodb('select distinct cptid from filterr1vari',function(b){
			socket.emit('callfiltersetmentorcenterafter',{a:a,b:b,c:sf.buildSlotlist(c)});
			//socket.emit('filtercallfiltersetafter',{a:a,r1vari:b});
		});
		});	
		});	


	});

	socket.on('userstatisticsprbcall',function(a){
		sf.prbsetv2(a.plist,function(b){
			socket.emit('userstatisticsprbcallafter',{plist:b,pcontainernum:a.pcontainernum});
		});
	});


	socket.on('monitoringprbresult',function(a){
		sf.prbsetv2(a.plist,function(b){
			socket.emit('monitoringprbresultafter',{plist:b,rlist:a.rlist});
		});
	});

	socket.on('fruconnectupdatefr1',function(a){
		sf.getinfodb('select * from filterconnect where childcol="'+a.filterconid+'" and conkind="fru"',function(b){

			if(b.length==0){
				sf.GetObjId('flcon','filterconnect',10,function(flcon){
					var itm={parentcol:a.fr1id,childcol:a.filterconid,conkind:'fru',filterconid:flcon,createdate:sf.nodetime(),childcol2:a.cptid}
					sf.getinfodb_par('insert into filterconnect set ?',itm,function(c){
					});
				});
			}else{
				var childcol=b[0].childcol;
				var itm={parentcol:a.fr1id,childcol:childcol,conkind:'fru',filterconid:b[0].filterconid,createdate:sf.nodetime(),childcol2:b[0].childcol2}
					sf.getinfodb_par('update filterconnect set ? where childcol="'+childcol+'" and conkind="fru"',itm,function(c){
				});
			}
		});	
	});

	socket.on('fcuconnectcallr1variset',function(a){
		sf.getinfodb('select * from filterr1vari where cptid="'+a.cptid+'"',function(b){
			socket.emit('fcuconnectcallr1varisetafter',{a:b});
		});
	});

	socket.on('callregisteredcpt',function(a){

		sf.getinfodb('select fl.filterconid, fl.childcol, cpt.listinfo from filterconnect as fl join cptproblemset as cpt on fl.childcol = cpt.cptid where parentcol="'+a.filterid[0]+'" and fl.conkind="filtertor1"',function(b){
		//sf.getinfodb('select fl.filterconid, fl.childcol, cpt.listinfo from filterconnect as fl join cptproblemset as cpt on fl.childcol = cpt.cptid where parentcol="'+a.filterid+'" and fl.conkind="filtertor1"',function(b){

			sf.getinfodb('select childcol from filterconnect  where conkind="fru"',function(c){

			sf.rdcsRootcontentsobj(function(d){
				socket.emit('callregisteredcptafter',{a:b,filterid:a.filterid,b:c,c:sf.buildSlotlist(d)});


			});
			//socket.emit('callfiltersetmentorcenterafter',{a:a,b:b,c:sf.buildSlotlist(c)});





			});
		});
	});

	socket.on('userfilterupdate',function(a){
		sf.getinfodb('delete from filterconnect where parentcol="'+a.username+'" and conkind="usertofilter"',function(){
			console.log(a);

			var async=require('async');
			var count=0;
			
			async.whilst(
				function(callbackfunction){
					callbackfunction(null,count<a.filterlist.length)
					//return count<a.filterlist.length
				},
				function(cback){
				sf.GetObjId('flcon','filterconnect',10,function(flcon){
						sf.getinfodb('insert into filterconnect (parentcol,childcol,filterconid,conkind,createdate,rkorder) values ("'+a.username+'","'+a.filterlist[count][0]+'","'+flcon+'","usertofilter","'+sf.nodetime()+'","'+a.filterlist[count][1]+'")',function(){
							count++;
							cback(null);
						});

				});
				},
				function(err){
					if(!err){
						console.log('create filter update succeed');
						//socket.emit('createleadfilterafter');
					}else{
						console.log('createfilter error',err);
					}
			});
		});


	});

	socket.on('filtercallfilterset',function(){
		sf.getinfodb('select lf.filterinfo,cpt.cptid,cpt.listinfo,lf.filterid from leadfilter as lf join filterconnect as fc on lf.filterid =  fc.parentcol join cptproblemset as cpt on fc.childcol=cpt.cptid',function(a){
		sf.getinfodb('select distinct cptid from filterr1vari',function(b){
			socket.emit('filtercallfiltersetafter',{a:a,r1vari:b});
		});	
		});	
	});

	socket.on('filtercalluserlist',function(){
		sf.getinfodb('select username,DisplayName from prismusers where position="11"',function(a){
		sf.getinfodb('select * from filterconnect as fl join leadfilter as lf on fl.childcol=lf.filterid  where fl.conkind="usertofilter"',function(b){
			socket.emit('filtercalluserlistafter',{a:a,b:b});
		});
		});
	});

	socket.on('updatefr1',function(a){
		sf.getinfodb('update filterr1vari set prbset="'+a.chosenlist+'" where fr1id="'+a.fr1id+'"',function(){
			socket.emit('updatefr1after');
		});
	});

	socket.on('callr1filterlist',function(a){
		sf.getinfodb('select * from filterr1vari where cptid="'+a.cptid+'"',function(b){
			socket.emit('callr1filterlistafter',{a:b});
		});
	});

	socket.on('creater1varifilter',function(a){
			sf.GetObjId('fr1','filterr1vari',10,function(fr1){
			var itm={cptid:a.cptid, cptinfo:a.variinfo, createdate:sf.nodetime(),prbset:a.prbliststr,fr1id:fr1}
			sf.getinfodb_par('insert into filterr1vari set ? ', itm, function(b){
				socket.emit('creater1varifilterafter');
			});
			});
	});

	socket.on('callcptprbforfilter',function(a){
		sf.getinfodb('select * from cptproblemset where cptid="'+a.cptid+'"',function(b){
			var plist=b[0].prblist.split(',');
			sf.prbsetv2(plist,function(c){
				socket.emit('callcptprbforfilterafter',{prbcon:c,prbliststr:b[0].prblist});
			});
		});
	});

	socket.on('callincludedr1',function(a){
		sf.getinfodb('select fr.filterconid as filterconid,fr.parentcol as filterid, cpt.cptid as cptid, cpt.listinfo as listinfo from filterconnect as fr join cptproblemset as cpt on cpt.cptid=fr.childcol where parentcol="'+a.filterid+'" and conkind="filtertor1" order by fr.rkorder',function(b){
			socket.emit('callincludedr1after',{a:b});
		});
	});


	socket.on('filterupdateleadfiltertor1',function(a){
		//sf.getinfodb('delete from filterconnect where parentcol="'+a.chosenfilter+'" and conkind="filtertor1"',function(){

			sf.getinfodb('select childcol,numid from filterconnect where parentcol="'+a.chosenfilter+'" and conkind="filtertor1"',function(oldlist){

				for(var ia=0; ia<oldlist.length; ia++){
					var chk=0;
					for(var ib=0; ib<a.chosenlist.length; ib++){
						if(oldlist[ia].childcol==a.chosenlist[ib][0]){
							chk=1;
							break;
						}
					}
					if(chk==0){
						sf.getinfodb('delete from filterconnect where numid="'+oldlist[ia].numid+'"',function(){});
					}
				}

			var async=require('async');
			var count=0;
			
			async.whilst(
				function(callbackfunction){
					callbackfunction(null,count<a.chosenlist.length)
					//return count<a.chosenlist.length
				},
				function(cback){


					var chk=0;
					for(var ib=0; ib<oldlist.length; ib++){
						if(a.chosenlist[count][0]==oldlist[ib].childcol){	
							chk=1;
							break;
						}
					}
					if(chk==0){
						sf.GetObjId('flcon','filterconnect',10,function(flcon){
							sf.getinfodb('insert into filterconnect (parentcol,childcol,filterconid,conkind,createdate,rkorder) values ("'+a.chosenfilter+'","'+a.chosenlist[count][0]+'","'+flcon+'","filtertor1","'+sf.nodetime()+'","'+a.chosenlist[count][1]+'")',function(){
								count++;
								cback(null);
							});
					

						});
					}else{
						sf.getinfodb('update filterconnect set rkorder="'+a.chosenlist[count][1]+'" where numid="'+oldlist[ib].numid+'"',function(){
							count++;
							cback(null);
						});
					}
				},
				function(err){
					if(!err){
						console.log('create filter update succeed');
						socket.emit('createleadfilterafter');
					}else{
						console.log('createfilter error',err);
					}
			});
			});
		//});

	});

	socket.on('callfilterlist',function(){
	//	sf.getinfodb('select lf.filterid, lf.filterinfo, cp.prblist, lf.filterprb from leadfilter as lf join cptproblemset as cp on lf.filterr1=cp.cptid where lf.filteropt="r1leadfilter"',function(a){
		sf.getinfodb('select * from leadfilter ',function(a){
		//sf.getinfodb('select fr.childcol, lf.filterinfo, lf.filterid  from leadfilter as lf join filterconnect as fr on lf.filterid=fr.parentcol where conkind="filtertor1" ',function(a){
			socket.emit('callfilterlistafter',{a:a});
		});
	});

	socket.on('createleadfilter',function(a){
		sf.GetObjId('filterid','leadfilter',10,function(filterid){
			var itm={filterid:filterid,filterinfo:a.filterinfo,createdate:sf.nodetime()};
			sf.getinfodb_par('insert into leadfilter set ? ',itm,function(b){
				socket.emit('createleadfilterafter');
				
			});
		});
			
	});

	socket.on('vdrgcallleadfilterprblist',function(plist){
		var prblist=plist.plist.split(',');
		sf.prbsetv2(prblist,function(prbcon){
			socket.emit('vdrgcallleadfilterprblistafter',{prbcon:prbcon});
		})
	});




	socket.on('vdrgcallr1',function(a){
		sf.getinfodb('select * from rkconnect as rk join r2list as r2 on rk.parentcol=r2.r2id join cptproblemset as cpt on rk.childcol=cpt.cptid where r2.r2id="'+a.r2id+'" and rk.conkind="rc21" order by rk.rkorder', function(b){
			socket.emit('vdrgcallr1after',{b:b});
		});
	});


	socket.on('vdrgcallr2',function(a){
		sf.getinfodb('select r2.r2id, r2.r2listinfo from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id join r2list as r2 on rk.childcol=r2.r2id where r3.r3id="'+a.r3id+'" and rk.conkind="rc32" order by r2.r2order asc',function(b){
			socket.emit('vdrgcallr2after',{b:b});
		});
	});





	socket.on('vdrgcallr3set',function(){
		sf.getinfodb('select * from r3list',function(a){
			socket.emit('vdrgcallr3setafter',{a:a});	
		});
	});




	socket.on('vdrggetmulti',function(a){
		var multiv=sf.getPrbmulti(a.prbid)
		socket.emit('vdrggetmultiafter',{multiv:multiv});
	});

	socket.on('chattingtoserver',function(a){
		if(a.chatoption==0){
			socket.broadcast.to(a.usersocketid).emit('chattingtouser',{chatoption:0,chatmsg:a.chatmsg});
				
		}else if(a.chatoption==1){
			socket.broadcast.to(vdrgmanage.mentorsocketid).emit('chattingtouser',{chatoption:1,chatmsg:a.chatmsg,username:a.username});

		}else if(a.chatoption==2){
			socket.broadcast.to(vdrgmanage.mentorsocketid).emit('chattingtouser',{chatoption:2,chatmsg:a.chatmsg,username:a.username});
		}else if(a.chatoption==3){
			var chk=0; 
			for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
				if(vdrgmanage.userlist[ia].username==a.username){
					chk=1;
					break;
				}
			}

			if(chk==1){
				socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('chattingtouser',{chatoption:3,chatmsg:a.chatmsg});
				//socket.broadcast.to(siesmenteesocketid).emit('getlearningmaterialfrommentor',{crsname:ma.crsname,ele:ma.ele,prbs:mb,vidaddr:ma.vidaddr});
				console.log('self message to mentee');
			}else{
				console.log('user is not exist');
			}


		}
	});



	socket.on('reloadusernote',function(a){
		sf.getinfodb('select * from usernote where username="'+a.username+'" order by udate desc',function(b){
			var chk=0; 
			var num;
			for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
				if(vdrgmanage.userlist[ia].username==a.username){
					chk=1;
					num=ia;
					break;
				}
			}

			socket.emit('sendusernote',{a:b});
			/*
			if(chk==1){
				socket.emit('sendusernote',{a:b});
				console.log('Usernote to mentee');
			}else{
				console.log('user is not exist');
			}*/


		});
	});





	socket.on('monitorcallrcon',function(a){
		sf.rdcsRootcontentsobj(function(rcon){

		sf.getinfodb('select parentcol as username, childcol as filterid from filterconnect  where conkind="usertofilter"',function(a){
		//sf.getinfodb('select ft.childcol as cptid, fl.parentcol as username from filterconnect as fl join filterconnect as ft on fl.childcol = ft.parentcol where fl.conkind="usertofilter"',function(a){
	//linked from the past but not active yet
		sf.getinfodb('select fl.parentcol as filterid, fv.prbset , fv.fr1id, ft.childcol2 as cptid  from filterconnect as fl join filterconnect as ft on fl.filterconid=ft.childcol join filterr1vari as fv on fv.fr1id=ft.parentcol  where fl.conkind="filtertor1" and ft.conkind="fru"',function(b){
		//sf.getinfodb('select fv.cptid,fv.prbset from filterconnect as fl join filterr1vari as fv on fl.parentcol =fv.fr1id where fl.conkind="fru"',function(b){
		//sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
			socket.emit('monitorcallrconafter',{rcon:rcon,a:a,b:b});
		//sf.connRcontovideo(rcon,a.username,function(prbvidset){
		//sf.loadPrbtoprbvidset(prbvidset[rconnum],function(pvs){
		//	socket.emit('callmyrconafter',{mycon:pvs,rconnum:rconnum,runlength:prbvidset.length});
		//});
		//});
		});
		});
		});
	});


	socket.on('wrssmonitorfrommentortoserver',function(a){	
		socket.broadcast.to(a.usersocketid).emit('wrssmonitorfromservertomentee',{mentorinfo:a.mentorinfo});
	});
	socket.on('wrssmonitorfrommenteetoserver',function(a){
		sf.getinfodb('select * from rdcthistory where username="'+a.menteeinfo.username+'" and (createdate between date_add(now(), interval -5 hour) and now())',function(b){
			
			//sf.getinfodb('select distinct prbid from rdcthistory where username="'+a.studentid+'" and (createdate between date_add(now(),interval -'+a.dtime+' hour) and now())',function(b){
			//socket.emit('monitorfromservertomentor',{rconnum:a.rconnum,username:a.username});
			socket.broadcast.to(a.wrssmentorsocketid).emit('wrssmonitorfromservertomentor',{rconnum:a.rconnum,servertime:sf.nodetime(),rdcthis:b});
			//socket.broadcast.to(vdrgmanage.monitorsocketid).emit('monitorfromservertomentor',{rconnum:a.rconnum,username:a.username,servertime:sf.nodetime(),rdcthis:b});
		});

	});
	socket.on('monitorfrommenteetoserver',function(a){
		sf.getinfodb('select * from rdcthistory',function(b){
			
			//socket.emit('monitorfromservertomentor',{rconnum:a.rconnum,username:a.username});
			socket.broadcast.to(vdrgmanage.monitorsocketid).emit('monitorfromservertomentor',{rconnum:a.rconnum,servertime:sf.nodetime(),rdcthis:b});
			//socket.broadcast.to(vdrgmanage.monitorsocketid).emit('monitorfromservertomentor',{rconnum:a.rconnum,username:a.username,servertime:sf.nodetime(),rdcthis:b});
		});
	});

	socket.on('monitorfrommentortoserver',function(){
		var userlist=vdrgmanage.userlist;
		//for(var ia=0; ia<userlist.length; ia++){
		socket.broadcast.emit('monitorfromservertomentee');
			//socket.broadcast.to(userlist[ia].socketid).emit('monitorfromservertomentee');
		//}
	});

	socket.on('vdrgmonitor',function(a){
		vdrgmanage.monitorsocketid=a.socketid;
		socket.emit('vdrgmonitorafter',{userlist:vdrgmanage.userlist});
	});

	socket.on('vdrgwriterecord',function(a){
		var ist={prbid:a.prbid, createdate:sf.nodetime(),username:a.username,hisopt:a.hisopt,cptinfo:a.cptid,teacherid:a.teacherid};
		//var ist={prbid:a.prbid, createdate:sf.nodetime(),username:a.username,hisopt:a.hisopt,rconnum:a.cptid};
			sf.getinfodb_par('insert into rdcthistory set ?',ist,function(c){
			});

	});	

	socket.on('vdrgsharedinputsent',function(a){
		//send to mentee

		/*	
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==a.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('vdrgsharedinputafter',{prbobj:a.prbobj});
		}else{
			console.log('user is not exist');
		}*/
		socket.broadcast.to(a.usersocketid).emit('vdrgsharedinputafter',{prbobj:a.prbobj});
	});



	socket.on('vdrgmentorlevelcontrol',function(a){
		/*
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==a.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('vdrgmentorlevelcontrolafter',{levelstatus:a.levelstatus});
			console.log('Level is Adjusted');
		}else{
			console.log('user is not exist');
		}*/
		socket.broadcast.to(a.usersocketid).emit('vdrgmentorlevelcontrolafter',{levelstatus:a.levelstatus});


		if(a.levelstatus=='up'){
			sf.getinfodb('select prbid,cptinfo from rdcthistory where hisopt="savetoask" and username="'+a.username+'" order by numid desc limit 5',function(b){
				var plist=[];
				var cptlist=[];
				for(var ia=0; ia<b.length; ia++){
					cptlist[ia]=b[ia].cptinfo;
					plist[ia]=b[ia].prbid;
				}
				sf.prbsetv2(plist,function(prblist){
					socket.emit('vdrgmentorlevelcontrolupafter',{prblist:prblist,cptlist:cptlist});
				});
			});
		}


	});



	socket.on('vdrgsocketidregister',function(a){
		if(a.position==11){
			/*
			var ma=0;
			for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
				if(vdrgmanage.userlist[ia].username==a.username){
					ma=1;
					break;
				}
			}

			if(ma!=1){
				vdrgmanage.userlist.push(a);
				vdrgupdatelist.push([a.username,a.socketid]);
				console.log('vdrgupdatelist', vdrgupdatelist);
				socket.broadcast.to(vdrgmanage.mentorsocketid).emit('mentoruserlistrefresh',{userlist:vdrgmanage.userlist});
				socket.broadcast.to(vdrgmanage.copysocketid).emit('vdrgcopyuserlistrefresh',{userlist:vdrgmanage.userlist});
			}else{
				vdrgmanage.userlist[ia].socketid=a.socketid;
				var chk0=0;
				for(var ia=0; ia<vdrgupdatelist.length; ia++){
					if(a.username==vdrgupdatelist[ia][0]){
						chk0=1;
						break;
					}
				}
				if(chk0==1){
					vdrgupdatelist.splice(ia,1);
				}
				vdrgupdatelist.push([a.username,a.socketid]);
				console.log('vdrgupdatelist', vdrgupdatelist);
			}*/


			/*
			var breakcheck=false;
			var chk0=0;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				for(var ib=0; ib<mmttconnectionstate[ia].menteelist.length; ib++){
					if(mmttconnectionstate[ia].menteelist[ib].username==a.username){
						chk0=1;
						breakcheck=true;
						break;
					}
					
				}
				if(breakcheck){
					break;
				}
			}

			if(chk0==1){
				mmttconnectionstate[ia].menteelist[ib].connectionstate=1;
				mmttconnectionstate[ia].menteelist[ib].menteesocketid=a.socketid;
				console.log(mmttconnectionstate[ia].menteelist[ib]);
			}*/
	
			/*
			if(mmttconnectionstate[ia].menteelist[ib].connectionstate==1){
				var breakcheck=false;
				var chk0=0;
				for(var ic=0; ic<mmttconnectionstate.length; ic++){
					if(mmttconnectionstate[ic].mentorid==mmttconnectionstate[ia].menteelist[ib].allocatedmentorid){
						for(var id=0; id<mmttconnectionstate[ic].wrssmenteelist.length; id++){
							if(mmttconnectionstate[ic].wrssmenteelist[id].username==mmttconnectionstate[ia].menteelist[ib].username){
								chk0=1;
								io.of('vdrg').to(mmttconnectionstate[ia].menteelist[ib].menteesocketid).emit('vdrgreregistrationservicecheck',{mentorid:mmttconnectionstate[ia].mentorid,mentorsocketid:mmttconnectionstate[ia].mentorsocketid,connectionstate:mmttconnectionstate[ia].connectionstate,wrssmentorsocketid:mmttconnectionstate[ic].wrssmenteelist[id].wrssmentorsocketid,wrssmentorconnectionstate:mmttconnectionstate[ic].wrssmenteelist[id].wrssmentorconnectionstate});
								breakcheck=true;
									break;
							}
						}
					}
					if(breakcheck){
						break;
					}
				}
				if(chk0==1){
				}else{
				}
				//io.of('vdrg').to(mmttconnectionstate[ia].menteelist[ib].menteesocketid).emit('vdrgreregistrationservicecheck',{mentorid:mmttconnectionstate[ia].mentorid,mentorsocketid:mmttconnectionstate[ia].mentorsocketid,connectionstate:mmttconnectionstate[ia].connectionstate,wrssmentorsocketid:'',wrssmentorconnectionstate:''});
			}



			*/

			//to menteelist
			var breakcheck=false;
			var chk0=0;
			var allocatedmentorid;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				for(var ib=0; ib<mmttconnectionstate[ia].menteelist.length; ib++){
					if(mmttconnectionstate[ia].menteelist[ib].username==a.username){
						chk0=1;
						allocatedmentorid=mmttconnectionstate[ia].menteelist[ib].allocatedmentorid;
						breakcheck=true;
						break;
					}
					
				}
				if(breakcheck){
					break;
				}
			}




			var msg='';
			if(chk0==1){
				console.log('vctime : '+vctime);
				if(vctime==0){
					setTimeout(function(){
						mmttconnectionstate[ia].menteelist[ib].connectionstate=1;
						mmttconnectionstate[ia].menteelist[ib].menteesocketid=a.socketid;
						msg=sf.nodetime()+'In:CDCT mmttupdate,  usertype:mentee, username: '+a.username+', socketid:'+a.socketid+', notice: Process of Checking Fire'+'\n';
					},1000)
				}else if(vctime==1){
					mmttconnectionstate[ia].menteelist[ib].connectionstate=1;
					console.log('before id : '+mmttconnectionstate[ia].menteelist[ib].menteesocketid);
					mmttconnectionstate[ia].menteelist[ib].menteesocketid=a.socketid;
					console.log('after id : '+mmttconnectionstate[ia].menteelist[ib].menteesocketid);
					msg=sf.nodetime()+'In:CDCT mmttupdate,  usertype:mentee, username: '+a.username+', socketid:'+a.socketid+'\n';
	
				}else{
					console.log('unexpected error occurred')
					msg='unexpected error in CDCT mmttupdate'+'\n';
				}
				
			}

			//to wrssmenteelist
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				if(mmttconnectionstate[ia].mentorid==allocatedmentorid){
					for(var ib=0; ib<mmttconnectionstate[ia].wrssmenteelist.length; ib++){
						if(mmttconnectionstate[ia].wrssmenteelist[ib].username==a.username){
							mmttconnectionstate[ia].wrssmenteelist[ib].menteesocketid=a.socketid;
							mmttconnectionstate[ia].wrssmenteelist[ib].menteeconnectionstate=1;
						}
					}
				}
			}
		
			mmttupdatelist[1].push([a.username,a.socketid])


			//log
			fs.appendFile('./log/socketlog.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});




		}else if(a.position==2){
			//vdrgmanage.mentorsocketid=a.socketid;
			//socket.emit('vdrgsocketidregisterafter',{userlist:vdrgmanage.userlist});
		}else if(a.position==3){

			/*	
			var chk0=0;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				if(mmttconnectionstate[ia].mentorid==a.mentorid){
					chk0=1;
					break;
				}
			}

			if(chk0==1){
				//mmttconnectionstate[ia].wrssmentor.wrssmentorconnectionstate=1;
				//mmttconnectionstate[ia].wrssmentor.wrssmentorsocketid=a.socketid;
				for(var ib=0; ib<mmttconnectionstate[ia].menteelist.length; ib++){
					if(mmttconnectionstate[ia].menteelist[ib].username==a.username){
						mmttconnectionstate[ia].menteelist[ib].wrssmentorconnectionstate=1;
						mmttconnectionstate[ia].menteelist[ib].wrssmentorsocketid=a.socketid;
					}
				}
			}
			mmttupdatelist[2].push([a.mentorid,a.username,a.socketid])

			var msg=sf.nodetime()+' usertype:wrssmentor, username: '+a.mentorid+', socketid:'+a.socketid+'\n';
			fs.appendFile('./log/userpagerefresh.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});

			*/

			var chk0=0;
			var breakvalue=false;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){

				//mmttconnectionstate[ia].wrssmentor.wrssmentorconnectionstate=1;
				//mmttconnectionstate[ia].wrssmentor.wrssmentorsocketid=a.socketid;
				console.log('self1');
				for(var ib=0; ib<mmttconnectionstate[ia].wrssmenteelist.length; ib++){
					console.log('self2');
					if(mmttconnectionstate[ia].wrssmenteelist[ib].username==a.username){
							console.log('self3');
						if(mmttconnectionstate[ia].wrssmenteelist[ib].selfmentor==0){
							console.log('self4');
							mmttconnectionstate[ia].wrssmenteelist[ib].wrssmentorconnectionstate=1;
							mmttconnectionstate[ia].wrssmenteelist[ib].wrssmentorsocketid=a.socketid;
							mmttconnectionstate[ia].wrssmenteelist[ib].selfmentorstate=0;
							//send warning message to mentorcenter of mentee; wrssmentor first. 
							console.log('connection already established will be down');
						}else if(mmttconnectionstate[ia].wrssmenteelist[ib].selfmentor==1){
							console.log('self5');
							if(mmttconnectionstate[ia].wrssmenteelist[ib].selfmentorstate==0){
								console.log('self6');
								//send warning message; giving up the connection.
								console.log('connection refused because wrssmentor already connected');
							}else{
								console.log('self7');
								mmttconnectionstate[ia].wrssmenteelist[ib].wrssmentorconnectionstate=1;
								mmttconnectionstate[ia].wrssmenteelist[ib].selfmentorstate=1;
								mmttconnectionstate[ia].wrssmenteelist[ib].wrssmentorsocketid=a.socketid;
							}
						}
						//breakvalue=true;
						//break;
					}
				}
				//if(breakvalue){
					//break;
				//}
			}

			var chk0=0;
			var breakvalue=false;
			console.log('wrss1');
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				console.log('wrss2');
				for(var ib=0; ib<mmttconnectionstate[ia].menteelist.length; ib++){
					console.log('wrss3',ia);
					if(mmttconnectionstate[ia].menteelist[ib].username==a.username){
					if(mmttconnectionstate[ia].menteelist[ib].selfmentor==0 && mmttconnectionstate[ia].menteelist[ib].allocatedmentorid==a.mentorid){
							console.log('wrss4');
							mmttconnectionstate[ia].menteelist[ib].wrssmentorconnectionstate=1;
							mmttconnectionstate[ia].menteelist[ib].wrssmentorsocketid=a.socketid;
							mmttconnectionstate[ia].menteelist[ib].selfmentorstate=0;
							console.log('connection will be down')
					}else{
							if(mmttconnectionstate[ia].menteelist[ib].selfmentorstate==0){
							console.log('wrss5');
								//send warning message; giving up the connection.
								//console.log('connection refused because wrssmentor already connected');
							}else{
							console.log('wrss6');
								mmttconnectionstate[ia].menteelist[ib].wrssmentorconnectionstate=1;
								mmttconnectionstate[ia].menteelist[ib].selfmentorstate=1;
								mmttconnectionstate[ia].menteelist[ib].wrssmentorsocketid=a.socketid;
								console.log(mmttconnectionstate[ia].menteelist[ib],'wrss7');
							}

					}
					}
					//breakvalue=true;
					//break;
				}
				//if(breakvalue){
					//break;
				//}
			}



			mmttupdatelist[2].push([a.mentorid,a.username,a.socketid])

			var msg=sf.nodetime()+'In:CDCT mmttupdate,  usertype:wrssmentor, username: '+a.mentorid+', socketid:'+a.socketid+'\n';
			fs.appendFile('./log/socketlog.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});


		
			
		}else if(a.position==0){
			var chk0=0;
			for(var ia=0; ia<mmttconnectionstate.length; ia++){
				if(mmttconnectionstate[ia].mentorid==a.username){
					chk0=1;
					break;
				}
			}

			if(chk0==1){
				mmttconnectionstate[ia].connectionstate=1;
				mmttconnectionstate[ia].mentorsocketid=a.socketid;
			}
			mmttupdatelist[0].push([a.username,a.socketid])

			var msg=sf.nodetime()+'In:CDCT mmttupdate,  usertype:mentor, username: '+a.username+', socketid:'+a.socketid+'\n';
			fs.appendFile('./log/socketlog.log',msg,function(err){
				if(err) throw err;
				console.log('Saved');
			});

		}

	});

	socket.on('wrsssendscreeninfo',function(a){
		socket.broadcast.to(a.wrssmentorsocketid).emit('wrsssendscreeninfoafter',{imgobj:a.imgobj,username:a.username,prbinfo:a.prbinfo});
		//socket.broadcast.to(a.wrssmentorsocketid).emit('wrsssendscreeninfoafter',{userlist:vdrgmanage.userlist,imgobj:a.imgobj,username:a.username});
		
	});

	socket.on('wrsstestsinglecpt',function(a){
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==a.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			var slotlist=[['','','','','cpt.instantprb','','prb.TwGYPUrBtV,prb.ScyNdXpGxz']]
			var username='bob';
			var rconnum=0;
			sf.connRcontovideo(slotlist,username,function(prbvidset){
			sf.loadPrbtoprbvidset(prbvidset[rconnum],function(pvs){
				socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('callmyrconafter',{mycon:pvs,rconnum:rconnum,runlength:prbvidset.length});
				//socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('callmyrconafter');
			});
			});


		}else{
			console.log('user is not exist');
		}

			
	});


	socket.on('wrssaskscreeninfo',function(a){
		socket.broadcast.to(a.menteesocketid).emit('wrssaskscreeninfoafter');
		/*
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==a.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('wrssaskscreeninfoafter');
		}else{
			console.log('user is not exist');
		}*/

			
	});


	socket.on('mentortomenteedraw',function(ma){
		/*
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==ma.username){
				chk=1;
				break;
			}

		if(chk==1){
			socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('copypicsofmentor',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption});
		}else{
		//	console.log('user is not exist');
		}
		}*/
		socket.broadcast.to(ma.usersocketid).emit('copypicsofmentor',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption});

	});

	socket.on('mentortomenteedrawobject',function(ma){
		console.log('cdctma')
		console.log(ma)
		
		socket.broadcast.to(ma.usersocketid).emit('drawobjecttomentee',{originvar:ma});


	})
	socket.on('mentortomenteedrawerase',function(ma){
	
		socket.broadcast.to(ma.usersocketid).emit('eraseofmentor',{mode:ma.mode});


	});


	socket.on('mentortomenteeadjustpagenumber',function(ma){
		/*
		var chk=0; 
		for(var ia=0; ia<vdrgmanage.userlist.length; ia++){
			if(vdrgmanage.userlist[ia].username==ma.username){
				chk=1;
				break;
			}
		}

		if(chk==1){
			socket.broadcast.to(vdrgmanage.userlist[ia].socketid).emit('mentortomenteeadjustpagenumberafter',{rcnum:ma.rcnum});
		}else{
			console.log('user is not exist');
		}*/
		socket.broadcast.to(ma.usersocketid).emit('mentortomenteeadjustpagenumberafter',{rcnum:ma.rcnum});



	});


	socket.on('eraseofmentee',function(ma){
		socket.broadcast.to(ma.mentorsocketid).emit('eraseofmenteeafter');
	});

	socket.on('menteetomentordraw',function(ma){
		socket.broadcast.to(ma.mentorsocketid).emit('copypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
	});
	socket.on('menteetomentordrawobject',function(ma){
		
		
		socket.broadcast.to(ma.mentorsocketid).emit('drawobjecttomentor',{originvar:ma});


	})

	socket.on('wrssscreenaction',function(a){
		socket.broadcast.to(a.wrssmentorsocketid).emit('wrssscreenactionafter',{action:a.action,username:a.username});
	});


	socket.on('wrssshareprbobj',function(a){
		if(a.sendmode==0){

			console.log('testttttt');
			console.log(a);
			sf.prbsetv2(a.prblist,function(prbcon){
				socket.broadcast.to(a.wrssmentorsocketid).emit('wrssshareprbobjafter',{prbobj:a.prbobj,username:a.username,prbcon:prbcon});
			});

		}else if(a.sendmode==1){
			//socket.broadcast.to(vdrgmanage.mentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
		}else if(a.sendmode==2){
			//socket.broadcast.to(vdrgmanage.wrssmentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
			//socket.broadcast.to(vdrgmanage.mentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
		}

		
	});
	socket.on('wrssmenteetomentordraw',function(ma){
	
		if(ma.sendmode==0){
			socket.broadcast.to(ma.wrssmentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
		}else if(ma.sendmode==1){
			socket.broadcast.to(ma.mentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
		}else if(ma.sendmode==2){
			socket.broadcast.to(ma.wrssmentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
			socket.broadcast.to(ma.mentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
		}
	});


	socket.on('wrssmentortomenteedraw',function(ma){
	

		if(ma.sendmode==0){
			socket.broadcast.to(ma.menteesocketid).emit('wrsscopypicsofmentor',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption});
		}else if(ma.sendmode==1){
			//socket.broadcast.to(ma.mentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
		}else if(ma.sendmode==2){
			//socket.broadcast.to(ma.wrssmentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
			//socket.broadcast.to(ma.mentorsocketid).emit('wrsscopypicsofmentee',{pos:[ma.pos[0],ma.pos[1]],mousestat:ma.mousestat,statoption:ma.statoption,username:ma.username});
		}



	});

	socket.on('rdctremovesta',function(a){
		//sf.getinfodb('delete from rdcthistory where prbid="'+a.prbid+'" and username="'+a.username+'"',function(b){
			//socket.emit('rdctremovestaafter');
		//});
		sf.getinfodb('select username from rdcthistory where username="'+a.username+'" and prbid="'+a.prbid+'" and ( hisopt="savetoask" or hisopt="rmsavetoask" or hisopt="mrmsavetoask")',function(aa){
			if(aa.length%2==1){
				var ist={prbid:a.prbid, createdate:sf.nodetime(),username:a.username,hisopt:'rmsavetoask',cptinfo:a.cptid};
					sf.getinfodb_par('insert into rdcthistory set ?',ist,function(c){
						socket.emit('rdctsavetoaskafter',{prbid:a.prbid});	
					});
			}else{
				console.log('system error in savetoask at removing');
			}
		});

	});

	socket.on('rdctsavetoasklistreload',function(a){
		sf.prbsetv2(a.prblist,function(plist){
			socket.emit('rdctsavetoasklistreloadafter',{plist:plist})
		});
	});

	socket.on('rdctcallsavetoasklist',function(a){
		sf.callSavetoask(a.username,function(b,c,d){
			socket.emit('rdctcallsavetoasklistafter',{stalist:b,plist:c,cptlist:d});
		});
	});

	socket.on('rdctsavetoask',function(a){

		sf.getinfodb('select username from rdcthistory where username="'+a.username+'" and prbid="'+a.prbid+'" and ( hisopt="savetoask" or hisopt="rmsavetoask" or hisopt="mrmsavetoask")',function(aa){

			console.log(aa);
			
			if(aa.length%2==0){

				var ist={prbid:a.prbid, createdate:sf.nodetime(),username:a.username,hisopt:a.hisopt,rconnum:a.rconinfo[0], cptinfo:a.cptid};
				sf.getinfodb_par('insert into rdcthistory set ?',ist,function(c){
					socket.emit('rdctsavetoaskafter',{prbid:a.prbid});	
				});
			}else{
				console.log('system error in savetoask at inserting');
			}
		});

	});

	socket.on('rdctiknowitalready',function(a){
		var ist={prbid:a.prbid, createdate:sf.nodetime(),username:a.username,hisopt:a.hisopt,rconnum:a.rconinfo[0]};
		sf.getinfodb_par('insert into rdcthistory set ?',ist,function(b){
			socket.emit('rdctiknowitalreadyafter');	
		});
		
	});

	socket.on('rdctrankcall',function(){
		sf.getinfodb('select * from rkconnect as a join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol order by rkorder asc, r2order asc',function(a){
		//sf.getinfodb('select * from rkconnect as a join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol order by rkorder asc',function(a){
			socket.emit('rdctrankcallafter',{a:a});
		});
	});



	socket.on('senduseractivity',function(a){
		var ist={prbid:a.prbid, resultcode:a.resultcode,createdate:sf.nodetime(),username:a.username,hisopt:a.hisopt,rconnum:a.rconinfo[0],cptinfo:a.cptinfo};
		sf.getinfodb_par('insert into rdcthistory set ?',ist,function(b){
			socket.emit('rdctiknowitalreadyafter');
		});
	});

	socket.on('registeranstoprb',function(a){
		 var title = a.title;
		 var description=a.description;
		//	var jmode=req.body.jmode;
		var jmode=a.multiopt;
		var fpath='./spam/crtfromweb/'+title+'.js';
			if(!fs.existsSync(fpath) && jmode==0){
				fs.writeFile(fpath,description,function(err){
					var exec = require('child_process').exec;
					var child0=exec('cp ./spam/crtfromweb/'+title+'.js ./spam/',function(err,stdout,stderr){if(err){throw err;}});
					var child = exec('cp -f ./spam/'+title+'.js ./public/jscontent',function(err,stdout,stderr){ if(err){throw err;}});
					//var child = exec('cp -rf ./spam/*.js ./public/jscontent',function(err,stdout,stderr){ if(err){throw err;}});
					if(err){
						res.status(500).send('Internal Server Error');
					}
					socket.emit('registeranstoprbafter',{multians:a.multians});
					//res.redirect('/admin/createform?title='+title+'&rstcode=SuccessfullyCreated!');
			
				});
			}else if(fs.existsSync(fpath) && jmode==0){
				res.redirect('/admin/createform?title='+title+'&rstcode=FileExistsT.T');
			}else if(!fs.existsSync(fpath) && jmode==1){
				res.redirect('/admin/createform?title='+title+'&rstcode=ThereIsNoFileT.T');
			}else if(fs.existsSync(fpath) && jmode==1){
				fs.writeFile(fpath,description,function(err){
					var exec = require('child_process').exec;
					var child0=exec('cp ./spam/crtfromweb/'+title+'.js ./spam/',function(err,stdout,stderr){if(err){throw err;}});
					var childn = exec('rm ./public/jscontent/'+title+'.js',function(err,stdout,stderr){ if(err){throw err;}});
					var child = exec('cp ./spam/'+title+'.js ./public/jscontent',function(err,stdout,stderr){ if(err){throw err;}});
					//var child = exec('cp -rf ./spam/*.js ./public/jscontent',function(err,stdout,stderr){ if(err){throw err;}});
					if(err){
						console.log(10);
						res.status(500).send('Internal Server Error');
					}
					socket.emit('registeranstoprbafter',{multians:a.multians});
					//res.redirect('/admin/createform?title='+title+'&rstcode=SuccessfullyOverwrited!');
			
				});
			}



	});

	socket.on('addanscallunassigned',function(a){
	
		//sf.PCSPickingFreePrbcon(function(unassprbcon,unassprbidstr){
		sf.NUSDpickingFreeprb(function(fl){
			if(a.multiopt==0){
				sf.prbsetv4(fl,function(plist){
					socket.emit('callprblistansafter',{plist:plist});
				});
			}else{

				sf.prbsetv5(fl,function(plist){
					socket.emit('callprblistansafter',{plist:plist});
				});
			}
		});
	});
	socket.on('callprblistans',function(a){
		console.log(a.multiopt);
		if(a.multiopt==0){
			sf.prbsetv4(a.plist,function(b){
				socket.emit('callprblistansafter',{plist:b});
			});
		}else{
			sf.prbsetv5(a.plist,function(b){
				socket.emit('callprblistansafter',{plist:b});
			});

		}
	});

	socket.on('callmyrcon',function(a){
		if(a.state=='ini'){
			sf.decideRconnum(a.username,function(rconnum){	
			sf.rdcsRootcontentsobj(function(rcon){
			sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
			//sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
			sf.connRcontovideo(Nslotlist,a.username,function(prbvidset){
			var rconnum=0;
			sf.loadPrbtoprbvidset(prbvidset[rconnum],function(pvs){
				socket.emit('callmyrconafter',{mycon:pvs,rconnum:rconnum,runlength:prbvidset.length,rcon:rcon});
			});
			});
			});
			});
			});
		}else if(a.state=='prv'){
			sf.rdcsRootcontentsobj(function(rcon){
			sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
			sf.connRcontovideo(Nslotlist,a.username,function(prbvidset){
			sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
				socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
			});
			});
			});
			});
		}else if(a.state=='next'){
			sf.rdcsRootcontentsobj(function(rcon){
			sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
			sf.connRcontovideo(Nslotlist,a.username,function(prbvidset){
			sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
				socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
			});
			});
			});
			});
		}else if(a.state=='curr'){
			sf.rdcsRootcontentsobj(function(rcon){
			sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
			sf.connRcontovideo(Nslotlist,a.username,function(prbvidset){
			sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
				socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
			});
			});
			});
			});

		}else if(a.state=='instantprb'){
			sf.instantPrbstoretotable(a.slotlist,[a.mentorid, a.username]);
			sf.connRcontovideo(a.slotlist,a.username,function(prbvidset){
			sf.loadPrbtoprbvidset(prbvidset[0],function(pvs){
				socket.broadcast.to(a.menteesocketid).emit('callmyrconafter',{mycon:pvs,rconnum:0,runlength:prbvidset.length,setigv:1});
			});
			});
			
		}else if(a.state=='instantprbprv'){
			var fslotlist=[];
			sf.getinfodb('select prblist, fcptid from mmttinstantprb where instantid=(select instantid from mmttinstantprb where mentorid="'+a.mentorid+'" and username="'+a.username+'" order by numid desc limit 1)', function(ma){
				for(var ia=0; ia<ma.length; ia++){
					fslotlist.push(['','','','',ma[ia].fcptid,'',ma[ia].prblist]);
				}
				sf.connRcontovideo(fslotlist,ma.username,function(prbvidset){
				sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
				socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
				});
				});
				});

		}else if(a.state=='instantprbnext'){
			var fslotlist=[];
			sf.getinfodb('select prblist, fcptid from mmttinstantprb where instantid=(select instantid from mmttinstantprb where mentorid="'+a.mentorid+'" and username="'+a.username+'" order by numid desc limit 1)', function(ma){
				for(var ia=0; ia<ma.length; ia++){
					fslotlist.push(['','','','',ma[ia].fcptid,'',ma[ia].prblist]);
				}
				sf.connRcontovideo(fslotlist,ma.username,function(prbvidset){
				sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
				socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
				});
				});
				});
				

		}else if(a.state=='instantprbcurr'){
			var fslotlist=[];
			sf.getinfodb('select prblist, fcptid from mmttinstantprb where instantid=(select instantid from mmttinstantprb where mentorid="'+a.mentorid+'" and username="'+a.username+'" order by numid desc limit 1)', function(ma){
				for(var ia=0; ia<ma.length; ia++){
					fslotlist.push(['','','','',ma[ia].fcptid,'',ma[ia].prblist]);
				}
				sf.connRcontovideo(fslotlist,ma.username,function(prbvidset){
				sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
					socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
					//socket.broadcast.to(a.menteesocketid).emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
				});
				});


			});
		}else if(a.state=='mentordriven'){
			if(a.igv==0){
				sf.rdcsRootcontentsobj(function(rcon){
				sf.applyLeadFilter(a.username,sf.buildSlotlist(rcon),function(Nslotlist){
				sf.connRcontovideo(Nslotlist,a.username,function(prbvidset){
					if(prbvidset.length<a.rconnum+1){
						socket.broadcast.to(a.mentorsocketid).emit('vdrgmentordrivenfail',{setlength:prbvidset.length});
					}else{
						sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
							socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
						});
					}
				});
				});
				});
			}else if(a.igv==1){
				var fslotlist=[];
				sf.getinfodb('select prblist, fcptid from mmttinstantprb where instantid=(select instantid from mmttinstantprb where mentorid="'+a.mentorid+'" and username="'+a.username+'" order by numid desc limit 1)', function(ma){
					for(var ia=0; ia<ma.length; ia++){
						fslotlist.push(['','','','',ma[ia].fcptid,'',ma[ia].prblist]);
					}
					sf.connRcontovideo(fslotlist,ma.username,function(prbvidset){
					sf.loadPrbtoprbvidset(prbvidset[a.rconnum],function(pvs){
						socket.emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
						//socket.broadcast.to(a.menteesocketid).emit('callmyrconafter',{mycon:pvs,rconnum:a.rconnum,runlength:prbvidset.length});
					});
					});


				});

			}else{
				console.log('error occurred in mentordriven turntopage; igv is outof range, igv= ',a.igv );
			}

		}
	});

	socket.on('rconnumbertovideo',function(){
		sf.getinfodb('select rk.parentcol, rk.numid, rk.childcol, vi.vidaddr, vi.vidinfo from rkconnect as rk join videocont as vi on rk.parentcol=vi.id where conkind="rcvideo0"',function(vi){
	
			sf.rdcsRootcontentsobj(function(rcon){
				fs.readdir('./spam',(err,files)=>{
				
					socket.emit('rconnumbertovideoafter',{vi:vi,rcon:rcon,files:files});
				});
			});
		});
	});

	socket.on('calcreference',function(a){
		sf.getinfodb('select r3.r3id, r3.listinfo as r3listinfo, r2.r2id, r2.r2listinfo as r2listinfo,cpt.cptid as r1id, cpt.listinfo as r1listinfo, cpt.prblist as prblist from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id join rkconnect as rk2 on rk.childcol=rk2.parentcol join r2list as r2 on r2.r2id=rk2.parentcol join cptproblemset as cpt on rk2.childcol=cpt.cptid order by r3.r3order, r2.r2order, rk2.rkorder',function(a){
		//sf.getinfodb('select * from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id where rk.conkind="rc32" order by rk.rkorder',function(a){
		//sf.getinfodb('select * from rkconnect as rk join r2list as r2 on rk.parentcol=r2.r2id where rk.conkind="rc21" order by rk.rkorder',function(b){
			socket.emit('calcreferenceafter',{a:a});
			//socket.emit('calcreferenceafter',{a:a,b:b});
		//});
		});
	});

	socket.on('vdrgregistervideoprb',function(a){

		sf.getinfodb('delete from rkconnect where parentcol="'+a.chosenvid+'" and conkind="rcvideo0"',function(){
		sf.GetObjId('conid','rkconnect',10,function(conid){

			var async=require('async');
			var count=0;
			
			async.whilst(
				function(callbackfunction){
					callbackfunction(null,count<a.chosenlist.length);
					//return count<a.chosenlist.length
				},
				function(cback){
						sf.getinfodb('insert into rkconnect (parentcol,childcol,rkorder,conid,conkind,createdate) values ("'+a.chosenvid+'","'+a.chosenlist[count][0]+'","'+a.chosenlist[count][1]+'","'+conid+'","rcvideo0","'+sf.nodetime()+'")',function(){
							count++;
							cback(null);
						});

				},
				function(err){
					if(!err){
						console.log('succeed');
						socket.emit('vdrgregistervideoprbafter');
					}else{
						console.log('cpt error',err);
					}
			});
		});
		});




	
	});


	socket.on('vdrgdisplaychosenlist',function(a){
		var prblist=[];
		for(var ia=0; ia<a.chosenlist.length; ia++){
			prblist.push(a.chosenlist[ia][0]);
		}	
		sf.prbsetv2(prblist,function(prbcon){
			socket.emit('vdrgdisplaychosenlistafter',{prbcon:prbcon});
		});
	});

	socket.on('vdrgcallvideolist',function(){
		sf.getinfodb('select v.id, v.vidaddr,vidinfo,rk.childcol,rk.rkorder,rk.conkind from videocont as v left join rkconnect as rk on v.id=rk.parentcol where rk.conkind is null or rk.conkind="rcvideo0" order by v.numid desc',function(a){
			socket.emit('vdrgcallvideolistafter',{a:a});
		});
	});

	socket.on('vdrgcallprblist',function(plist){
		var prblist=plist.plist.split(',');
		//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
		sf.prbsetv2(prblist,function(prbcon){
			socket.emit('vdrggetprblist',{prbcon:prbcon,cptid:plist.cptid});
		//})
		})
	});



	socket.on('rankcall',function(b){
		console.log(b);
		if(typeof b!=='undefined'){
			if(b.r3id=="r3id.jCdf6GgI6C"){
				sf.getinfodb('select * from rkconnect as r join rkconnect as a on r.childcol = a.parentcol join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol  where r.parentcol = "'+b.r3id+'" order by r2order asc, b.instructorder asc',function(a){
		//sf.getinfodb('select * from rkconnect as a join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol order by rkorder asc',function(a){
					socket.emit('rankcallafter',{a:a});
				});
			}else{
				sf.getinfodb('select * from rkconnect as r join rkconnect as a on r.childcol = a.parentcol join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol  where r.parentcol = "'+b.r3id+'" order by a.rkorder asc, r2order asc, b.instructorder asc',function(a){
		//sf.getinfodb('select * from rkconnect as a join cptproblemset as b on a.childcol = b.cptid join r2list as c on c.r2id =a.parentcol order by rkorder asc',function(a){
				socket.emit('rankcallafter',{a:a});
				});

			}
		}else{
		}
	});


	socket.on('subjectanalysisrankcall',function(c){
		if(c.option=='mentorcenter'){
			sf.getinfodb('select cpt.cptoption,cpt.instructorder, cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol where cpt.instructorder is not null and instructorder < "'+c.numlimit+'" and r.parentcol="r3id.jCdf6GgI6C" order by cpt.instructorder asc', function(b){
				socket.emit('subjectanalysisrankcallafter',{a:b,option:c.option});
				//socket.emit('rankcallafter',{a:b,option:c.option});
			});
		}else if(c.option=='subjectanalysis'){
		}
	});

	socket.on('vdrgcreateupload',function(a){
		sf.GetObjId('mov','videocont',10,function(vid){
			var istr={id:vid,userid:'shjung',date:sf.nodetime(),vidaddr:a.vidaddr}
			sf.getinfodb_par('insert into videocont set ?',istr,function(b){
				socket.emit('vdrgcreateuploadafter',{vid:vid,vidaddr:a.vidaddr});
			});
		});


	});

	socket.on('vdrgupdateaddr',function(a){
		sf.getinfodb('update videocont set vidaddr="'+a.vidaddr+'", vidinfo="'+a.vidinfo+'" where id="'+a.vid+'"',function(b){
			sf.getinfodb('select * from videocont order by numid desc',function(a){
				socket.emit('callvideolistafter',{a:a});
			});

		});
	});

	socket.on('vdrgcreate',function(a){
		sf.GetObjId('mov','videocont',10,function(vid){
			var istr={id:vid,userid:'shjung',date:sf.nodetime(),vidaddr:a.vidaddr}
			sf.getinfodb_par('insert into videocont set ?',istr,function(b){
				sf.getinfodb('select * from videocont order by numid desc',function(a){
					socket.emit('callvideolistafter',{a:a});
				});
			});
		});


	});

	socket.on('callvideolist',function(){
		sf.getinfodb('select * from videocont order by numid desc',function(a){
			socket.emit('callvideolistafter',{a:a});
		});
	});
});

app.get('/vdrg/subjectanalysis_mentor',function(req,res){
	if(typeof req.query.username !== 'undeinfed'){
		var username=req.query.username;
		//res.render('vdrg/r1userstatistics',{username:username,userinfo:req.user});

		/*
		sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol where r.parentcol="r3id.jCdf6GgI6C"', function(b){
		//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id from rkconnect as rk join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol', function(b){
			res.render('vdrg/subjectanalysis_mentor',{username:username,userinfo:req.user,cps:b});
		});*/

		sf.getinfodb('select * from r3list',function(a){
		sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id, r.parentcol as parent,cpt.instructorder,cpt.cptoption from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol order by r2.r2order asc, instructorder asc', function(b){
		//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol where r.parentcol="r3id.jCdf6GgI6C" order by r2.r2order asc', function(b){
			res.render('vdrg/subjectanalysis2',{cps:b,r3list:a,username:username, userinfo:req.user,mode:'mentor'});
		});
		})



	}else{
		var msg='로그인을 하시고 와주세요. <a href="/">LogIn </a>'
		res.send(msg);
	}

});



app.get('/admin/subjectanalysis2',function(req,res){

		sf.getinfodb('select * from r3list',function(a){
		sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id, r.parentcol as parent,cpt.instructorder,cpt.cptoption from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol order by r2.r2order asc, instructorder asc', function(b){
		//sf.getinfodb('select cpt.prblist,cpt.listinfo,cpt.cptid,r2.r2listinfo,r2.r2order, rk.rkorder as r1order, r2.r2id from rkconnect as r join rkconnect as rk on r.childcol=rk.parentcol join cptproblemset as cpt on rk.childcol=cpt.cptid join r2list as r2 on r2.r2id=rk.parentcol where r.parentcol="r3id.jCdf6GgI6C" order by r2.r2order asc', function(b){
			res.render('vdrg/subjectanalysis2',{cps:b,r3list:a,mode:'admin',userinfo:''});
		});
		})




});

app.get('/admin/subjectanalysis',function(req,res){
	res.render('vdrg/subjectanalysis');
});

//create contents option
app.get('/admin/createcontents',function(req,res){
	res.render('nusd/createcontents');
});
//fuzzy
app.get('/test/fuzzy',function(req,res){
	res.render('test/fuzzy');
});

//test
app.get('/test/svg',function(req,res){
	res.render('test/svg5');
});

app.get('/test/html2canvas',function(req,res){
	res.render('test/html2canvas');
});
app.get('/test/copycanvas',function(req,res){
	res.render('vdrg/copycanvas');
});
//download

app.get('/uploadfile',function(req,res){
	res.render('multer/uploadfile');
});
app.post('/uploadfile',upload.single('myFile'),function(req,res){
	res.send('succeed:'+req.file);
});
//uploadQuestion



/*
var strquestion = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,__dirname+'/public/uploadquestion/');
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
});
var uploadquestion=multer({storage:strquestion});

app.post('/uploadquestion',uploadquestion.single('questionfile'),function(req,res){
	res.status(200).send();
});*/
app.post('/questionxhr',function(req,res){
	console.log('questioin xhr');
	var form = new formidable.IncomingForm();
	//form.uploadDir = path.join(__dirname,'public');
	form.keepExtensions= true;

	form.on('fileBegin',function(name,file){
		console.log(1);
		//var ext=file.name.split('.')[file.name.split('.').length-1]
		file.path = __dirname+'/public/uploadquestion/'+name;
	//	sf.getinfodb('update prb set prbpickor="/prismpics/'+name+'.'+ext+'" where prbid="'+name+'"',function(){});
	});

	form.on('file',function(name,file){
		console.log(2);
		//console.log(name);
		//console.log(file);	
	});
	form.parse(req,function(a,b,c){//err,key_value1, keyvalue2;
		console.log(3);
		res.send('xhr question succeed');
	});
});



//chart
app.get('/chart',function(req,res){
	res.render('chart/charthome');
});


app.get('/vdrg/r1userstatistics',function(req,res){
	if(typeof req.query.username !== 'undeinfed'){
		var username=req.query.username;
		res.render('vdrg/r1userstatistics',{username:username,userinfo:req.user});

	}else{
		var msg='로그인을 하시고 와주세요. <a href="/">LogIn </a>'
		res.send(msg);
	}

});

app.get('/studentinfo',function(req,res){

	res.render('vdrg/studentinfo/studentinfo');
});



app.get('/display/r2list',function(req,res){
	sf.getinfodb('select * from r2list',function(a){
		res.render('mysqldisplay/r2list',{a:a});
	});
});

app.get('/display/rkconnect',function(req,res){
	sf.getinfodb('select * from rkconnect',function(a){
		res.render('mysqldisplay/rkconnect',{a:a});
	});
});














app.get('/quatertimer/createindex',function(req,res){
	res.render('util/createindex');
});
app.get('/quatertimer',function(req,res){
	res.render('util/quaterwriting');
});

var whalse_storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,__dirname+'/public/whalse');
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
});
var whalse_upload=multer({storage:whalse_storage});




app.get('/pdfbuild',function(req,res){
	res.render('pdfbuild/pdfbuild');
});


app.get('/hana/whalse/input',function(req,res){
	res.render('hana/whalse_input');
});

app.get('/hana/whalse/selectoutput',function(req,res){
	console.log(typeof req.query.fieldstring);
	if(typeof req.query.fieldstring !== 'undefined'){
	//if(Object.keys(req.query).length===0){
		var fieldstring=req.query.fieldstring;
		res.render('hana/whalse_selectoutput',{fieldstring:fieldstring,selectpclist:req.query.selectpclist});

	}else{
		res.render('hana/whalse_selectoutput',{fieldstring:null,selectpclist:req.query.selectpclist});
	}

});
app.get('/hana/whalse/output',function(req,res){
	console.log(typeof req.query.fieldstring);
	if(typeof req.query.fieldstring !== 'undefined'){
	//if(Object.keys(req.query).length===0){
		var fieldstring=req.query.fieldstring;
		res.render('hana/whalse_output',{fieldstring:fieldstring});

	}else{
		res.render('hana/whalse_output',{fieldstring:null});
	}
});
app.get('/hana/whalse/orderlistedit',function(req,res){
	res.render('hana/orderlistedit');
});
app.get('/hana/whalse/backdatareview',function(req,res){
	res.render('hana/backdatareview');
});

app.get('/hana/whalse/board',function(req,res){
	res.render('hana/whalseboard');
});
app.get('/hana/whalse/processinglist',function(req,res){
	res.render('hana/processinglist');
});

app.post('/whalse_uploadinvoice',whalse_upload.single('whalse_data'),function(req,res){
	var invoicefile = fs.readFile(req.file.path,'utf8',function(err,data){
		if(err) throw err;
		res.send('',{data:data});
		//console.log(req.file.path);
		//socket.emit('whalseinvoiceafter',{data:data});
	});
});

app.post('/whalsephotoupload',function(req,res){
	console.log('whalsephotoupload xhr');
	var form = new formidable.IncomingForm();
	form.keepExtensions= true;

	form.on('fileBegin',function(name,file){
		var ext=file.originalFilename.split('.')[file.originalFilename.split('.').length-1]
		file.filepath = __dirname+'/public/whalse/whalsephoto/'+name+'.'+ext;
		file.newFilename=name+'.'+ext;

	});

	
	form.on('file',function(name,file){
		//console.log(name);
		//console.log(file);

	});
	form.parse(req,function(a,b,c){//err,key_value1, keyvalue2;
		//console.log(a)
		//console.log(b)
		//console.log(c)
		//sf.whalsegetinfodb('update statusconnect set status'+b.scode+'pic="'+c[b.fname].newFilename+'" where initialdataconnect="'+b.numid+'"',function(){
		//});
		//console.log(c[b.fname].filepath)




	});
	form.on('end',function(){
		//res.send('xhr qprb succeed');
	});
});



var XLSX=require('xlsx');

var validdata=['numid','operationid','ordernum','engid','chid','sellid','sellername','payment','deliveryfee','discount','sku_price','order_status','order_date','pay_date','shipment','w_orderday','url','post_code','contact_num','phonenum','pro_name','quantity','unit','pro_num','model','offer_id','sku_id','material_number','item_name','item_color','item_size','match_id','search_name','search_color','search_size','order_name','order_color','order_size','order_quantity','parcel_code','depart_time','delivery_status','barcode','kor_item_name','kor_option','img_url','plcode','totalpayment','statuscode','arrival0num','arrival1num','arrival2num','arrival3num','status0text','status1text','status2text','status3text','status0pic','status1pic','status2pic','status3pic','parcelnumbering']

app.post('/whalse_uploadfile',whalse_upload.single('whalse_data'),function(req,res){
	res.send('succeed:'+req.file);
	console.log(req.file);
	var workbook = XLSX.readFile(req.file.path);
	var sheet_name_list = workbook.SheetNames;
	var xlData=XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);


	var whalsedata=[];
	//for(var ia=0; ia<xlData.length; ia++){
		//whalsedata.push(Object.values(xlData[ia]))	
	//}





	//server setting and datasetting harmonic test
	for(let v of validdata){
		var stchk=0;
		for(s in xlData[0]){
			if(v == s){
				stchk=1;
				break;
			}
		}
		if(stchk==0){
			console.log('(validdata referenced)missing variable: '+v);
		}
	}

	for(let v in xlData[0]){
		var stchk=0;
		for(s of validdata){
			if(v == s){
				stchk=1;
				break;
			}
		}
		if(stchk==0){
			console.log('(backdata referenced)missing variable: '+v);
		}
	}


	sf.whalsegetinfodb('select match_id as mid from initialdata',function(k){



		var validrow=[];
		var chk1=0;
		for(var ib=0; ib<xlData.length ; ib++){
			var chk=0;
			for(var ia=0; ia<k.length; ia++){
				if(k[ia].mid==xlData[ib].match_id){
					chk=1;
					break;
				}
			}
			if(chk==0){
				chk1=1;
				validrow.push(ib)
			}		
		}


		//if chk1 is 1 then inserting process is started otherwise cancled. 
		if(chk1==1 || k.length==0){
			sf.WhalseGetObjId('backdatamanage',10,function(fid){
				var bdata={operationid:fid,createdate:sf.nodetime(),originalfilename:req.file.originalname,trialresult:'succeed'}
				sf.whalsegetinfodb_par('insert into backdatamanage set ?',bdata,function(){});
				var exec = require('child_process').exec;
				var child0=exec('cp ./public/whalse/'+req.file.originalname+' ./public/whalse/validrowdata/'+fid+'_'+req.file.originalname,function(err,stdout,stderr){if(err){throw err;}});


				console.log('process on going');
				var inserthead='';
				for(var ia=0; ia<validdata.length; ia++){
					if(ia==0){
						inserthead='('+validdata[ia]+',';
					}else if(ia!=validdata.length-1){
						inserthead=inserthead+validdata[ia]+',';
					}else{
						inserthead=inserthead+validdata[ia]+')';
					}
				}

				var wh='';
				var count=0;
				for(let t in validrow){
				//for(var ic=0; ic<xlData.length; ic++){

					var whalsedata=[];
					for(let v of validdata){
						var stchk=0;
						for(s in xlData[0]){
							if(v == s){
								stchk=1;
								whalsedata.push([v,'"'+xlData[t][v]+'"'])
								break;
							}
						}
						if(stchk==0){
							console.log('(validdata referenced)missing variable: '+v);
							if(v=='statuscode'){
								whalsedata.push([v,0])
							//}else if(v=='arrival0num' || v=='arrival1num' || v=='arrival2num' || v=='arrival3num'){
								//whalsedata.push([v, null])
							}else if(v=='operationid'){
								whalsedata.push([v,'"'+fid+'"'])
								
							}else{
								whalsedata.push([v,null])
							}
						}
					}


					var sqlstc='';
					for(var ia=0; ia<whalsedata.length; ia++){
						if(ia==0){
							sqlstc='('+whalsedata[ia][1]+',';
						}else if(ia!=whalsedata.length-1){
							sqlstc=sqlstc+whalsedata[ia][1]+',';	
						}else{
							sqlstc=sqlstc+whalsedata[ia][1]+')';
						}
					}



					if(count!=validrow.length-1){
						wh=wh+sqlstc+',';
					}else{
						wh=wh+sqlstc;
					}

					count++;



				}

				//console.log(wh);

				//console.log(sqlstc);
				//console.log(inserthead);
				//console.log(whalsedata);




					sf.whalsegetinfodb('insert into initialdata '+inserthead+' values '+wh,function(){
						//res.redirect('/nusd/createtext');
				});

			})

			
		}else{
			console.log('process is stop');
			sf.WhalseGetObjId('backdatamanage',10,function(fid){
				var bdata={operationid:fid,createdate:sf.nodetime(),originalfilename:req.file.originalname,trialresult:'failed'}
				sf.whalsegetinfodb_par('insert into backdatamanage set ?',bdata,function(){});
			});
		}
	});


	/*

	for(var ia=0; ia<whalsedata.length; ia++){
		//sqlstc='("'+whalsedata[ia][1]+'","'+whalsedata[ia][5]+'","'+whalsedata[ia][22]+'","'+whalsedata[ia][23]+'","'+whalsedata[ia][24]+'","'+whalsedata[ia][25]+'","'+whalsedata[ia][26]+'","'+whalsedata[ia][27]+'","'+whalsedata[ia][28]+'","'+whalsedata[ia][39]+'","'+whalsedata[ia][40]+'","'+whalsedata[ia][43]+'")';
		sqlstc='("'+whalsedata[ia][1]+'","'+whalsedata[ia][5]+'","'+whalsedata[ia][14]+'","'+whalsedata[ia][22]+'","'+whalsedata[ia][23]+'","'+whalsedata[ia][24]+'","'+whalsedata[ia][25]+'","'+whalsedata[ia][26]+'","'+whalsedata[ia][27]+'","'+whalsedata[ia][28]+'","'+whalsedata[ia][39]+'","'+whalsedata[ia][40]+'","'+whalsedata[ia][42]+'","'+whalsedata[ia][43]+'","'+whalsedata[ia][44]+'","'+whalsedata[ia][45]+'","'+whalsedata[ia][46]+'","'+whalsedata[ia][47]+'","'+whalsedata[ia][48]+'")';


		if(ia!=whalsedata.length-1){
			wh=wh+sqlstc+',';
		}else{
			wh=wh+sqlstc;
		}
	}
	//var sst='(5,5,5,5,5,5,5,5,5,5,5,5)'
//	sf.whalsegetinfodb('insert into whalseworld.initialdata (ordernum,compnum,documentnum,product,optioncode,chineseproduct,chineseoption, chinesesize, invoicenummatch,invoicenum,timedeparture,orderdate) values '+sqlstc,function(){
	sf.whalsegetinfodb('insert into initialdata (ordernum,compnum,ordernum2,documentnum,product,optioncode,chineseproduct,chineseoption, chinesesize, invoicenummatch,invoicenum,timedeparture,departureoption,orderdate,barcodenum,productname,optiondetail,countnum,imageaddr) values '+wh,function(){
		//res.redirect('/nusd/createtext');
	});*/

	
});



var whalse=io.of('/whalse');

//var statedata=['arrival0num','arrival1num','arrival2num','arrival3num','status0text','status1text','status2text','status3text','status0pic','status1pic','status2pic','status3pic']
whalse.on('connection',function(socket){
	console.log('vdrg connected');


	socket.on('outgoingdata',function(a){
		if(a.option=='insert'){
			console.log(a);
			sf.whalsegetinfodb('insert into processinglist (createdate, parcelcodelist,branchoffice,roundnum,madenum,arrivaldate) values ("'+sf.nodetime()+'","'+a.pcdata+'","'+a.officebranch+'","'+a.roundnum+'","'+a.madenum+'","'+a.arrivaldate+'")',function(){
				socket.emit('outgoingdataafter',{option:'insert'})
			});
		}else if(a.option=='call'){
			sf.whalsegetinfodb('select w_orderday, parcel_code from initialdata',function(e){
			sf.whalsegetinfodb('select * from processinglist',function(b){
			sf.whalsegetinfodb('select * from orderlist',function(c){
				socket.emit('outgoingdataafter',{option:'call',a:b,orderlist:c, e:e})
			});
			});
			});
		}else if(a.option=='update'){
			sf.whalsegetinfodb('update processinglist set outgoingdate="'+a.outgoingdate+'" where numid="'+a.numid+'"',function(b){
				console.log(b);
				socket.emit('outgoingdataafter',{option:'update',a:b})
			});

		}
	});

	socket.on('quatertimeindex',function(a){
		console.log(a);
		if(a.mode=='create'){
		sf.whalsegetinfodb('insert into quatertimeindex (teacherid,indexinfo) values ("'+a.teacherid+'","'+a.operationinfo+'")',function(b){});
		}else if(a.mode=='update'){
			sf.whalsegetinfodb('update quatertimer set oindex="'+a.idxnumid+'" where numid="'+a.quaternumid+'"',function(b){});
		}
	});

	socket.on('getindexlist',function(a){
		sf.whalsegetinfodb('select * from quatertimeindex where teacherid="'+a.teacherid+'"',function(b){
			socket.emit('getindexlistafter',{a:b});
		});
	});

	socket.on('contentchange',function(a){
		sf.whalsegetinfodb('update initialdata set '+a.item+'="'+a.content+'" where numid="'+a.numid+'"',function(b){
			socket.emit('contentchangeafter',{a:a})
		});
	});

	socket.on('callbackdatadetail',function(a){
		if(a.mode==1){
			sf.whalsegetinfodb('select * from initialdata join backdatamanage on backdatamanage.operationid collate utf8mb4_general_ci = initialdata.operationid where initialdata.operationid="'+a.operationid+'"',function(b){
				socket.emit('callbackdatadetailafter',{a:b});
			});
		}else if(a.mode==0){
			sf.whalsegetinfodb('select * from initialdata join backdatamanage on backdatamanage.operationid collate utf8mb4_general_ci = initialdata.operationid',function(b){
				socket.emit('callbackdatadetailafter',{a:b});
			});
		}
	});


	socket.on('backdatainfo',function(a){
		sf.whalsegetinfodb('select * from backdatamanage',function(b){
		//sf.whalsegetinfodb('select * from initialdata join backdatamanage on backdatamanage.operationid collate utf8mb4_general_ci = initialdata.operationid',function(a){
			socket.emit('backdatainfoafter',{a:b});
		});
	});

	socket.on('quatertimer',function(a){
		if(a.option=='insert'){
			var textl = {operationid:a.operationid,operationinfo:a.operationinfo,operationkind:a.mode,createdate:sf.nodetime(),durationtime:a.durationtime,oindex:a.chosenindex};
			sf.whalsegetinfodb_par('insert into quatertimer set ?',textl,function(a){
				socket.emit('quatertimerafter',{a:a});
			});
		}else if(a.option=='remove'){
			sf.whalsegetinfodb('delete from quatertimer where operationid="'+a.operationid+'"',function(a){
				socket.emit('quatertimerafter',{a:a});
			});

		}else if(a.option=='update'){
			sf.whalsegetinfodb('update quatertimer set operationinfo="'+a.operationinfo+'" where numid="'+a.numid+'"',function(a){
				socket.emit('quatertimerafter',{a:a});
			});

		}


	});
	socket.on('quatertimerstart',function(k){
		sf.whalsegetinfodb('select q.numid,q.operationinfo,q.createdate,q.oindex,q.durationtime,q.operationid, i.indexinfo, i.numid as idxid from quatertimer as q left join quatertimeindex as i on q.oindex=i.numid order by q.createdate asc',function(a){
			if(k.option=='quaterstart'){
				socket.emit('quatertimerstartafter',{a:a,servertime:sf.nodetime()})
			}else if(k.option=='refresh'){
				socket.emit('quatertimercorrectionafter',{a:a,servertime:sf.nodetime()})
			}
		});
	});

	socket.on('saveorder',function(a){
		if(a.opt=='insert'){
			sf.whalsegetinfodb('insert into orderlist (orderset) values ("'+a.rgprblist+'")',function(a){
				socket.emit('saveorderafter',{a:a});
			});
		}else if(a.opt=='update'){
			var textl = {orderset:a.rgprblist};
			sf.whalsegetinfodb_par('update orderlist set ? where numid="'+a.numid+'"',textl,function(a){
				socket.emit('saveorderafter',{a:a});
			});

		}else{
			console.log('opt empty');
		}
	});
	

	socket.on('callorder',function(){
		sf.whalsegetinfodb('select * from orderlist',function(a){
			socket.emit('callorderafter',{a:a});
		});
	});
	socket.on('whalsegetdata',function(a){
		
			var sqlstc='';
			var whalsedata=[]
			//for(var ia=0; ia<statedata.length; ia++){
			//	whalsedata.push(statedata[ia]);
			//}
			for(var ia=0; ia<validdata.length; ia++){
				whalsedata.push(validdata[ia]);
			}
			for(var ia=0; ia<whalsedata.length; ia++){
				if(ia!=whalsedata.length-1){
					sqlstc=sqlstc+whalsedata[ia]+',';	
				}else{
					sqlstc=sqlstc+whalsedata[ia];
				}
			}

			//sf.whalsegetinfodb('select st.arrival0num, st.arrival1num, st.arrival2num, st.arrival3num,st.status0text,st.status1text, st.status2text,st.status3text,st.status0pic,st.status1pic,st.status2pic,st.status3pic,st.statuscode,ta.numid,ta.invoicenum, ta.ordernum, ta.compnum, ta.ordernum2, ta.documentnum, ta.product, ta.optioncode, ta.chineseproduct, ta.chineseoption, ta.chinesesize, ta.invoicenummatch, ta.timedeparture, ta.departureoption, ta.orderdate, ta. barcodenum, ta.productname, ta.optiondetail, ta.countnum, ta.imageaddr from initialdata as ta left join statusconnect as st on ta.numid=st.initialdataconnect',function(a){

		if(typeof a=='undefined'){
			sf.whalsegetinfodb('select '+sqlstc+' from initialdata',function(a){
				socket.emit('whalsegetdataafter',{data:a});
			});
		}else{
			var wh='';
			var slist=a.selectpclist.split(',');
			for(var ia=0; ia<slist.length; ia++){
				if(ia == slist.length-1){
					wh+='parcel_code="'+slist[ia]+'"';
				}else{
					wh+='parcel_code="'+slist[ia]+'" or ';
				}
			}
			sf.whalsegetinfodb('select '+sqlstc+' from initialdata where '+wh,function(a){
				socket.emit('whalsegetdataafter',{data:a});
			});

		}
	});

	socket.on('statuscodechange',function(a){
		console.log(a);
		if(a.option=='inboundstatus'){
			sf.whalsegetinfodb('update initialdata set statuscode="'+a.scode+'" where numid="'+a.numid+'"',function(){
			//sf.whalsegetinfodb('insert into statusconnect (initialdataconnect, statuscode) values ("'+a.numid+'","'+a.scode+'") on duplicate key update statuscode="'+a.scode+'"',function(){
			});
		}else if(a.option=='branchstatus'){
			sf.whalsegetinfodb('update initialdata set branchoffice="'+a.scode+'" where numid="'+a.numid+'"',function(){
			//sf.whalsegetinfodb('insert into statusconnect (initialdataconnect, statuscode) values ("'+a.numid+'","'+a.scode+'") on duplicate key update statuscode="'+a.scode+'"',function(){
			});

		}
	});	

	socket.on('statusedit',function(a){
		//sf.getinfodb('update pcscate set cslevel=0 where pcsopt="csindex"',function(rs){});
		if(a.option=='text'){
			sf.whalsegetinfodb('update initialdata set status'+a.scode+'text="'+a.prbtext+'" where numid="'+a.numid+'"',function(){
				socket.emit('statuseditafter',{b:a});
			});
		}else if(a.option=='pic'){
			sf.whalsegetinfodb('update initialdata set status'+a.scode+'pic="'+a.prbtext+'" where numid="'+a.numid+'"',function(){
				socket.emit('statuseditafter',{b:a});
			});
		}else if(a.option=='arrivalnum'){
			sf.whalsegetinfodb('update initialdata set arrival'+a.scode+'num='+a.prbtext+' where numid="'+a.numid+'"',function(){
			//sf.whalsegetinfodb('update statusconnect set arrival'+a.scode+'num='+a.prbtext+' where initialdataconnect="'+a.numid+'"',function(){
				socket.emit('statuseditafter',{b:a});
			});
		}else if(a.option=='refresh'){
			console.log('refreshed');
		}

		socket.emit('statuseditafter',{b:a});
	});


	socket.on('statusupdateshown',function(a){
		sf.whalsegetinfodb('select order_quantity, status'+a.scode+'text as statustext, status'+a.scode+'pic as statuspic, arrival'+a.scode+'num as arrivalnum, numid, statuscode  from initialdata where numid="'+a.numid+'"',function(b){
		//sf.whalsegetinfodb('select countnum, status'+a.scode+'text as statustext, status'+a.scode+'pic as statuspic, arrival'+a.scode+'num as arrivalnum,initialdataconnect as numid, statuscode  from statusconnect join initialdata on initialdata.numid = statusconnect.initialdataconnect where initialdataconnect="'+a.numid+'"',function(b){
			socket.emit('statusupdateshownafter',{b:b});
		});
	});

});






// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

//app.listen(app.get('port'), function(){
server.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.' );
});





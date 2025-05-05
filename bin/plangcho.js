

var mysql = require('mysql2');
const path = require('path'); // path 모듈 필요

module.exports = {
	prblang: function (cont, lang) {
		if (lang == 0 || typeof lang == 'undefined' || lang == 'kr') {
			prb_cont = cont.prbkorean;
			prb_pics = 'pics';
		} else if (lang == 1 || lang == 'en') {
			prb_cont = cont.prbenglish;
			prb_pics = 'pics';
		} else if (lang == 2 || lang == 'ch') {
			prb_cont = cont_prbchinese;
			prb_pics = 'pics';
		}
		return [prb_cont, prb_pics];
	},

	prbchoice: function (prbid, prbrows, lang) {
		var prbpath = path.join(__dirname, '..', 'spam', prbid);
		var fs = require('fs');
		if (fs.existsSync(prbpath + '.js')) {
			var prbc = require(prbpath);
			prbdb = module.exports.prblang(prbrows, lang);
			var prbcont = prbc.spamprb(prbdb[0].replace(/\\/g, "\\\\"));
			if (prbcont[2] == 1) {
				var cho1 = prbcont[1];
				var cho2 = prbcont[4];
				var cho3 = prbcont[5];
			} else if (prbcont[2] == 2) {
				var cho1 = prbcont[5];
				var cho2 = prbcont[1];
				var cho3 = prbcont[4];
			} else if (prbcont[2] == 3) {
				var cho1 = prbcont[3];
				var cho2 = prbcont[4];
				var cho3 = prbcont[1];
			} else if (prbcont[2] == 4) {
				var cho1 = prbcont[3];
				var cho2 = prbcont[4];
				var cho3 = prbcont[5];
			} else {
				console.log('something went wrong in function prbchoice part terminated abnormally');
				process.exit();
			}
			return [prbcont[0], prbcont[1], prbcont[2], cho1, cho2, cho3, prbcont[6], prbrows.prbpickor];
		} else {
			return [prbrows.prbkorean.replace(/`/g, ""), 'nofile', 'nofile', 'nofile', 'nofile', 'nofile', 'nofile', prbrows.prbpickor];
		}




	},
	//problem의 이름이 g로 시작하느냐 p로 시작하느냐를 따진다. g로 시작한다면, group으로 인식하여 이 중에 random으로 선택을 한다. p는 '순문제'에 해당한다.
	dbconnect: function (prbid, lang, callback) {

		var fs = require('fs')
		var sf = require('./serverflow');
		var pr = require('./prbtest');

		var connection = mysql.createConnection({
			host: process.env.DB_HOST,       // 환경 변수에서 읽어옴
			user: process.env.DB_USER,       // 환경 변수에서 읽어옴
			password: process.env.DB_PASSWORD, // 환경 변수에서 읽어옴
			database: process.env.DB_NAME    // 환경 변수에서 읽어옴
		});

		connection.connect(function (err) {
			if (!err) {
				//console.log('connected to Mysql from prb for problem calling');
			} else {
				console.log(err);
			}
		});
		//console.log('in plangcho, dbconnect, prbid[0] is '+prbid[0]);
		if (prbid[0] == 'p' || prbid[0] == 's' || prbid[0] == 'r') {
			connection.query("SELECT * from prb where prbid='" + prbid + "'", function (err, rows, fields) {
				connection.end();
				//sf.getinfodb('select * from prb where prbid="'+prbid+'"',function(rows){
				if (err) {
					console.log(err);
				} else {
					prbset = module.exports.prbchoice(prbid, rows[0], lang);
					if (prbset[6] != 0) {
						if (prbset[6] == 1) {
							errorcont = sf.nodetime() + '  ' + prbid + '  error from spam with infinite loop of choice\n'
						} else {

							errorcont = sf.nodetime() + '  ' + prbid + '  error from spam file unknown error\n';
						}
						fs.appendFile('../log/spamlog/problemerrlog.txt', errorcont, function (err) {
							if (err) {
								// console.log('err from plangcho'+err);
							}
						});
					}
					callback(prbset);
				}

			});

		} else if (prbid[0] == 'g') {
			connection.query("SELECT * from gprb where gprb='" + prbid + "'", function (gerr, grst, gfield) {
				//	connection.end();


				//console.log('grst is ' + grst[0].prblist);
				prblist = grst[0].prblist.split(',');
				var prnum = pr.randint(0, prblist.length - 1);
				gsprbid = prblist[prnum];
				connection.query("SELECT * from prb where prbid='" + gsprbid + "'", function (err, rows, fields) {
					connection.end();
					//console.log('connection end of problem calling');
					if (err) {
						console.log(err);
					} else {

						prbset = module.exports.prbchoice(gsprbid, rows[0], lang);
						if (prbset[6] != 0) {
							if (prbset[6] == 1) {
								errorcont = sf.nodetime() + '  ' + gsprbid + '  error from spam with infinite loop of choice\n'
							} else {

								errorcont = sf.nodetime() + '  ' + gsprbid + '  error from spam file unknown error\n';
							}
							fs.appendFile('../log/spamlog/problemerrlog.txt', errorcont, function (err) {
								if (err) {
									console.log('err from plangcho' + err);
								}

							});

						}
						callback(prbset);
						// console.log('from plangcho: prbid g');
					}
				});
			});
		}

		//});



	},


};


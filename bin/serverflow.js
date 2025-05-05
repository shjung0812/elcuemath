
var mysql = require('mysql2');
require('dotenv').config();

var async = require('async');
var pr = require('./plangcho');
module.exports = {
	getinfodb: function (req_query, callback) {
		
		var connection = mysql.createConnection({
			host: process.env.DB_HOST,       // 환경 변수에서 읽어옴
			user: process.env.DB_USER,       // 환경 변수에서 읽어옴
			password: process.env.DB_PASSWORD, // 환경 변수에서 읽어옴
			database: process.env.DB_NAME    // 환경 변수에서 읽어옴
		});


		// var connection = mysql.createConnection({
		// 	host: process.env.DB_HOST,       // 환경 변수에서 읽어옴
		// 	user: process.env.DB_USER,       // 환경 변수에서 읽어옴
		// 	password: process.env.DB_PASSWORD, // 환경 변수에서 읽어옴
		// 	database: process.env.DB_NAME    // 환경 변수에서 읽어옴
		// });
		//connection.connect();

		connection.query(req_query, function (err, rows) {
			if (err) {
				console.log(err);
			} else {
				callback(rows);
			}
		});
		connection.end();
	},
	whalsegetinfodb: function (req_query, callback) {
		var connection = mysql.createConnection({
			host: process.env.DB_HOST,       // 환경 변수에서 읽어옴
			user: process.env.DB_USER,       // 환경 변수에서 읽어옴
			password: process.env.DB_PASSWORD, // 환경 변수에서 읽어옴
			database: process.env.DB_NAME_WHALSEWORLD    // 환경 변수에서 읽어옴
		});
		//connection.connect();

		connection.query(req_query, function (err, rows) {
			if (err) {
				console.log(err);
			} else {
				callback(rows);
			}
		});
		connection.end();
	},

	whalsegetinfodb_par: function (req_query, para, callback) {
		var mysql = require('mysql');
		var connection = mysql.createConnection({
			host: process.env.DB_HOST,       // 환경 변수에서 읽어옴
			user: process.env.DB_USER,       // 환경 변수에서 읽어옴
			password: process.env.DB_PASSWORD, // 환경 변수에서 읽어옴
			database: process.env.DB_NAME_WHALSEWORLD    // 환경 변수에서 읽어옴
		});
		connection.connect();
		connection.query(req_query, para, function (err, rows) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				callback(rows);
			}
		});
		connection.end();
	},


	getinfodb_par: function (req_query, para, callback) {
		var mysql = require('mysql2');
		var connection = mysql.createConnection({
			host: process.env.DB_HOST,       // 환경 변수에서 읽어옴
			user: process.env.DB_USER,       // 환경 변수에서 읽어옴
			password: process.env.DB_PASSWORD, // 환경 변수에서 읽어옴
			database: process.env.DB_NAME    // 환경 변수에서 읽어옴
		});
		connection.connect();
		connection.query(req_query, para, function (err, rows) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				callback(rows);
			}
		});
		connection.end();
	},

	corstatic: function (plist, userid, settime, cback) {
		var async = require('async');
		var count = 0;
		statis = [];
		total = [];
		async.whilst(
			function (callbackfunction) {
				callbackfunction(null, count < plist.length)
				//return count<plist.length;
			},
			function (callback) {
				module.exports.getinfodb('select correct from prbsolve where prbid="' + plist[count] + '"and userid="' + userid + '" and timestampdiff(second,datetime,"' + settime + '")<0', function (rows) {

					var rowlist = [];

					if (rows.length != 0) {
						for (var i = 0; i < rows.length; i++) {
							rowlist[i] = rows[i].correct;
						}
						var cor = rowlist.reduce(function (a, b) { return a + b; });
						var wro = rowlist.length - cor;
						statis[count] = (cor / rows.length).toFixed(2);
						total[count] = rows.length;
					} else {
						statis[count] = null;
						total[count] = null;
					}
					count++;
					callback(null);

				});
			},
			function (err) {
				if (!err) {
					cback(statis, total);
				} else {
					console.log('we encountered errors in corstatic in serverflow.js', err);
				}
			});
	},
	nodetime: function () {
		var date = new Date();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if (month < 10) {
			month = '0' + month.toString();
		}
		if (day < 10) {
			day = '0' + day.toString();
		}


		if (hour < 10) {
			hour = '0' + hour.toString();
		}

		if (min < 10) {
			min = '0' + min.toString();
		}


		if (sec < 10) {
			sec = '0' + sec.toString();
		}


		var resettime = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
		return resettime;
	},
	assignprb: function (std, prblist, rpn) {
		var prbarr = [];
		for (var ii = 0; ii < prblist.length; ii++) {
			for (var iu = 0; iu < rpn; iu++) {
				prbarr.push(prblist[ii]);


			}
		}
		return module.exports.arrshuffle(prbarr);
	},
	arrshuffle: function (arr) {
		var j, x, i;
		for (i = arr.length; i; i -= 1) {
			j = Math.floor(Math.random() * i);
			x = arr[i - 1];
			arr[i - 1] = arr[j];
			arr[j] = x;
		}
		return arr;
	},

	nodeid: function (idobj) {
		var shortid = require('shortid');
		var rst = idobj + shortid.generate();
		return rst;

	},

	crsdistri: function (stagecnt, rs) {
		for (var ij = 0; ij < rs.length; ij++) {
			if (stagecnt == 1) {
				stagecnt = 'PRES';
				if (rs[ij].pstage == 'PRES') {
					var elevideo = rs[ij].elevideo;
					var eleprbs = rs[ij].eleprbs;
					var criteria = rs[ij].ele_criteria;
					var elepass = rs[ij].elepass;
					var elenpass = rs[ij].elenpass;
				}
			} else if (stagecnt == 2) {


			} else {
				if (rs[ij].pstage == stagecnt) {
					var elevideo = rs[ij].elevideo;
					var eleprbs = rs[ij].eleprbs;
					var criteria = rs[ij].ele_criteria;
					var elepass = rs[ij].elepass;
					var elenpass = rs[ij].elenpass;
				}





			}
		}

		return [elevideo, eleprbs, criteria, elepass, elenpass, stagecnt];
	},

	Gcrsdistri: function (stagecnt, rs) {
		for (var ij = 0; ij < rs.length; ij++) {
			if (stagecnt == 1) {
				stagecnt = 'GPRES';
				if (rs[ij].Gpstage == 'GPRES') {
					var elevideo = rs[ij].Gelevideo;
					var eleprbs = rs[ij].Geleprbs;
					var criteria = rs[ij].Gele_criteria;
					var elepass = rs[ij].Gelepass;
					var elenpass = rs[ij].Gelenpass;
				}
			} else if (stagecnt == 2) {


			} else {
				if (rs[ij].Gpstage == stagecnt) {
					var elevideo = rs[ij].Gelevideo;
					var eleprbs = rs[ij].Geleprbs;
					var criteria = rs[ij].Gele_criteria;
					var elepass = rs[ij].Gelepass;
					var elenpass = rs[ij].Gelenpass;
				}





			}
		}

		return [elevideo, eleprbs, criteria, elepass, elenpass, stagecnt];
	},



	prbrst: function (prbid, uid, ansn, sel) {

		require('date-utils');
		var dt = new Date();
		var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');


		if (sel == ansn) {
			var rst = { prbid: prbid, correct: 1, wrong: 0, noanswer: 0, dontknow: 0, userid: uid, datetime: d };
			module.exports.getinfodb_par('insert into prbsolve SET ?', rst, function (err, result) { });
		} else if (sel != 5) {
			if (sel == 4) {
				var rst = { prbid: prbid, correct: 0, wrong: 1, noanswer: 1, dontknow: 0, userid: uid, datetime: d };
				module.exports.getinfodb_par('insert into prbsolve SET ?', rst, function (err, result) { });
			} else {
				var rst = { prbid: prbid, correct: 0, wrong: 1, noanswer: 0, dontknow: 0, userid: uid, datetime: d };
				module.exports.getinfodb_par('insert into prbsolve SET ?', rst, function (err, result) { });
			}
		} else {
			var rst = { prbid: prbid, correct: 0, wrong: 1, noanswer: 0, dontknow: 1, userid: uid, datetime: d };
			module.exports.getinfodb_par('insert into prbsolve SET ?', rst, function (err, result) { });
		}

	},
	crsinichk: function (stuid, Gcrsid, callback) {

		module.exports.getinfodb('select * from crshistory where userid="' + stuid + '" and crsname="' + Gcrsid + '"', function (rr) {
			var chklist = [0, 0, 0, 0, 0];
			if (rr.length != 0) {
				chklist[0] = 0;
				callback(chklist);
			} else {
				chklist[0] = 1;
				callback(chklist);
			}

		});
	},

	splitCombinedPrsele(obj) {
		var tstobj = obj.split(':');
		var ptstobj = tstobj[tstobj.length - 1];
		return ptstobj;
	},

	SplitByPrPrsele(obj) {
		var tstobj = obj.split('.');
		var ptstobj = tstobj[tstobj.length - 1];
		return [tstobj.length, ptstobj];
	},
	crswaiting: function (stuid, Gcrsid, callback) {  //crsdist stands for course distribution
		module.exports.crsinichk(stuid, Gcrsid, function (chklist) {
			if (chklist[0] == 0) {
				module.exports.getinfodb('select * from crshistory where userid="' + stuid + '" and crsname="' + Gcrsid + '"', function (rr) {
					var endline = rr.length - 1;
					var typenum = rr[endline].coursetype
					var elestageall = rr[endline].elestage.split(',');

					var crsinter = rr[endline].crsstage.split(',');
					var prscrs = crsinter[typenum];
					var p1prsele = elestageall[typenum];
					var prsele = module.exports.splitCombinedPrsele(p1prsele);



					var alrtlist = ['eleffff', 'survaaa', 'elefvic', 'elefvvv', 'eleffps', 'elefffa', 'elefvwt', 'feedaaa']//all of pause code should be here. 
					var alrtchk = 0;
					var alrtval;

					for (var ii = 0; ii < alrtlist.length; ii++) {
						if (prsele == alrtlist[ii]) {
							alrtchk += 1;
							alrtval = ii;
						}
					}
					if (alrtchk != 0) {
						chklist[1] = 0;
						callback(chklist, [prscrs, p1prsele]);

					} else {
						var rstPr = module.exports.SplitByPrPrsele(prsele);
						if (rstPr[0] != 1) {
							chklist[1] = 3;
							callback(chklist, [prsele, rstPr]);
						} else {
							var vgtest = prscrs[0] + prscrs[1];
							if (vgtest == 'CC') {
								chklist[1] = 1;
								callback(chklist, [prscrs, prsele]);
							} else if (vgtest == 'GG') {
								chklist[1] = 2;
								callback(chklist, [prscrs, prsele]);
							} else {
								console.log('Unexpected problem occurred; The Name of Crsname should be start wieth GG or CC');
							}
						}
					}

				});
			} else {
				var mqlstr = 'insert into crshistory (userid, crsname, elestage, eletime, coursetype, crsstage) values ("' + stuid + '","' + Gcrsid + '","PRES","' + module.exports.nodetime() + '","0","' + Gcrsid + '")';
				module.exports.getinfodb(mqlstr, function () {
					chklist[1] = 2;
					callback(chklist, [Gcrsid, 'PRES']);
				})
			}
		});


	},
	lengthcheck: function (rs) {
		if (rs.length == 0) {
			console.log('There is no mysql query result');
			return 0;
		} else {
			console.log('function:crseoecont is successful');
			return 1;
		}
	},
	crselecont: function (stuid, Gcrsid, callback) {
		module.exports.crswaiting(stuid, Gcrsid, function (chklist, val) {
			if (chklist[1] != 0) {
				if (chklist[1] == 1) {//crs is started with 'CC'
					module.exports.getinfodb('select * from defele join videocont on videocont.id=defele.elevideo where crsname="' + val[0] + '" and pstage="' + val[1] + '"', function (rr) {


						if (module.exports.lengthcheck(rr)) {
							var evalele = [rr[0].crsname, rr[0].pstage, rr[0].elepass, rr[0].elenpass, rr[0].vidaddr, rr[0].eleprbs, rr[0].ele_criteria, rr[0].elestatus, rr[0].eletime];
							callback(chklist, evalele);
						}
					});

				} else if (chklist[1] == 2) {//crs is started with GG or 'PRES' is inserted due to the fact that there is no crshistory data
					module.exports.getinfodb('select * from defele join videocont on defele.elevideo=videocont.id where crsname="' + val[0] + '" and pstage="' + val[1] + '"', function (rr) {
						var Gevalele = [rr[0].crsname, rr[0].pstage, rr[0].elepass, rr[0].elenpass, rr[0].vidaddr, rr[0].eleprbs, rr[0].ele_criteria, rr[0].elestatus, rr[0].eletime];
						callback(chklist, Gevalele);
					});

				} else if (chklist[1] == 3) {
					var Ncrsele = val[0];
					var tsele = Ncrsele.split('.');
					var crsfirst = 'PRES';
					var addedele = '';
					var addedcrs = '';
					var ntime = module.exports.nodetime();
					module.exports.getinfodb('select * from crshistory where userid="' + stuid + '" and crsname="' + Gcrsid + '"', function (rr) {
						var nlength = rr.length - 1;
						var elestage = rr[rr.length - 1].elestage;
						var crsstage = rr[rr.length - 1].crsstage;
						var coursetype = rr[rr.length - 1].coursetype;

						var ncrs = tsele[tsele.length - 1];
						var v1divele = elestage.split(',');
						if (tsele.length >= 2) { //subcourse
							v1divele[v1divele.length - 1] = Ncrsele;
							for (var i = 0; i < v1divele.length; i++) {
								if (i != v1divele.length - 1) {
									addedele = addedele + v1divele[i] + ',';
								} else {
									addedele = addedele + Ncrsele + ',' + crsfirst;
								}
							}


							var v1divcrs = crsstage.split(',');
							v1divcrs.push(ncrs);
							addedcrs = v1divcrs;


							var mqlstr = 'insert into crshistory (userid, crsname, elestage, eletime, coursetype, crsstage) values ("' + stuid + '","' + Gcrsid + '","' + addedele + '","' + ntime + '","' + parseInt(rr[rr.length - 1].coursetype + 1, 10) + '","' + addedcrs + '")';

						} else { //No subcourse
							v1divele[v1divele.length - 1] = Ncrsele;
							for (var i = 0; i < v1divele.length; i++) {
								if (i != v1divele.length - 1) {
									addedele = addedele + v1divele[i] + ',';
								} else {
									addedele = addedele + Ncrsele;
								}
							}
							var mqlstr = 'insert into crshistory (userid, crsname, elestage, eletime, coursetype, crsstage) values ("' + stuid + '","' + Gcrsid + '","' + addedele + '","' + ntime + '","' + rr[rr.length - 1].coursetype + '","' + rr[rr.length - 1].crsstage + '")';
						}
						chklist[2] = 4;
						callback(chklist, mqlstr);

					});


				}
			} else {
				var chkholdcode = module.exports.checkHoldCode(val[1]);
				if (chkholdcode[0] == 1) {
					chklist[2] = 1;
					callback(chklist, val[1]);
				} else if (chkholdcode[0] == 2) {
					chklist[2] = 2;
					/*			module.exports.getinfodb('select * from defele join videocont on videocont.id=defele.elevideo where crsname="'+val[0]+'" and pstage="'+val[1]+'"',function(rr){
									var Gevalele=[rr[0].crsname, rr[0].pstage,rr[0].elepass,rr[0].elenpass,rr[0].vidaddr, rr[0].eleprbs, rr[0].ele_criteria, rr[0].elestatus, rr[0].eletime];
									callback(chklist,Gevalele);
								});*/
					callback(chklist, [val[0], val[1], chkholdcode[1]]);



				} else if (chkholdcode[0] == 3) {
					chklist[2] = 3;
					callback(chklist, [3, val[1]]);
				} else if (chkholdcode[0] == 4) {
				}

			};
		});

	},
	prbsetv5: function (plist, callback) {//choose which is NOT nofile


		var prbset = [];
		var count = 0;
		var lnum = 0;
		async.whilst(
			function (callbackfunction) {
				callbackfunction(null, count < plist.length);
				//return count<plist.length
			},
			function (cback) {
				pr.dbconnect(plist[count], 0, function (pb) {
					pb.splice(0, 0, plist[count]);
					var chk = 0;
					for (var ia = 0; ia < pb.length; ia++) {
						if (pb[ia] == 'nofile') {
							chk = 1;
							break;
						}
					}
					if (chk == 0) {

						prbset[lnum] = pb;
						lnum++;
					}
					count++;
					cback(null);
				});
			},
			function (err) {
				if (!err) {
					callback(prbset);
				} else {
					console.log('we encountered errors at prbset in serverflow.js', err);
				}
			});
	},

	prbsetv4: function (plist, callback) {

		var prbset = [];
		var count = 0;
		var lnum = 0;
		async.whilst(
			function (callbackfunction) {
				//	return count<plist.length
				callbackfunction(null, count < plist.length);
			},
			function (cback) {
				pr.dbconnect(plist[count], 0, function (pb) {
					pb.splice(0, 0, plist[count]);
					var chk = 0;
					for (var ia = 0; ia < pb.length; ia++) {
						if (pb[ia] == 'nofile') {
							chk = 1;
							break;
						}
					}
					if (chk == 1) {

						prbset[lnum] = pb;
						lnum++;
					}
					count++;
					cback(null);
				});
			},
			function (err) {
				if (!err) {
					callback(prbset);
				} else {
					console.log('we encountered errors at prbset in serverflow.js', err);
				}
			});
	},


	prbsetv3: function (plist, va, callback) {
		var whstr = '';
		for (var ia = 0; ia < plist.length; ia++) {
			if (ia != plist.length - 1) {
				whstr = whstr + va + '="' + plist[ia] + '" or ';
			} else {
				whstr = whstr + va + '="' + plist[ia] + '"';
			}
		}
		console.log(whstr);
		var pl = [];
		module.exports.getinfodb('select * from prb where ' + whstr, function (a) {
			for (var ia = 0; ia < a.length; ia++) {
				pl[ia] = [a[ia].prbid, a[ia].prbkorean]
			}
			callback(pl);
			console.log(pl);
		});
	},
	prbsetv2: function (plist, callback) {
		var async = require('async');
		var prbset = [];
		var count = 0;
		async.whilst(
			function (callbackfunction) {
				callbackfunction(null, count < plist.length)
				//return count<plist.length
			},
			function (cback) {
				pr.dbconnect(plist[count], 0, function (pb) {
					pb.splice(0, 0, plist[count]);
					prbset[count] = pb;
					count++;
					cback(null);
				});
			},
			function (err) {
				if (!err) {
					callback(prbset);
				} else {
					console.log('we encountered errors at prbset in serverflow.js', err);
				}
			});
	},
	prbset: function (plist, callback) {

		var prbset = [];
		var count = 0;
		async.whilst(
			function () { return count < plist.length },
			function (cback) {
				pr.dbconnect(plist[count], 0, function (pb) {
					prbset[count] = pb;
					count++;
					cback(null);
				});
			},
			function (err) {
				if (!err) {
					callback(prbset);
				} else {
					console.log('we encountered errors at prbset in serverflow.js', err);
				}
			});
	},
	combineElement(otheri, element, delim) {
		var notheri = [];

		for (var ia = 0; ia < otheri.length; ia++) {
			if (ia == 2 || ia == 3) {
				notheri[ia] = element;
			} else {
				notheri[ia] = otheri[ia];
			}
		}


		//adjust order of problem list
		var tmp = otheri[5].split(',');
		var tplist = [];
		var ua = 0;
		var num = 0;
		for (var ib = 0; ib < tmp.length; ib++) {
			if (tmp[ib][0] == 'r') {
				num = ib;
			} else {
				tplist[ua] = tmp[ib]
				ua += 1;
			}
		}
		tplist[ua] = tmp[num];

		//packing of problem list
		var packplist = '';
		for (var ic = 0; ic < tplist.length; ic++) {
			if (ic == tplist.length - 1) {
				packplist = packplist + tplist[ic];
			} else {
				packplist = packplist + tplist[ic] + ',';
			}
		}

		notheri[5] = packplist;

		return notheri;
	},
	combineComplete(prbeval, prbanval, prbcont, prbchos, prbans, prbcode, element) {
		var nprbeval = [];
		var nprbanval = [];
		var nprbcont = [];
		var nprbchos = [];
		var nprbans = [];
		var codeChos = prbcode[2].split(',');
		for (var ia = 0; ia < prbeval.length; ia++) {
			nprbeval[ia] = prbeval[ia];
			nprbanval[ia] = prbanval[ia];
			nprbcont[ia] = prbcont[ia];
			nprbchos[ia] = prbchos[ia];
			nprbans[ia] = prbans[ia];
			if (prbeval.length - 1 == ia) {
				nprbeval[ia + 1] = element;
				nprbanval[ia + 1] = prbcode[1];
				nprbcont[ia + 1] = prbcode[0];
				nprbchos[ia + 1] = codeChos;
				nprbans[ia + 1] = 1;
			}
		}
		return [nprbeval, nprbanval, nprbcont, nprbchos, nprbans]
	},
	checkHoldCode(p1eval) {
		var eval = module.exports.splitCombinedPrsele(p1eval);
		var holdlist = ['eleffff', 'elefffa', 'elefvwt'];
		var specialCodeList = ['survaaa', 'feedaaa'];
		var subcrsPassCodeList = ['elefvic', 'elefvvv', 'eleffps'];
		var holdchk = 0;
		var holdval;
		for (var ii = 0; ii < holdlist.length; ii++) {
			if (eval == holdlist[ii]) {
				holdchk = 1;
				holdval = holdlist[ii];
			}
		}

		for (var ia = 0; ia < specialCodeList.length; ia++) {
			if (eval == specialCodeList[ia]) {
				holdchk = 2;
				holdval = eval;
			}
		}
		for (var ib = 0; ib < subcrsPassCodeList.length; ib++) {
			if (eval == subcrsPassCodeList[ib]) {
				holdchk = 3;
				holdval = subcrsPassCodeList[ib];
			}
		}
		/*
			var bypassCodeList=['elefeed']
			for(var ic=0; ic<bypassCodeList.length; ic++){
				if(eval==bypassCodeList[ic]){
					holdchk=4;
					holdval=bypassCodeList[ic];
				}
			}*/

		return [holdchk, holdval];

	},
	SurveyPacking: function (pl, delim, opt) {
		var prcont = '';
		var pranval = '';
		var prans = '';
		var primg = '';
		var prbchk = '';
		var prbchos = '';


		if (opt == 0) {

			for (var i = 0; i < pl.length; i++) {
				if (i == pl.length - 1) {
					prcont = prcont + pl[i][0];
					pranval = pranval + pl[i][1];
					prans = prans + pl[i][2];
					primg = primg + pl[i][7];
					prbchk = prbchk + '0';
					var pchos = ''
					for (var ic = 0; ic < pl[i][1].length; ic++) {
						if (pl[i][1].length - 1 == ic) {
							pchos = pchos + pl[i][1][ic];
						} else {
							pchos = pchos + pl[i][1][ic] + '@#';
						}
					}
					prbchos = prbchos + pchos;
				} else {
					prcont = prcont + pl[i][0] + delim;
					pranval = pranval + pl[i][1] + delim;
					prans = prans + pl[i][2] + delim;
					primg = primg + pl[i][7] + delim;
					prbchk = prbchk + '0' + delim;
					var pchos = ''
					for (var ic = 0; ic < pl[i][1].length; ic++) {
						if (pl[i][1].length - 1 == ic) {
							pchos = pchos + pl[i][1][ic];
						} else {
							pchos = pchos + pl[i][1][ic] + '@#';
						}
					}
					prbchos = prbchos + pchos + delim;
				}
			}
			return [prcont, pranval, prans, prbchos, primg, prbchk]
		} else if (opt == 1) {
			for (var i = 0; i < pl.length; i++) {
				if (i == pl.length - 1) {
					prcont = prcont + pl[i][0];
					pranval = pranval + pl[i][1];
					prans = prans + pl[i][2];
					primg = primg + pl[i][7];
					prbchk = prbchk + '0';
					var pchos = ''
					for (var ic = 0; ic < pl[i][1].length; ic++) {
						if (pl[i][1].length - 1 == ic) {
							pchos = pchos + pl[i][1][ic];
						} else {
							pchos = pchos + pl[i][1][ic] + '@#';
						}
					}
					prbchos = prbchos + pchos;
				} else {
					prcont = prcont + pl[i][0] + delim;
					pranval = pranval + pl[i][1] + delim;
					prans = prans + pl[i][2] + delim;
					primg = primg + pl[i][7] + delim;
					prbchk = prbchk + '0' + delim;
					var pchos = ''
					for (var ic = 0; ic < pl[i][1].length; ic++) {
						if (pl[i][1].length - 1 == ic) {
							pchos = pchos + pl[i][1][ic];
						} else {
							pchos = pchos + pl[i][1][ic] + '@#';
						}
					}
					prbchos = prbchos + pchos + delim;
				}
			}
			return [prcont, pranval, prans, prbchos, primg, prbchk]
		}
	},
	prbmanufac: function (stuid, Gcrsid, callback) {

		var delim = '@@@';
		var delcho = '@#';
		var prcont = '';
		var pranval = '';
		var prans = '';
		var prbchos = '';
		var primg = '';
		var prbchk = '';
		var otherinfo = '';
		var prblist = '';
		var ntime = module.exports.nodetime();
		var prbcode = '';

		module.exports.crselecont(stuid, Gcrsid, function (chklist, eval) {
			if (chklist[1] == 1 || chklist[1] == 2) {
				var plist = eval[5].split(',');
				var spl = [];
				var pl = [];
				var ua = 0;
				var ub = 0;

				module.exports.prbset(plist, function (xpl) {

					for (var ic = 0; ic < xpl.length; ic++) {
						if (plist[ic][0] == 's') {
							spl[ua] = xpl[ic];
							ua += 1;
						} else if (plist[ic][0] == 'p') {
							pl[ub] = xpl[ic];
							ub += 1;
						}

					}

					var surveyPacking = module.exports.SurveyPacking(spl, delim, 1);

					var sprcont = surveyPacking[0]; var spranval = surveyPacking[1]; sprans = surveyPacking[2];
					sprbchos = surveyPacking[3]; sprimg = surveyPacking[4]; sprbchk = surveyPacking[5];
					//set delimeter @# as choices sepearator. 
					for (var i = 0; i < pl.length; i++) {
						if (i == pl.length - 1) {
							prcont = prcont + pl[i][0];
							pranval = pranval + pl[i][1];
							prans = prans + pl[i][2];
							//prbchos=prbchos+pl[i][3]+','+pl[i][4]+','+pl[i][5];
							prbchos = prbchos + pl[i][3] + delcho + pl[i][4] + delcho + pl[i][5];
							primg = primg + pl[i][7];
							prbchk = prbchk + '0';


						} else {
							prcont = prcont + pl[i][0] + delim;
							pranval = pranval + pl[i][1] + delim;
							prans = prans + pl[i][2] + delim;
							prbchos = prbchos + pl[i][3] + delcho + pl[i][4] + delcho + pl[i][5] + delim;
							primg = primg + pl[i][7] + delim;
							prbchk = prbchk + '0' + delim;
						}
					}

					for (var ii = 0; ii < eval.length; ii++) {
						if (ii == eval.length - 1) {
							otherinfo = otherinfo + eval[ii];
						} else {
							otherinfo = otherinfo + eval[ii] + delim;
						}

					}
					callback(chklist, [prcont, pranval, prans, prbchos, primg, prbchk, eval[4], otherinfo], [sprcont, spranval, sprans, sprbchos, sprimg, sprbchk]);
				});
			} else if (chklist[1] == 0) {
				if (chklist[2] == 1) {
					var msg = '';
					if (eval == 'eleffff') {
						msg = 'you are failed and have to wait';
					} else if (eval == 'elefffa') {
						msg = 'you are waiting for the admin asking';
					} else if (eval == 'elefvwt') {
						msg = '성공적으로 코스를 진행하고 있습니다. 곧 새로운 컨텐츠가 업로드됩니다. 다음회에 뵙겠습니다.';
					}

					callback(chklist, [chklist[2], eval, msg]); //fval=1
				} else if (chklist[2] == 2) {
					if (eval[2] == 'survaaa') {
						chklist[3] = 0;
						module.exports.getinfodb('select * from defele join videocont on videocont.id=defele.elevideo where crsname="' + eval[0] + '" and pstage="' + eval[1] + '"', function (rr) {
							var eval_ = [rr[0].crsname, rr[0].pstage, rr[0].elepass, rr[0].elenpass, rr[0].vidaddr, rr[0].eleprbs, rr[0].ele_criteria, rr[0].elestatus, rr[0].eletime];

							var plist = eval_[5].split(',');
							module.exports.prbset(plist, function (npl) {
								var pl = [];
								var rpl = [];
								var ub = 0;
								var ua = 0;
								for (var ic = 0; ic < npl.length; ic++) {
									if (plist[ic][0] == 's') {
										pl[ua] = npl[ic];
										ua += 1;
									} else if (plist[ic][0] == 'r') {
										rpl[ub] = npl[ic];
										ub += 1;
									}

								}
								var surveyPacking = module.exports.SurveyPacking(pl, delim, 0);
								prcont = surveyPacking[0]; pranval = surveyPacking[1]; prans = surveyPacking[2];
								prbchos = surveyPacking[3]; primg = surveyPacking[4]; prbchk = surveyPacking[5];
								var pcode = '';
								var poption = '';
								for (var ib = 0; ib < rpl[0][1].length; ib++) {
									if (rpl[0][1].length - 1 == ib) {
										pcode = pcode + rpl[0][1][ib][1];
										poption = poption + rpl[0][1][ib][0];
									} else {
										pcode = pcode + rpl[0][1][ib][1] + '@#';
										poption = poption + rpl[0][1][ib][0] + '@#';
									}
								}
								prbcode = rpl[0][0] + delim + pcode + delim + poption;


								for (var ii = 0; ii < eval_.length; ii++) {
									if (ii == eval_.length - 1) {
										otherinfo = otherinfo + eval_[ii];
									} else {
										otherinfo = otherinfo + eval_[ii] + delim;
									}

								}
								callback(chklist, [prcont, pranval, prans, prbchos, primg, prbchk, eval_[4], otherinfo, prbcode]);
							});
						});
					} else if (eval[2] == 'feedaaa') {
						//AABC.feedaaa 라는것 명심, crshistory 찾고, AABC.feedaaa로 defele를 뒤져서 다음element를 더한다. 
						chklist[3] = 1;
						module.exports.getinfodb('select * from defele where crsname="' + Gcrsid + '" and pstage="' + eval[1] + '"', function (s) {
							var p1pass = s[s.length - 1].elepass
							var p1npass = s[s.length - 1].elenpass
							console.log('p1pass is ');
							console.log(p1pass);


							module.exports.getinfodb('select * from crshistory where userid="' + stuid + '" and crsname="' + Gcrsid + '"', function (r) {
								var p1elestg = r[r.length - 1].elestage;
								var p2elestg = p1elestg.split(',');
								var p3elestg = p2elestg[p2elestg.length - 2]


								var crstype = parseInt(r[r.length - 1].coursetype, 10);

								var Nele = p1pass;
								var Nestg = '';
								var Ncrsstg = '';
								for (var i = 0; i < p2elestg.length; i++) {
									if (i == p2elestg.length - 1) {
										Nestg = Nestg + Nele;
									} else {
										Nestg = Nestg + p2elestg[i] + ',';
									}


								}
								var p1crsstg = r[r.length - 1].crsstage;
								var ntime = module.exports.nodetime();
								var crstype = parseInt(r[r.length - 1].coursetype, 10);

								var mqlstr = 'insert into crshistory (crsname, userid, elestage, eletime, coursetype,crsstage) values ("' + Gcrsid + '","' + stuid + '","' + Nestg + '","' + ntime + '","' + crstype + '","' + p1crsstg + '")';
								callback(chklist, mqlstr, '')

							});
						});
					}



				} else if (chklist[2] == 3) {
					var ecode = eval[1];
					module.exports.getinfodb('select * from crshistory where userid="' + stuid + '" and crsname="' + Gcrsid + '"', function (r) {
						var p1elestg = r[r.length - 1].elestage;
						var p2elestg = p1elestg.split(',');
						var p3elestg = p2elestg[p2elestg.length - 2]

						var p1crsstg = r[r.length - 1].crsstage;
						var p2crsstg = p1crsstg.split(',');

						var crstype = parseInt(r[r.length - 1].coursetype, 10);

						var Nele;
						var Nestg = '';
						var Ncrsstg = '';


						if (crstype < 1) {
							var meg;
							//if(eval=='elefvic'){
							if (ecode == 'elefvvv' || ecode == 'elefvic') {
								meg = 'You win the Course';
							} else if (ecode == 'eleffps') {
								meg = 'You FAILED the Course';
							} else {
								meg = 'somthing unappreciated event happend';
							}
							callback(chklist, [2, meg]);
						} else {
							var Neval = parseInt(module.exports.pnpchk(ecode), 10);


							module.exports.getinfodb('select * from defele where crsname="' + Gcrsid + '" and pstage="' + p3elestg + '"', function (s) {
								var p1pass = s[s.length - 1].elepass
								var p1npass = s[s.length - 1].elenpass

								if (Neval == 1) {//succeed pass
									Nele = p1pass;
								} else if (Neval == 2) {//failed pass
									Nele = p1npass;
								} else if (Neval == 0) {//unexpected error in pnpchk
									console.log('unexpected error');
								} else {//unexpected error in system(maybe)
									console.log('The system operate oddly');
								}

								for (var i = 0; i < p2elestg.length - 1; i++) {
									if (i == p2elestg.length - 2) {
										Nestg = Nestg + Nele;
									} else {
										Nestg = Nestg + p2elestg[i] + ',';
									}

								}
								for (var j = 0; j < p2crsstg.length - 1; j++) {
									if (j == p2crsstg.length - 2) {
										Ncrsstg = Ncrsstg + p2crsstg[j];
									} else {
										Ncrsstg = Ncrsstg + p2crsstg[j] + ',';
									}

								}
								crstype -= 1;
								module.exports.getinfodb('insert into crshistory (crsname, userid, elestage, eletime, coursetype,crsstage) values ("' + Gcrsid + '","' + stuid + '","' + Nestg + '","' + ntime + '","' + crstype + '","' + Ncrsstg + '")', function (a) {
									callback(chklist, [3, ecode]);

								});

							});
						}


					});
				} else if (checklist[2] == 4) {
				}
			} else if (chklist[1] == 3) {
				//pass, No need of problem manufacturing.
				callback(chklist, eval, '');
				console.log('//pass');

			}
		});

	},
	pnpchk: function (obj) {
		var passlist = ['elefvic', 'elefvvv'];
		var npasslist = ['eleffps'];

		var pnpchk = 0;
		for (var i = 0; i < passlist.length; i++) {
			if (obj == passlist[i]) {
				pnpchk = 1;
			}
		}
		for (var j = 0; j < npasslist.length; j++) {
			if (obj == npasslist[j]) {
				pnpchk = 2;
			}
		}

		return pnpchk;

	},

	delsepa: function (obj, del) {
		var rst = [];
		for (var i = 0; i < obj.length; i++) {
			rst[i] = obj[i].split(del);
		}
		return rst;
	},
	simpacking: function (obj, delim) {
		var pcobj = [];
		for (var i = 0; i < obj.length; i++) {
			if (i == obj.length - 1) {
				pcobj = pcobj + obj[i];
			} else {
				pcobj = pcobj + obj[i] + delim;
			}
		}
		return pcobj;

	},

	elechoice: function (otheri, prbeval) {
		var evcount = 0;
		var crit = parseFloat(otheri[6], 10);
		var Ncrsele;
		for (var i = 0; i < prbeval.length; i++) {
			if (prbeval[i] == 1) {
				evcount += 1;
			}
		}

		var evscore = parseFloat((evcount / prbeval.length));

		if (evscore >= crit) {
			Ncrsele = otheri[2];
		} else {
			Ncrsele = otheri[3];
		}

		return [Ncrsele, evscore.toFixed(2) + "," + crit];

	},
	EscapeForwardSplash(ob, opt) {
		if (opt == 0) {
			var nob = ob.replace(/\\/g, '\\\\');
		} else if (opt == 1) {
			var nob = [];
			for (var ia = 0; ia < ob.length; ia++) {
				nob[ia] = ob[ia].replace(/\\/g, '\\\\')
			}
		} else if (opt == 2) {
			var nob = [];
			for (var ia = 0; ia < ob.length; ia++) {
				nob[ia] = [];
				for (var ib = 0; ib < ob[ia].length; ib++) {
					nob[ia][ib] = ob[ia][ib].replace(/\\/g, '\\\\')
				}
			}
		}
		return nob;
	},
	updateCrs: function (otheri, prbeval, crs, userid, prbanval, prbcont, prbchos, prbans, callback) {


		var tNcrsele = module.exports.elechoice(otheri, prbeval);
		var Ncrsele = tNcrsele[0];
		var tsele = Ncrsele.split('.');
		var crsfirst = 'PRES';
		var addedele = '';
		var addedcrs = '';
		var ntime = module.exports.nodetime();
		var plist = otheri[5].split(',');

		var rstcont = '';

		var nprbcont = module.exports.EscapeForwardSplash(prbcont, 1);
		var nprbchos = module.exports.EscapeForwardSplash(prbchos, 2);

		for (var i = 0; i < prbeval.length; i++) {
			if (i == prbeval.length - 1) {
				rstcont = rstcont + plist[i] + '@@@' + nprbcont[i] + '@@@' + nprbchos[i] + '@@@' + prbanval[i] + '@@@' + prbans[i] + '@@@' + prbeval[i];
			} else {
				rstcont = rstcont + plist[i] + '@@@' + nprbcont[i] + '@@@' + nprbchos[i] + '@@@' + prbanval[i] + '@@@' + prbans[i] + '@@@' + prbeval[i] + '###';
			}
		}

		module.exports.getinfodb('select * from crshistory  where crsname="' + crs + '" and userid="' + userid + '"', function (rr) {
			if (rr.length != 0) {
				var nlength = rr.length - 1;
				var elestage = rr[rr.length - 1].elestage;
				var crsstage = rr[rr.length - 1].crsstage;
				var coursetype = rr[rr.length - 1].coursetype;

				var ncrs = tsele[tsele.length - 1];
				var v1divele = elestage.split(',');

				if (tsele.length >= 2) { //subcourse
					v1divele[v1divele.length - 1] = Ncrsele;
					for (var i = 0; i < v1divele.length; i++) {
						if (i != v1divele.length - 1) {
							addedele = addedele + v1divele[i] + ',';
						} else {
							addedele = addedele + Ncrsele + ',' + crsfirst;
						}
					}


					var v1divcrs = crsstage.split(',');
					v1divcrs.push(ncrs);
					addedcrs = v1divcrs;


					var mqlstr = 'insert into crshistory (userid, crsname, elestage, eletime, coursetype, crsstage) values ("' + userid + '","' + crs + '","' + addedele + '","' + ntime + '","' + parseInt(rr[rr.length - 1].coursetype + 1, 10) + '","' + addedcrs + '")';
					var rcmstr = [userid, crs, addedele, ntime, parseInt(rr[rr.length - 1].coursetype + 1, 10), addedcrs];

				} else { //No subcourse
					v1divele[v1divele.length - 1] = Ncrsele;
					for (var i = 0; i < v1divele.length; i++) {
						if (i != v1divele.length - 1) {
							addedele = addedele + v1divele[i] + ',';
						} else {
							addedele = addedele + Ncrsele;
						}
					}
					var mqlstr = 'insert into crshistory (userid, crsname, elestage, eletime, coursetype, crsstage) values ("' + userid + '","' + crs + '","' + addedele + '","' + ntime + '","' + rr[rr.length - 1].coursetype + '","' + rr[rr.length - 1].crsstage + '")';
					var rcmstr = [userid, crs, addedele, ntime, rr[rr.length - 1].coursetype, rr[rr.length - 1].crsstage];
				}
				module.exports.getinfodb('update crshistory set rstcont="' + rstcont + '", crseval="' + tNcrsele[1] + '" where elenum=' + rr[nlength].elenum, function () {
					rcmstr[6] = tNcrsele[1];
					module.exports.getinfodb(mqlstr, function () {
						module.exports.RCM(rcmstr, function () {
							var and = 'crshistory is updated!';
							callback(and);
						});
					});
				});
			} else {
				var mqlstr = 'insert into crshistory (userid, crsname, elestage, eletime, coursetype, crsstage) values ("' + userid + '","' + crs + '","' + otheri[1] + '","' + ntime + '","0","' + crs + '")';
				//				var rcmstr={userid:userid,crsname:crs,elestage:otheri[1],eletime:ntime,coursetype:'0',crsstage:crs};
				var rcmstr = [userid, crs, otheri[1], ntime, '0', crs];
				module.exports.getinfodb(mqlstr, function () {
					module.exports.RCM(rcmstr, function () {
						var and = 'crshistory is updated!';
						callback(and);
					});
				});

			}
		});

	},
	Surveysel: function (obj, currnum, sel, delim, opt) {
		var rst = [iii];
		var chosenv;
		var j = 0;
		var pcobj = '';/*
	if(ans==sel){
		obj[currnum]=1;
	}else{
		if(sel==4){
			obj[currnum]=2;
		}else{
			if(sel==5){
				obj[currnum]=3;
			}else{
				obj[currnum]=4;
			}
		}
	}*/
		obj[currnum] = sel;
		if (!opt || opt == 0) {
			var gcn = module.exports.getCurrNumber(obj);



			for (var i = 0; i < obj.length; i++) {
				if (obj[i] == 0) {
					rst[j] = i;
					j += 1;
				}
			}
			for (var i = 0; i < obj.length; i++) {
				if (i == obj.length - 1) {
					pcobj = pcobj + obj[i];
				} else {
					pcobj = pcobj + obj[i] + delim;
				}
			}


		}
		return [gcn[1], gcn[0], pcobj];

	},
	numsel: function (obj, currnum, ans, sel, delim, opt) {
		var rst = [];
		var chosenv;
		var j = 0;
		var pcobj = '';
		var nobj = [];
		nobj = obj//중요함. nobj와 obj를 동급화 한다. 함수 밖에서도 결과가 일치한다.
		//	for(var ia=0; ia<obj.length; ia++){
		//		nobj[ia]=obj[ia];
		//	}

		if (!opt || opt == 0) {
			if (ans == sel) {
				nobj[currnum] = 1;
			} else {
				if (sel == 4) {
					nobj[currnum] = 2;
				} else {
					if (sel == 5) {
						nobj[currnum] = 3;
					} else {
						nobj[currnum] = 4;
					}
				}
			}

			for (var i = 0; i < nobj.length; i++) { //calculate number of remained problem; 
				if (nobj[i] == 0) {
					rst[j] = i;
					j += 1;
				}
			}
			//chosenv=rst[Math.floor(Math.random()*(rst.length)+0)]	
			chosenv = rst[0];
			for (var i = 0; i < nobj.length; i++) { //packing. 
				if (i == nobj.length - 1) {
					pcobj = pcobj + nobj[i];
				} else {
					pcobj = pcobj + nobj[i] + delim;
				}
			}

		} else if (opt == 1) {
			nobj[currnum] = sel;
			for (var i = 0; i < nobj.length; i++) {
				if (nobj[i] == 0) {
					rst[j] = i;
					j += 1;
				}
			}
			chosenv = parseInt(currnum, 10) + 1;// 순차적으로
			for (var i = 0; i < nobj.length; i++) {
				if (i == nobj.length - 1) {
					pcobj = pcobj + nobj[i];
				} else {
					pcobj = pcobj + nobj[i] + delim;
				}
			}

		}
		return [chosenv, rst.length, pcobj];


	},

	recordrst(stuid, crsid, other, prbeval, pval, cback) {
		var plist = other[5].split(',');
		var crs = other[0];
		var ele = other[1];
		var ntime = module.exports.nodetime();
		var count = 0;

		async.whilst(
			function (callbackfunction) {
				callbackfunction(null, count < plist.length)
				//return count<plist.length;
			},
			function (callback) {
				var sentence;
				var anchk = prbeval[count];
				if (anchk == 1) {
					sentence = 'insert into prbsolve (prbid,correct,wrong,noanswer,dontknow,userid,datetime,course,element,anval) values ("' + plist[count] + '",1,0,0,0,"' + stuid + '","' + ntime + '","' + crs + '","' + ele + '","' + pval[count] + '")';
				} else if (anchk == 2) {
					sentence = 'insert into prbsolve (prbid,correct,wrong,noanswer,dontknow,userid,datetime,course,element,anval) values ("' + plist[count] + '",0,1,1,0,"' + stuid + '","' + ntime + '","' + crs + '","' + ele + '","' + pval[count] + '")';
				} else if (anchk == 3) {
					sentence = 'insert into prbsolve (prbid,correct,wrong,noanswer,dontknow,userid,datetime,course,element,anval) values ("' + plist[count] + '",0,1,0,1,"' + stuid + '","' + ntime + '","' + crs + '","' + ele + '","' + pval[count] + '")';
				} else if (anchk == 4) {
					sentence = 'insert into prbsolve (prbid,correct,wrong,noanswer,dontknow,userid,datetime,course,element,anval) values ("' + plist[count] + '",0,1,0,0,"' + stuid + '","' + ntime + '","' + crs + '","' + ele + '","' + pval[count] + '")';

				}
				module.exports.getinfodb(sentence, function (rows) {
					count++;
					callback(null);
				});
			},
			function (err) {
				if (!err) {
					cback('processed');
				} else {
					console.log('we encountered errors in corstatic in serverflow.js', err);
				}
			});



	},

	getRvalue: function (prbcode) {
		var rval = [];
		var ua = 0;

		for (var ia = 0; ia < prbcode.length; ia++) {
			if (prbcode[ia] != 'x') {
				rval[ua] = [ia, prbcode[ia]];
				ua += 1;
			}

		}
		return [rval.length, rval];
	},
	prbevalCount: function (prbeval) {
		var evlcount = 0;
		for (var ia = 0; ia < prbeval.length; ia++) {
			if (prbeval[ia] == 0) {
				evlcount += 1;
			}
		}
		return evlcount;
	},

	getStchk: function (prbeval) {
		var stchk;
		var evlcount = module.exports.prbevalCount(prbeval);

		if (evlcount == 0) {
			console.log('go out of survey space');
			stchk = 3;
		} else if (evlcount == 1) {
			console.log('redirection');
			stchk = 2;
		} else if (evlcount > 1) {
			if (evlcount == prbeval.length) {
				stchk = 0;
			} else {
				stchk = 1;
			}
			console.log('survey');
		}
		return stchk;

	},

	unpackPrbcode: function (prbcode) {
		var nprbcode = [];
		for (var ia = 0; ia < prbcode.length; ia++) {

			if (ia == 1 || ia == 2) {
				var tmp;
				tmp = prbcode[ia].split('@#');
				nprbcode[ia] = [];
				for (var ib = 0; ib < tmp.length; ib++) {
					nprbcode[ia][ib] = tmp[ib];
				}

			} else if (ia == 0) {
				nprbcode[ia] = prbcode[ia];
			}

		}
		return nprbcode;

	},
	getCurrNumber: function (prbeval) {
		var count = 0;
		var cnumber;
		for (var ia = prbeval.length - 1; ia >= 0; ia--) {
			if (prbeval[ia] == 0) {
				cnumber = ia;
				count += 1;
			}
		}

		return [count, cnumber];

	},

	typechg: function (obj, opt) {
		var rst = [];
		if (Array.isArray(obj)) {
			if (!opt || opt == 0) {
				for (var i = 0; i < obj.length; i++) {
					rst[i] = parseInt(obj[i], 10);
				}
			} else if (opt == 1) {
				for (var i = 0; i < obj.length; i++) {
					rst[i] = parseFloat(obj[i]);
				}

			}
		} else {
			console.log('The paramter should be in ARRAY format. The operation is terminated ABNORMALLY!');
		}
		return rst;
	},

	urlparse: function (str, opt) {
		var qs = require('querystring')
		var rv = [];
		if (Array.isArray(str)) {
			if (opt == 0) {
				for (var i = 0; i < str.length; i++) {
					//				rv[i]=escape(str[i]);		
					rv[i] = qs.escape(str[i]);
					//				rv[i]=encodeURIComponent(str[i]);		
				}
			} else if (opt == 1) {
				for (var i = 0; i < str.length; i++) {
					//				rv[i]=unescape(str[i]);		
					rv[i] = qs.unescape(str[i]);
					//				rv[i]=rv[i].replace(/\+/g,'%20');
					//				rv[i]=decodeURIComponent(str[i]);		
				}
			} else if (opt == 2) {//No treatement. /들어온 그대로 보내기. 테스트용
				for (var i = 0; i < str.length; i++) {
					rv[i] = str[i]
				}
			} else {
				console.log('warning!! no option is ABNORMALLY specified. The string is encoded automatically');
				for (var i = 0; i < str.length; i++) {
					rv[i] = qs.escape(str[i]);
				}
			}
			return rv;
		} else {
			console.log('The first argument is not an array type; operation is ABNORMALLY terminated withouit operation further');
			return str;
		}



	},
	lengthrstcontchk: function (rs) {
		if (rs.length == 0 || rs.length == 1) { //no result at all
			return [0, 'no result from crshistory'];
		} else if (rs.length >= 2) {
			var ua = 1;
			var va = 0;
			var addr = [];
			var tmp;
			var tmp1;
			while (ua <= rs.length) {
				if (rs[rs.length - ua].rstcont == null || rs[rs.length - ua].rstcont == 'admin') {
					ua += 1;

				} else {
					va = ua;
					/*
					tmp=rs[rs.length -ua].crsstage.split(',');
					tmp1=rs[rs.length -ua].elestage.split(',');
					addr[0]=tmp[tmp.length-1];
					addr[1]=tmp1[tmp1.length-1];*/

					addr[0] = rs[rs.length - ua].crsstage;
					addr[1] = rs[rs.length - ua].elestage;

					ua = rs.length + 2;
				}
			}
			if (ua == rs.length + 2) {//there are no rstcont
				return [1, va, addr];
			} else if (ua == rs.lengh + 1) {
				return [3, 'might be some errors'];
			} else {
				return [4, 'severe error you cannont imagine'];
			}

			/*
			if(rs[rs.length-2].rstcont!=null){
				return 1;
			}else{
				return 2;
			}*/
		} else {
			return [5];
		}
	},

	usercrshistory: function (rs, delim) {
		var dumpelestage = '';
		var dumpcrsstage = '';
		for (var i = 0; i < rs.length; i++) {
			if (i == rs.length - 1) {
				dumpelestage = dumpelestage + rs[i].elestage;
				dumpcrsstage = dumpcrsstage + rs[i].crsstage;
			} else {
				dumpelestage = dumpelestage + rs[i].elestage + delim;
				dumpcrsstage = dumpcrsstage + rs[i].crsstage + delim;
			}
		}
		return [dumpelestage, dumpcrsstage];
	},


	getcourseinfo: function (rs, userid, delim, callback) {

		if (rs.length != 0) {
			var p1crs = rs[rs.length - 1].crsstage;
			var p2crs = p1crs.split(',');

			var querycrs = ''
			for (var i = 0; i < p2crs.length; i++) {
				if (i == p2crs.length - 1) {
					querycrs = querycrs + 'crsname="' + p2crs[i] + '"';
				} else {
					querycrs = querycrs + 'crsname="' + p2crs[i] + '" or ';
				}


			}

			var crsinfo = [];

			module.exports.getinfodb('select crsname, pstage,elepass,elenpass from defele where ' + querycrs, function (rr) {
				for (j = 0; j < p2crs.length; j++) {
					var crstmp = '';
					for (jj = 0; jj < rr.length; jj++) {
						if (rr[jj].crsname == p2crs[j]) {
							crstmp = crstmp + rr[jj].pstage + ',' + rr[jj].elepass + ',' + rr[jj].elenpass + ',';
						}

					}
					crsinfo.push([p2crs[j], crstmp]);
				}

				var crsstring = '';
				for (var i = 0; i < p2crs.length; i++) {
					if (i == p2crs.length - 1) {
						crsstring = crsstring + crsinfo[i][0] + delim + crsinfo[i][1];
					} else {
						crsstring = crsstring + crsinfo[i][0] + delim + crsinfo[i][1] + delim;
					}
				}
				callback(crsstring);


			});
		} else {
			callback('');
		}

	},
	crsElementUpload: function (crs, callback) {
		var crsElementPanel = [];
		module.exports.getinfodb('select * from defele join videocont on defele.elevideo=videocont.id where crsname="' + crs + '"', function (rs) {
			var ua = 0;
			for (var ia = 0; ia < rs.length; ia++) {
				crsElementPanel[ua] = [rs[ia].elenum, rs[ia].degsnick, rs[ia].crsname, rs[ia].pstage, rs[ia].elepass, rs[ia].elenpass, rs[ia].vidaddr, rs[ia].eleprbs, rs[ia].ele_criteria, rs[ia].elestatus, rs[ia].eletime];
				ua += 1;
			}
			callback(crsElementPanel);
		});
	},
	chkRelatedCrs: function (crsElementPanel) {
		RelatedCrs = [];
		ua = 0;
		for (var ia = 0; ia < crsElementPanel.length; ia++) {
			var v0 = crsElementPanel[ia][3].split('.');
			if (v0.length == 2) {
				RelatedCrs[ua] = v0[1];
				ua += 1;
			}
		}
		return RelatedCrs;
	},
	AddRelatedCrs: function (rCrs, rCrsPanel) {
		var NrCrsPanel = [];
		var ua = 0;
		var tmpRelatedCrs = [];
		var ub = 0;
		for (var ia = 0; ia < rCrsPanel.length; ia++) {
			NrCrsPanel[ua] = rCrsPanel[ia]
			ua += 1;
		}
		for (var ib = 0; ib < rCrs.length; ib++) {
			NrCrsPanel[ua] = rCrs[ib];
			ua += 1;
		}
		return NrCrsPanel
	},
	AddcrsElement: function (rcrspanel, crsElementPanel, callback) {
		var qrstr = '';
		var NcrsElementPanel = [];
		var ua = 0;
		var tmpCrsElement = [];
		var ub = 0;
		for (var ib = 0; ib < crsElementPanel.length; ib++) {
			NcrsElementPanel[ua] = crsElementPanel[ib];
			ua += 1;
		}

		for (var ia = 0; ia < rcrspanel.length; ia++) {
			if (ia == rcrspanel.length - 1) {
				qrstr = qrstr + ' crsname="' + rcrspanel[ia] + '"';
			} else {
				qrstr = qrstr + ' crsname="' + rcrspanel[ia] + '" or';
			}
		}
		module.exports.getinfodb('select * from defele join videocont on videocont.id=defele.elevideo where' + qrstr, function (rs) {

			for (var ic = 0; ic < rs.length; ic++) {
				NcrsElementPanel[ua] = [rs[ic].elenum, rs[ic].degsnick, rs[ic].crsname, rs[ic].pstage, rs[ic].elepass, rs[ic].elenpass, rs[ic].vidaddr, rs[ic].eleprbs, rs[ic].ele_criteria, rs[ic].elestatus, rs[ic].eletime];
				ua += 1;
				tmpCrsElement[ub] = [rs[ic].elenum, rs[ic].degsnick, rs[ic].crsname, rs[ic].pstage, rs[ic].elepass, rs[ic].elenpass, rs[ic].vidaddr, rs[ic].eleprbs, rs[ic].ele_criteria, rs[ic].elestatus, rs[ic].eletime];
				ub += 1;
			}

			callback(NcrsElementPanel, tmpCrsElement);
		})
	},
	chkInRelatedCrsPanel: function (relatedCrs, RelatedCrsPanel) {
		var tmpRelatedCrs = [];
		var ua = 0;
		for (var ia = 0; ia < relatedCrs.length; ia++) {
			var chk = 0;
			for (var ib = 0; ib < RelatedCrsPanel.length; ib++) {
				if (RelatedCrsPanel[ib] == relatedCrs[ia]) {
					chk = 1;
				}

			}
			if (chk != 1) {
				tmpRelatedCrs[ua] = relatedCrs[ia];
				ua += 1;
			}
		}
		return tmpRelatedCrs;
	},
	upgradeCrselementPanel: function (tmp, crselement) {
		var Ncrselement = [];
		var ua = 0;
		for (var ia = 0; ia < crselement.length; ia++) {
			Ncrselement[ua] = crselement[ia];
			ua += 1;
		}

		for (var ib = 0; ib < tmp.length; ib++) {
			Ncrselement[ua] = tmp[ib];
			ua += 1;
		}
		return Ncrselement;
	},
	removeDuplicate: function (tmp, relatedCrs) {
		var Ntmp = [];
		var ua = 0;
		for (var ia = 0; ia < tmp.length; ia++) {
			var chk = 0;
			for (var ib = 0; ib < relatedCrs.length; ib++) {
				if (tmp[ia] == relatedCrs[ib]) {
					chk = 1;
				}
			}
			if (chk == 0) {
				Ntmp[ua] = tmp[ia];
				ua += 1;
			}
		}
		return Ntmp;
	},
	removeSelfDuplicate: function (obj) {
		var vt = [];
		var tmp = '';
		var chk = 0;
		ua = 0;
		for (var ia = 0; ia < obj.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < vt.length; ib++) {
				if (obj[ia] == vt[ib]) {
					chk = 1;
				}
			}
			if (chk == 0) {
				vt[ua] = obj[ia];
				ua += 1;
			}

		}
		return vt;
	},
	RelatedCrs: function (crs, callback) {
		var async = require('async');
		var loopchk = 1;
		var maincrs = crs;
		var RelatedCrsPanel = [];//RelatedCrsPanel 만들기
		var crsElementPanel = [];//crsElementPanel 만들기
		RelatedCrsPanel[0] = maincrs;//MainCrs추가하기
		module.exports.crsElementUpload(maincrs, function (rs) {//CrsElement Upload하기, CrselementPanel 만들기, CrsElementPanel에 추가하기
			var tmpcrsElement = rs;
			crsElementPanel = module.exports.upgradeCrselementPanel(tmpcrsElement, crsElementPanel);
			var tmprelatedCrs = module.exports.chkRelatedCrs(tmpcrsElement)//RelatedCrsPanel에 RelatedCrs를 추가하기 위해 RelatedCrs의 존재를 확인
			if (tmprelatedCrs.length == 0) {
				callback(crsElementPanel, RelatedCrsPanel)
			} else {

				tmprelatedCrs = module.exports.removeDuplicate(tmprelatedCrs, RelatedCrsPanel);
				tmprelatedCrs = module.exports.removeSelfDuplicate(tmprelatedCrs);

				RelatedCrsPanel = module.exports.AddRelatedCrs(tmprelatedCrs, RelatedCrsPanel);//tmpRelatedCrs를 RelatedCrsPanel에 추가한다.
				async.whilst(
					function (callbackfunction) {
						callbackfunction(null, loopchk == 1)
						//return loopchk==1;
					},
					function (cback) {
						module.exports.AddcrsElement(tmprelatedCrs, crsElementPanel, function (r1, r2) { //tmpRelatedCrs를 중심으로 crsElement를 업로드, upgrade crsElementPanel

							crsElementPanel = r1;
							tmpcrsElement = r2;

							tmprelatedCrs = module.exports.chkRelatedCrs(tmpcrsElement);
							if (tmprelatedCrs.length == 0) {
								loopchk = 0;
							} else {
								tmprelatedCrs = module.exports.removeDuplicate(tmprelatedCrs, RelatedCrsPanel);
								tmprelatedCrs = module.exports.removeSelfDuplicate(tmprelatedCrs);
								if (tmprelatedCrs.length == 0) {
									loopchk = 0;
								} else {
									RelatedCrsPanel = module.exports.AddRelatedCrs(tmprelatedCrs, RelatedCrsPanel);//tmpRelatedCrs를 RelatedCrsPanel에 추가한다.

								}
							}
							cback(null);
						});
					},
					function (err) {
						if (!err) {
							callback(crsElementPanel, RelatedCrsPanel);
						}
					}
				);

			}
		});

	},
	packElement: function (obj, delim) {
		var pack = '';
		for (var ia = 0; ia < obj.length; ia++) {
			if (ia == obj.length - 1) {
				pack = pack + obj[ia];
			} else {
				pack = pack + obj[ia] + delim;
			}
		}
		return pack;
	},
	packCrsEle: function (rr, delim) {
		var crsname = rr[0].crsname;
		var string = crsname + delim;
		var crselement;
		for (var ia = 0; ia < rr.length; ia++) {
			crselement = rr[ia].pstage + ',' + rr[ia].elepass + ',' + rr[ia].elenpass + ',';
			string = string + crselement;
		}
		return string;
	},
	updateSurvey: function (crs, userid, sprcont, sprchos, sprimg, sprchk, delim, callback) {
		var surcont = '';
		var mysqlstr;
		for (var ia = 0; ia < sprcont.length; ia++) {
			if (ia == sprcont.length - 1) {
				surcont = surcont + sprcont[ia] + delim + sprchos[ia] + delim + sprimg[ia] + delim + sprchk[ia];
			} else {
				surcont = surcont + sprcont[ia] + delim + sprchos[ia] + delim + sprimg[ia] + delim + sprchk[ia] + '###';
			}

		}
		module.exports.getinfodb('select * from crshistory where crsname="' + crs + '" and userid="' + userid + '"', function (rr) {
			if (rr.length >= 2) {
				mysqlstr = 'update crshistory set surveycont="' + surcont + '" where elenum="' + rr[rr.length - 2].elenum + '"';
				module.exports.getinfodb(mysqlstr, function () {
					callback(1, rr[rr.length - 2].elenum);
				});

			} else {
				callback(0, 'there is problem on  mysqlcontents detected');
			}
		})


	},

	SelectorSpamElement: function (list, opt) {
		var cho;
		if (opt == 0) {
			cho = 'p';
		} else if (opt == 1) {
			cho = 's';
		} else if (opt == 2) {
			cho = 'r';
		}

		var ls = [];
		var ua = 0;
		for (var ia = 0; ia < list.length; ia++) {
			if (list[ia].prbid[0] == cho) {
				ls[ua] = list[ia].prbid;
				ua += 1;
			}
		}

		return ls;

	},
	ParseRstcont: function (rst, delim) {
		var prbrst = [];
		var tmpr;
		var tmpr1;
		var tmpr2;
		var tva;
		var ua = 0;
		for (var ia = 0; ia < rst.length; ia++) {

			tmpr = rst[ia].rstcont;
			if (tmpr != null) {
				tmpr1 = tmpr.split('###');
				for (var ib = 0; ib < tmpr1.length; ib++) {
					tmpr2 = tmpr1[ib].split(delim);
					prbrst[ua] = [tmpr2[0], tmpr2[1], tmpr2[2], tmpr2[3], tmpr2[4], tmpr2[5]];
					ua += 1;
				}

			}

		}
		return prbrst;
	},
	GetIndependentPrb: function (ansset) {
		var indPrb = [];
		var chk;
		var ua = 0;
		for (var ia = 0; ia < ansset.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < indPrb.length; ib++) {
				if (indPrb[ib] == ansset[ia][0]) {
					chk = 1;
				}
			}
			if (chk == 0 && ansset[ia][0][0] == 'p') {
				indPrb[ua] = ansset[ia][0];
				ua += 1;
			}
		}
		return indPrb;
	},
	AssignStatisticPrb: function (indPrb, ansset) {

		var tva;
		var tvb;
		var rstPrb = [];
		var ua;
		var prbcont;

		for (var ia = 0; ia < indPrb.length; ia++) {
			tva = 0;
			tvb = 0;
			for (var ib = 0; ib < ansset.length; ib++) {
				if (ansset[ib][0] == indPrb[ia]) {

					if (ansset[ib][5] == '1') {
						tva += 1;
					} else {
						tvb += 1;
					}
					ua = ib;

				}
			}
			rstPrb[ia] = [indPrb[ia], ansset[ua][1], tva + tvb, tva, tvb, (tva / (tva + tvb)).toFixed(2)];
		}
		return rstPrb;
	},
	ProblemStatic: function (ansset) {
		var indPrb = module.exports.GetIndependentPrb(ansset);
		var rstPrb = module.exports.AssignStatisticPrb(indPrb, ansset);
		return rstPrb;

	},
	GetStudentId: function (rs) {
		var stulist = [];
		var ua = 0;
		var chk;
		for (var ia = 0; ia < rs.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < stulist.length; ib++) {
				if (stulist[ib] == rs[ia].username) {
					chk = 1;
				}
			}
			if (chk == 0) {
				stulist[ua] = rs[ia].username;
				ua += 1;
			}
		}
		return stulist;
	},
	GetCrsname: function (rr) {
		var crslist = [];
		var ua = 0;
		var chk;
		for (var ia = 0; ia < rr.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < crslist.length; ib++) {
				if (crslist[ib] == rr[ia].crsname) {
					chk = 1;
				}
			}
			if (chk == 0) {
				crslist[ua] = rr[ia].crsname;
				ua += 1;
			}
		}
		return crslist;

	},
	ChkDuplicateCrsname: function (crsname, userid, callback) {
		module.exports.getinfodb('select Gcrsname from Gcourseinfo where stdid="' + userid + '"', function (rs) {
			var chk = 0;
			for (var ia = 0; ia < rs.length; ia++) {
				if (crsname == rs[ia].Gcrsname) {
					chk = 1;
				}
			}
			callback(chk);
		});
	},
	GetIndividualCrsname: function (userid, callback) {
		var individualCrs = [];
		var chk;
		var ua = 0;
		module.exports.getinfodb('select crsname from crshistory where userid="' + userid + '"', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				chk = 0;
				for (var ib = 0; ib < individualCrs.length; ib++) {
					if (rs[ia].crsname == individualCrs[ib]) {
						chk = 1;
					}
				}
				if (chk == 0) {
					individualCrs[ua] = rs[ia].crsname;
					ua += 1;
				}
			}
			callback(individualCrs);
		});
	},
	chkCrsExist: function (crslist, crs) {//[,,],#
		var chk = 0;
		for (var ia = 0; ia < crslist.length; ia++) {
			if (crslist[ia] == crs) {
				chk = 1;
			}
		}
		return chk;
	},
	ElementCall: function (crs, crselement) {//[],[]
		var elementCall = [];
		var ua = 0;
		for (var ia = 0; ia < crselement.length; ia++) {
			if (module.exports.chkCrsExist(crs, crselement[ia][2])) {
				elementCall[ua] = [crselement[ia][2], crselement[ia][3]];
				ua += 1;
			}
		}
		return elementCall;//[[crs,ele0],[crs,ele1],[crs,ele2],...]
	},
	DistinguishSubcrsFromElement: function (elementCall) {// []
		var unitEle = [];
		var subCrsSet = [];
		var ua = 0;
		var ub = 0;
		var tmp;
		for (var ia = 0; ia < elementCall.length; ia++) {
			tmp = elementCall[ia][1].split('.');
			if (tmp.length != 1) {
				subCrsSet[ua] = [elementCall[ia][0], elementCall[ia][1], tmp[1]];
				ua += 1;
			} else {
				unitEle[ub] = [elementCall[ia][0], tmp[0]];
				ub += 1;
			}
		}

		return [unitEle, subCrsSet];//[[[crs,ele0],[crs,ele1],[crs,ele2],,,],[[parent crs,dummy+subcrs,currCrs],[....]]]
	},
	TypePanelUpdateIni: function (unitEle) {//[[crs,ele0],[crs,ele1],[crs,ele2],,,]
		var typePanel = [];
		typePanel[0] = [];
		var ua = 0;
		for (var ia = 0; ia < unitEle.length; ia++) {
			typePanel[0][ua] = [unitEle[ia][0], unitEle[ia][1]]
			ua += 1;
		}
		return typePanel;

	},
	CreateAbsoluteAddress: function (subCrsSet) {
		var absAddr = [];
		for (var ia = 0; ia < subCrsSet.length; ia++) {
			absAddr[ia] = [subCrsSet[ia][0], subCrsSet[ia][1], subCrsSet[ia][2]];
		}
		return absAddr;
	},
	CrsToArray: function (subCrsSet) {
		var crsArr = [];
		for (var ia = 0; ia < subCrsSet.length; ia++) {
			crsArr[ia] = subCrsSet[ia][2];
		}
		return crsArr;

	},
	GetEleOfSubcrs: function (uniteEle, shSubCrs) {//([],#)
		var getEleOfSubcrs = [];
		var ua = 0;
		for (var ia = 0; ia < uniteEle.length; ia++) {
			if (uniteEle[ia][0] == shSubCrs) {
				getEleOfSubcrs[ua] = uniteEle[ia]
				ua += 1;
			}
		}
		return getEleOfSubcrs;
	},
	TypePanelUpdate: function (typePanel, absAddr, uniteEle, subCrsSet, courseTypeNum) {
		var NtypePanel = [];
		for (var ia = 0; ia < typePanel.length; ia++) {
			NtypePanel[ia] = typePanel[ia];
		}

		NtypePanel[courseTypeNum] = [];
		var ua = 0;
		var getEleOfSubcrs;
		//	for(var id=0; id<subCrsSet.length; id++){
		for (var ib = 0; ib < absAddr.length; ib++) {
			//	if(subCrsSet[id][2]==absAddr[ib][2]){
			getEleOfSubcrs = module.exports.GetEleOfSubcrs(uniteEle, absAddr[ib][2]);
			//getEleOfSubcrs=module.exports.GetEleOfSubcrs(uniteEle,subCrsSet[id][2]);	
			for (var ic = 0; ic < getEleOfSubcrs.length; ic++) {
				NtypePanel[courseTypeNum][ua] = [absAddr[ib][0] + ',' + absAddr[ib][2], absAddr[ib][1] + ',' + getEleOfSubcrs[ic][1]];
				//NtypePanel[courseTypeNum][ua]=[absAddr[ib][0]+','+subCrsSet[id][2],absAddr[ib][1]+','+getEleOfSubcrs[ic][1]];
				ua += 1;
			}
			//	}
		}
		//	}
		return NtypePanel;
	},
	AbsoluteAddressUpdate: function (absAddr, subCrsSet) {
		var NabsAddr = [];
		//	for(var ia=0; ia<absAddr.length; ia++){
		//		NabsAddr[ia]=absAddr[ia];
		//	}

		var ua = 0;
		for (var ib = 0; ib < subCrsSet.length; ib++) {
			for (var ic = 0; ic < absAddr.length; ic++) {
				if (subCrsSet[ib][0] == absAddr[ic][2]) { // if parent of subCrsSet is equal to the most recent subcrs of absAddr
					NabsAddr[ua] = [absAddr[ic][0] + ',' + subCrsSet[ib][0], absAddr[ic][1] + ',' + subCrsSet[ib][1], subCrsSet[ib][2]];
					ua += 1;
				}
			}
		}
		return NabsAddr;

	},
	XX: function (crselement, crs, limitedNumber, callback) {

		//	var limitedNumber=2;
		var courseTypeNum = 0;
		var elementCall = module.exports.ElementCall(crs, crselement);
		var disSubFromEle = module.exports.DistinguishSubcrsFromElement(elementCall);
		var uniteEle = disSubFromEle[0];
		var subCrsSet = disSubFromEle[1];
		var typePanel = module.exports.TypePanelUpdateIni(uniteEle);
		var absAddr = module.exports.CreateAbsoluteAddress(subCrsSet);

		var crslist;
		while (courseTypeNum < limitedNumber) {
			if (subCrsSet.length != 0) {
				courseTypeNum += 1;
				crslist = module.exports.CrsToArray(subCrsSet);
				elementCall = module.exports.ElementCall(crslist, crselement);
				disSubFromEle = module.exports.DistinguishSubcrsFromElement(elementCall);
				uniteEle = disSubFromEle[0];
				typePanel = module.exports.TypePanelUpdate(typePanel, absAddr, uniteEle, subCrsSet, courseTypeNum);
				subCrsSet = disSubFromEle[1];
				absAddr = module.exports.AbsoluteAddressUpdate(absAddr, subCrsSet);
			} else {
				courseTypeNum += 1;
				courseTypeNum = limitedNumber;
			}

		}
		callback(typePanel);
	},
	CrsCombination: function (crs, limitedNumber, callback) {
		module.exports.RelatedCrs(crs, function (crselement, relatedcrs) {
			module.exports.XX(crselement, [crs], limitedNumber, function (typePanel) {
				callback(typePanel);
			});

		});
	},
	RandomString(length, opt) {
		if (!opt || opt == 0) {
			var text = '';
			var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
			for (var ia = 0; ia < length; ia++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}
	},
	//Review
	GetObjId(obj, tbname, num, callback) {
		var empstr = module.exports.RandomString(num);
		var revid = obj + '.' + empstr;
		module.exports.getinfodb('select * from ' + tbname, function (rs) {
			var ua = 1;
			var chk;
			var ub = 0;
			while (ua == 1) {
				chk = 0;
				for (var ia = 0; ia < rs.length; ia++) {
					if (rs[ia].id == revid) {
						chk = 1;
					}
				}
				if (chk == 1) {
					ua = 1;
					empstr = module.exports.RandomString(10);
					revid = obj + '.' + empstr;
				} else {
					ua = 0;
				}
				ub += 1;
				if (ub > 1000) {
					ua = 0;
				}
			}
			callback(revid)
		});

	},

	WhalseGetObjId(tbname, num, callback) {
		var empstr = module.exports.RandomString(num);
		var revid = empstr;
		module.exports.whalsegetinfodb('select * from ' + tbname, function (rs) {
			var ua = 1;
			var chk;
			var ub = 0;
			while (ua == 1) {
				chk = 0;
				for (var ia = 0; ia < rs.length; ia++) {
					if (rs[ia].id == revid) {
						chk = 1;
					}
				}
				if (chk == 1) {
					ua = 1;
					empstr = module.exports.RandomString(10);
					revid = empstr;
				} else {
					ua = 0;
				}
				ub += 1;
				if (ub > 1000) {
					ua = 0;
				}
			}
			callback(revid)
		});

	},



	GetObjIdv2(obj, tbname, colname, num, callback) {
		var empstr = module.exports.RandomString(num);
		var revid = obj + '.' + empstr;
		module.exports.getinfodb('select ' + colname + ' as id from ' + tbname, function (rs) {
			var ua = 1;
			var chk;
			var ub = 0;
			while (ua == 1) {
				chk = 0;
				for (var ia = 0; ia < rs.length; ia++) {
					if (rs[ia].id == revid) {
						chk = 1;
					}
				}
				if (chk == 1) {
					ua = 1;
					empstr = module.exports.RandomString(10);
					revid = obj + '.' + empstr;
				} else {
					ua = 0;
				}
				ub += 1;
				if (ub > 1000) {
					ua = 0;
				}
			}
			callback(revid)
		});

	},



	RegisterReview(userid, usercomment, callback) {
		module.exports.GetObjId('rev', 'reviewcont', 10, function (revid) {
			module.exports.getinfodb('insert into reviewcont (id, revcont, userid, date) values ("' + revid + '","' + usercomment + '","' + userid + '","' + module.exports.nodetime() + '")', function () {
				callback(revid);
			});
		});
	},
	ConnectReviewToCrsname(revid, crsname, userid, callback) {
		module.exports.GetObjId('con', 'connect_prv', 10, function (id) {
			module.exports.getinfodb('insert into connect_prv (id, crsname, reviewid,date) values("' + id + '","' + crsname + '","' + revid + '","' + module.exports.nodetime() + '")', function () {
				callback(id)
			});
		});
	},
	ConnectReview(revid, prbid, userid, callback) {
		module.exports.GetObjId('con', 'connect_prv', 10, function (id) {
			module.exports.getinfodb('insert into connect_prv (id, prbid, reviewid,date) values("' + id + '","' + prbid + '","' + revid + '","' + module.exports.nodetime() + '")', function () {
				callback(id);
			});
		});
	},
	ChkDuplicateVid(vidaddr, rs) {
		var chk = 0;
		var vidid;
		for (var ia = 0; ia < rs.length; ia++) {
			if (rs[ia].vidaddr == vidaddr) {
				chk = 1;
				vidid = rs[ia].id;
			}
		}
		if (chk == 1) {
			return [chk, vidid]
		} else {
			return [chk, ''];
		}
		return chk;
	},
	RegisterVidv2(vidaddr, userid, vidinfo, callback) {
		var vidid;
		var chklist = [0];
		var rst;
		var id;
		if (vidaddr == '') {
			id = 'mov.aaaaaaaaaa';
			chklist[0] = 2;
			callback(chklist, id);
		} else {
			module.exports.getinfodb('select * from videocont', function (rs) {
				var chkDup = module.exports.ChkDuplicateVid(vidaddr, rs);
				if (chkDup[0]) {
					chklist[0] = 0;
					callback(chklist, chkDup[1]);
				} else {
					chklist[0] = 1;
					module.exports.GetObjId('mov', 'videocont', 10, function (id) {
						module.exports.getinfodb('insert into videocont (id,userid, date, vidaddr,vidinfo) values ("' + id + '","' + userid + '","' + module.exports.nodetime() + '","' + vidaddr + '","' + vidinfo + '")', function () {
							callback(chklist, id);
						});
					});
				}
			});
		}
	},
	RegisterVid(vidaddr, userid, callback) {
		var vidid;
		var chklist = [0];
		var rst;
		var id;
		if (vidaddr == '') {
			id = 'mov.aaaaaaaaaa';
			chklist[0] = 2;
			callback(chklist, id);
		} else {
			module.exports.getinfodb('select * from videocont', function (rs) {
				var chkDup = module.exports.ChkDuplicateVid(vidaddr, rs);
				if (chkDup[0]) {
					chklist[0] = 0;
					callback(chklist, chkDup[1]);
				} else {
					chklist[0] = 1;
					module.exports.GetObjId('mov', 'videocont', 10, function (id) {
						module.exports.getinfodb('insert into videocont (id,userid, date, vidaddr) values ("' + id + '","' + userid + '","' + module.exports.nodetime() + '","' + vidaddr + '")', function () {
							callback(chklist, id);
						});
					});
				}
			});
		}
	},
	GetPrbReview(rstprb, callback) {
		var prblist = [];
		var ua = 0;
		var chk, ub;
		module.exports.getinfodb('select connect_prv.prbid, reviewcont.revcont,reviewcont.id from reviewcont left join connect_prv on reviewcont.id=connect_prv.reviewid ', function (rs) {
			for (var ia = 0; ia < rstprb.length; ia++) {
				ub = 0;
				chk = 0;
				for (var ib = 0; ib < rs.length; ib++) {
					if (rstprb[ia][0] == rs[ib].prbid) {
						chk = 1;
						if (ub == 0) {
							prblist[ua] = [];
							prblist[ua][0] = rs[ib].prbid;
							prblist[ua][1] = [];
							prblist[ua][2] = [];
						}
						prblist[ua][1].push(rs[ib].revcont)
						prblist[ua][2].push(rs[ib].id)
						ub += 1;

					}
				}
				if (chk == 1) {
					ua += 1;
				} else {
					prblist[ua] = [rstprb[ia][0], [], []]
					ua += 1;
				}
			}
			callback(prblist);
		});
	},
	GetReviewId(prbreview) {
		var revlist = [];
		var ua = 0;
		for (var ia = 0; ia < prbreview.length; ia++) {
			for (var ib = 0; ib < prbreview[ia][2].length; ib++) {
				revlist[ua] = prbreview[ia][2][ib];
			}
		}
		return revlist;

	},
	GetVoteResult(prbreview, callback) {
		var count;
		var ua;
		var Nprbreview = []
		module.exports.getinfodb('select connect_prv.reviewid,thumbvote.votecontent from thumbvote join connect_prv on connect_prv.thumbid=thumbvote.id', function (rs) {
			for (var ia = 0; ia < prbreview.length; ia++) {
				Nprbreview[ia] = prbreview[ia];
				Nprbreview[ia][3] = [];
				for (var ib = 0; ib < Nprbreview[ia][2].length; ib++) {
					count = 0;
					for (var ic = 0; ic < rs.length; ic++) {
						if (rs[ic].reviewid == Nprbreview[ia][2][ib] && rs[ic].votecontent == '1') {
							count += 1;
						}
					}
					Nprbreview[ia][3][ib] = count;
				}
			}
			callback(Nprbreview);
		});
	},
	GetVoteCount(rs, addr, userid) {
		var count = 0;
		var chk = 0;
		for (var ia = 0; ia < rs.length; ia++) {
			if (rs[ia].reviewid == addr && rs[ia].votecontent == 1) {
				count += 1;
				if (rs[ia].userid == userid) {
					chk = 1;
				}
			}
		}
		return [chk, count];
	},
	UpdateVote(addr, userid, callback) {
		module.exports.getinfodb('select * from thumbvote left join connect_prv on connect_prv.thumbid=thumbvote.id where reviewid="' + addr + '"', function (rs) {
			module.exports.GetObjId('thm', 'thumbvote', 10, function (id) {
				var getCount = module.exports.GetVoteCount(rs, addr, userid);
				if (getCount[0] == 0) {
					callback(getCount);
					module.exports.getinfodb('insert into thumbvote (id,userid, votecontent,date) values ("' + id + '","' + userid + '","' + '1' + '","' + module.exports.nodetime() + '")', function () { });
					module.exports.GetObjId('con', 'connect_prv', 10, function (id2) {
						module.exports.getinfodb('insert into connect_prv (id,reviewid,thumbid,date) values ("' + id2 + '","' + addr + '","' + id + '","' + module.exports.nodetime() + '")', function () { });
					});
				} else {
					callback(getCount);
				}
			});

		});
	},
	PrbJudgePossible(rstprb, num, score) {
		var possprb = [];
		var imposprb = [];
		var ua = 0;
		var ub = 0;

		for (var ia = 0; ia < rstprb.length; ia++) {
			if (rstprb[ia][2] >= num && rstprb[ia][5] >= score) {
				possprb[ua] = rstprb[ia];
				ua += 1;
			} else {
				imposprb[ub] = rstprb[ia];
				ub += 1;
			}
		}

		return [possprb, imposprb]


	},
	FeedParsing(rs) {
		var crslist = [];
		var feedparse = [];
		var chk;
		var ua = 0;


		for (var ia = 0; ia < rs.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < crslist.length; ib++) {
				if (crslist[ib] == rs[ia].Gcrsname) {
					chk = 1;
				}
			}
			if (chk == 0) {
				crslist[ua] = rs[ia].Gcrsname;
				ua += 1;
			}
		}
		var uc;
		for (var ic = 0; ic < crslist.length; ic++) {
			uc = 0;
			for (var id = 0; id < rs.length; id++) {
				if (crslist[ic] == rs[id].Gcrsname) {
					if (uc == 0) {
						feedparse[ic] = [crslist[ic], [rs[id].revcont], [rs[id].reviewid]];
					} else {
						feedparse[ic][1][uc] = rs[id].revcont;
						feedparse[ic][2][uc] = rs[id].reviewid;
					}
					uc += 1;
				}
			}
		}
		return feedparse;
	},

	FDIDArrayForm(Nrs) {
		var sepel = [];
		for (var ia = 0; ia < Nrs.length; ia++) {
			sepel[ia] = [Nrs[ia].stdid, Nrs[ia].Gcrsname, Nrs[ia].elestage];
		}
		return sepel;
	},
	FDIDParsing(sepel) {
		var indCrs = [];
		var ua = 0;
		var chk;

		for (var ia = 0; ia < sepel.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < indCrs.length; ib++) {
				if (sepel[ia][1] == indCrs[ib]) {
					chk = 1;
				}
			}
			if (chk == 0) {
				indCrs[ua] = sepel[ia][1];
				ua += 1;
			}
		}


		var parsingList = [];
		var ub;
		for (var ic = 0; ic < indCrs.length; ic++) {
			parsingList[ic] = [indCrs[ic], []];
			ub = 0;
			for (var id = 0; id < sepel.length; id++) {
				if (indCrs[ic] == sepel[id][1]) {
					parsingList[ic][1][ub] = [sepel[id][0], sepel[id][2]];
					ub += 1;
				}
			}
		}

		return parsingList;
	},
	SearchFeedInCrshistory(rs, schStr) {
		var verele;
		var verele2;
		var ftest = schStr;

		var Nrs = [];
		var ua = 0;
		for (var ia = 0; ia < rs.length; ia++) {
			verele = rs[ia].elestage.split(',');
			verele2 = verele[verele.length - 1];
			verele3 = verele2.split(':');
			verele4 = verele3[1];
			if (verele4 == ftest) {
				Nrs[ua] = rs[ia];
				ua += 1;
			}
		}



		return Nrs;
	},
	FDIDRmvDuplicate(pslist) {
		var duplist;
		var tsstr;
		var ua;
		var Npslist = [];

		for (var ia = 0; ia < pslist.length; ia++) {
			duplist = [];
			ua = 0;
			for (var ib = 0; ib < pslist[ia][1].length; ib++) {
				chk = 0;
				for (var ic = 0; ic < duplist.length; ic++) {
					if (duplist[ic][0] == pslist[ia][1][ib][0] && duplist[ic][1] == pslist[ia][1][ib][1]) {
						chk = 1;
					}
				}
				if (chk == 0) {
					duplist[ua] = pslist[ia][1][ib];
					ua += 1;
				}
			}
			Npslist[ia] = [pslist[ia][0], duplist]
		}

		return Npslist;


	},
	FDIDMain(rs, schStr) {
		var Nrs = module.exports.SearchFeedInCrshistory(rs, schStr);
		var sepel = module.exports.FDIDArrayForm(Nrs);
		var pslist = module.exports.FDIDParsing(sepel);
		var Npslist = module.exports.FDIDRmvDuplicate(pslist);

		return Npslist;


	},
	RCSCallReviewMain(rstcont, callback) {
		var Nrstlist;
		Nrstlist = module.exports.RCSParsingToList(rstcont);
		var sql = module.exports.RCSParsingToSql(Nrstlist);
		module.exports.RCSGetReviewCont(sql, function (psReview) {
			callback(psReview);
		});
	},
	RCSParsingReview(rs) {
		var indprbid = [];
		var ua = 0;
		for (var ia = 0; ia < rs.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < indprbid.length; ib++) {
				if (indprbid[ib] == rs[ia].prbid) {
					chk = 1;
				}
			}
			if (chk == 0) {
				indprbid[ua] = rs[ia].prbid;
				ua += 1;
			}
		}

		var parseReview = [];
		var ub;

		for (var ic = 0; ic < indprbid.length; ic++) {
			ub = 0;
			parseReview[ic] = [indprbid[ic], [], []];
			for (var id = 0; id < rs.length; id++) {
				if (indprbid[ic] == rs[id].prbid) {
					parseReview[ic][1][ub] = rs[id].revcont;
					parseReview[ic][2][ub] = rs[id].reviewid;

					ub += 1;
				}
			}

		}
		return parseReview;


	},
	RCSGetReviewCont(sql, callback) {
		module.exports.getinfodb('select prbid,revcont,reviewid from connect_prv join reviewcont on connect_prv.reviewid=reviewcont.id where ' + sql, function (rs) {
			var parseReview = module.exports.RCSParsingReview(rs);
			callback(parseReview);
		});

	},
	RCSParsingToSql(Nrstlist) {
		var sql = '';
		for (var ia = 0; ia < Nrstlist.length; ia++) {
			if (ia == Nrstlist.length - 1) {
				sql = sql + 'prbid="' + Nrstlist[ia] + '"'
			} else {
				sql = sql + 'prbid="' + Nrstlist[ia] + '" or '
			}

		}

		return sql;

	},
	RCSParsingToList(rstcont) {
		var NrstNum = [];
		for (var ia = 0; ia < rstcont.length; ia++) {
			NrstNum[ia] = rstcont[ia][0];
		}
		return NrstNum;

	},
	CEEGetIndividualCrs(callback) {
		var individualCrs = [];
		var chk;
		var ua = 0;
		module.exports.getinfodb('select Gcrsname,subjmode from Gcourseinfo', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				chk = 0;
				for (var ib = 0; ib < individualCrs.length; ib++) {
					if (rs[ia].Gcrsname == individualCrs[ib][0]) {
						chk = 1;
					}
				}
				if (chk == 0) {
					individualCrs[ua] = [rs[ia].Gcrsname, rs[ia].subjmode];
					ua += 1;
				}
			}
			callback(individualCrs);
		});

	},
	CEEParsingElement(typePanel, rr, callback) {
		var ceeparse = [];
		var ua;
		var tmpcrs;
		var tmpcrs1;
		var tmpele;
		var tmpele1;
		ua = 0;

		for (var ia = 0; ia < typePanel.length; ia++) { //number of deepness
			for (var ib = 0; ib < typePanel[ia].length; ib++) {

				tmpcrs = typePanel[ia][ib][0].split(',');
				tmpcrs1 = tmpcrs[tmpcrs.length - 1];
				tmpele = typePanel[ia][ib][1].split(',');
				tmpele1 = tmpele[tmpele.length - 1];
				for (var ic = 0; ic < rr.length; ic++) {
					if (rr[ic][2] == tmpcrs1 && rr[ic][3] == tmpele1) {
						ceeparse[ua] = [ia, typePanel[ia][ib][0], typePanel[ia][ib][1], rr[ic][7].split(',')];
						ua += 1;
					}
				}
			}
		}
		module.exports.getinfodb('select connect_prv.crsname, connect_prv.element, connect_prv.prbid, reviewcont.revcont,reviewcont.id from reviewcont join connect_prv on reviewcont.id=connect_prv.reviewid where prbid is not null', function (rs) {
			var rstlist = [];
			var ua = 0;
			/*
			for(var ic=0; ic<ceeparse.length;ic++){
				for(var id=0; id<ceeparse[ic][1].length; id++){
					for(var ie=0; ie<ceeparse[ic][2][id].length; ie++){
						indlist[ua]=[ceeparse[ic][0],ceeparse[ic][1][id],ceeparse[ic][2][id][ie]];
						ua+=1;
					}
				}
			}*/

			var uc = 0;
			for (var ig = 0; ig < ceeparse.length; ig++) {
				for (var id = 0; id < ceeparse[ig][3].length; id++) {
					for (var ih = 0; ih < rs.length; ih++) {
						if (ceeparse[ig][1] == rs[ih].crsname && ceeparse[ig][2] == rs[ih].element && ceeparse[ig][3][id] == rs[ih].prbid) {
							rstlist[uc] = [ceeparse[ig][0], rs[ih].crsname, rs[ih].element, rs[ih].prbid, rs[ih].id, rs[ih].revcont];
							uc += 1;
						}
					}
				}
			}

			callback(ceeparse, rstlist);
		});

	},
	CEECombine(ra, rb) {
		//ra['GGASDF',[PRES,PDDD,pSFA.ASDFASDFA, ,],[[p00001,p0002],[p03212,p24213]]]
		//rb['p2341',[ㅎㅎㅎㅎ','나는이게'],[rev.sfaafa,rev.sdfasdf],[2,3]]
	},
	CEEGetReviewCont(sql, addr, callback) {
		module.exports.getinfodb('select prbid,revcont,reviewid from connect_prv join reviewcont on connect_prv.reviewid=reviewcont.id where (' + sql + ') and (connect_prv.crsname="' + addr[0] + '" and connect_prv.element="' + addr[1] + '")', function (rs) {
			console.log(rs);
			var parseReview = module.exports.RCSParsingReview(rs);
			callback(parseReview);
		});

	},
	CEEConnectReview(revid, prbid, userid, crsname, element, callback) {
		module.exports.GetObjId('con', 'connect_prv', 10, function (id) {
			module.exports.getinfodb('insert into connect_prv (id, prbid, reviewid,crsname,element,date) values("' + id + '","' + prbid + '","' + revid + '","' + crsname + '","' + element + '","' + module.exports.nodetime() + '")', function () {
				callback(id);
			});
		});
	},
	CEEUpdateVote(revaddr, userid, envaddr, callback) {
		module.exports.getinfodb('select * from thumbvote left join connect_prv on connect_prv.thumbid=thumbvote.id where reviewid="' + revaddr + '" and crsname="' + envaddr[0] + '" and element="' + envaddr[1] + '"', function (rs) {
			module.exports.GetObjId('thm', 'thumbvote', 10, function (id) {
				var getCount = module.exports.CEEGetVoteCount(rs, revaddr, userid, envaddr);
				if (getCount[0] == 0) {
					callback(getCount);
					module.exports.getinfodb('insert into thumbvote (id,userid, votecontent,date) values ("' + id + '","' + userid + '","' + '1' + '","' + module.exports.nodetime() + '")', function () { });
					module.exports.GetObjId('con', 'connect_prv', 10, function (id2) {
						module.exports.getinfodb('insert into connect_prv (id,reviewid,crsname,element,thumbid,date) values ("' + id2 + '","' + revaddr + '","' + envaddr[0] + '","' + envaddr[1] + '","' + id + '","' + module.exports.nodetime() + '")', function () { });
					});
				} else {
					callback(getCount);
				}
			});

		});
	},
	CEEGetVoteCount(rs, revaddr, userid, envaddr) {
		var count = 0;
		var chk = 0;
		for (var ia = 0; ia < rs.length; ia++) {
			if (rs[ia].reviewid == revaddr && rs[ia].votecontent == 1 && rs[ia].crsname == envaddr[0] && rs[ia].element == envaddr[1]) {
				count += 1;
				if (rs[ia].userid == userid) {
					chk = 1;
				}
			}
		}
		return [chk, count];
	},
	CEEGetVoteResult(prbreview, callback) {
		var count;
		var ua;
		var Nprbreview = []

		module.exports.getinfodb('select connect_prv.crsname,connect_prv.element,connect_prv.reviewid,thumbvote.votecontent from thumbvote join connect_prv on connect_prv.thumbid=thumbvote.id', function (rs) {
			for (var ia = 0; ia < prbreview.length; ia++) {
				Nprbreview[ia] = prbreview[ia];
			}
			for (var ib = 0; ib < Nprbreview.length; ib++) {
				count = 0;
				for (var ic = 0; ic < rs.length; ic++) {
					if (rs[ic].crsname == Nprbreview[ib][1] && rs[ic].element == Nprbreview[ib][2] && rs[ic].reviewid == Nprbreview[ib][4] && rs[ic].votecontent == '1') {
						count += 1;
					}
				}
				Nprbreview[ib][6] = count;
			}
			callback(Nprbreview);
		});
	},
	CEEIntergratedArrange(rb, limit) {
		var ceearg = [];
		var ua, ub;
		var crsind = module.exports.IndList(rb, 1);
		var prbind = module.exports.IndList(rb, 3);


		var uc, ub = 0;
		console.log(crsind)
		console.log(prbind)
		var tmp;
		//	for(var ia=0; ia<limit; ia++){
		//		ceearg[ia]=[];
		for (var ib = 0; ib < crsind.length; ib++) {
			ceearg[ib] = [crsind[ib], []]
			for (var ic = 0; ic < prbind.length; ic++) {
				tmp = [prbind[ic], []]
				uc = 0;
				for (var id = 0; id < rb.length; id++) {
					if (rb[id][1] == crsind[ib] && rb[id][3] == prbind[ic]) {
						tmp[1][uc] = [rb[id][4], rb[id][5], rb[id][6]];
						uc += 1;
					}
				}
				ceearg[ib][1][ub] = tmp;
				ub += 1;
			}
			ub = 0;
		}
		//	}

		return ceearg;

	},
	CEEUniqueList(rb, od) {
		var ua = 0;
		var chkuni;
		var uniquelist = [];
		for (var ia = 0; ia < rb.length; ia++) {
			chkuni = 0;
			for (var ib = 0; ib < uniquelist.length; ib++) {
				if (rb[ia][od] == uniquelist[ib]) {
					chkuni = 1;
				}
			}
			if (chkuni == 0) {
				uniquelist[ua] = rb[ia][od];
				ua += 1;
			}
		}
		return uniquelist
	},
	CEEIndependentArrange(rb, limit) {
	},
	CEECrsElementJoint(rb) {
		var crsind = module.exports.CEEUniqueList(rb, 1);
		var eleind = module.exports.CEEUniqueList(rb, 2);
		var prbidind = module.exports.CEEUniqueList(rb, 3);

		var crseleset = [];
		var ua;
		for (var ia = 0; ia < crsind.length; ia++) {
			crseleset[ia] = [crsind[ia], []];
			ua = 0;
		}


		var ub = 0;
		var uc = 0;
		var elepanel = [];
		var elechk;
		for (var ib = 0; ib < crseleset.length; ib++) {
			elepanel = [];
			ub = 0
			uc = 0;
			for (var ic = 0; ic < rb.length; ic++) {
				if (rb[ic][1] == crseleset[ib][0]) {
					for (id = 0; id < eleind.length; id++) {
						if (rb[ic][2] == eleind[id]) {
							elechk = 0;
							for (var ie = 0; ie < elepanel.length; ie++) {
								if (elepanel[ie] == eleind[id]) {
									elechk = 1;
								}
							}
							if (elechk == 0) {
								crseleset[ib][1][ub] = [eleind[id], []];
								elepanel[uc] = eleind[id];
								uc += 1;
								ub += 1;
							}
						}
					}
				}
			}
		}

		var ue = 0;
		var ud = 0;
		var prbpanel;
		var prbchk;
		for (var ig = 0; ig < crseleset.length; ig++) {
			for (var ih = 0; ih < crseleset[ig][1].length; ih++) {
				prbpanel = [];
				ue = 0;
				ud = 0;
				for (var ii = 0; ii < rb.length; ii++) {
					if (crseleset[ig][0] == rb[ii][1] && crseleset[ig][1][ih][0] == rb[ii][2]) {
						for (var ij = 0; ij < prbidind.length; ij++) {
							if (rb[ii][3] == prbidind[ij]) {
								prbchk = 0;
								for (var ik = 0; ik < prbpanel.length; ik++) {
									if (prbpanel[ik] == prbidind[ij]) {
										prbchk = 1;
									}
								}
								if (prbchk == 0) {
									crseleset[ig][1][ih][1][ud] = [prbidind[ij], []];
									prbpanel[ue] = prbidind[ij];
									ue += 1;
									ud += 1;
								}


							}

						}
					}
				}
			}
		}

		var uf;

		for (var il = 0; il < crseleset.length; il++) {
			for (var im = 0; im < crseleset[il][1].length; im++) {
				for (var io = 0; io < crseleset[il][1][im][1].length; io++) {
					uf = 0;
					for (var ip = 0; ip < rb.length; ip++) {
						if (rb[ip][1] == crseleset[il][0] && rb[ip][2] == crseleset[il][1][im][0] && rb[ip][3] == crseleset[il][1][im][1][io][0]) {
							crseleset[il][1][im][1][io][1][uf] = [rb[ip][4], rb[ip][5], rb[ip][6]];
							uf += 1;
						}
					}
				}
			}
		}

		return crseleset;
	},
	IndList(ls, n) {
		var indlist = [];
		var chk;
		var ua = 0;
		for (var ia = 0; ia < ls.length; ia++) {
			chk = 0;
			for (var ib = 0; ib < indlist.length; ib++) {
				if (indlist[ib] == ls[ia][n]) {
					chk = 1;
				}
			}
			if (chk == 0) {
				indlist[ua] = ls[ia][n];
				ua += 1;
			}
		}

		return indlist;
	},
	CEERemoveThumb(addr, callback) {
		var thumblist = [];
		var ua = 0;
		module.exports.getinfodb('select thumbid,reviewid from connect_prv where reviewid="' + addr + '" and thumbid is not null', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				thumblist[ua] = rs[ia].thumbid;
				ua += 1;
			}
			var parsethm = '';
			for (var ib = 0; ib < thumblist.length; ib++) {
				if (ib == thumblist.length - 1) {
					parsethm = parsethm + 'id="' + thumblist[ib] + '"';
				} else {
					parsethm = 'id="' + parsethm + thumblist[ib] + '" or ';
				}
			}
			module.exports.getinfodb('delete from thumbvote where ' + parsethm, function () { });
			module.exports.getinfodb('delete from connect_prv where reviewid="' + addr + '"', function () { });
			callback();

		});
	},
	ARSRegisterAsk(userid, prbid, userask, callback) {
		module.exports.GetObjId('ask', 'askreq', 10, function (askid) {
			module.exports.getinfodb('insert into askreq (id, askcon,prbid, userid, date) values ("' + askid + '","' + userask + '","' + prbid + '","' + userid + '","' + module.exports.nodetime() + '")', function () {
				callback(askid);
			});
		});
	},
	//User Supervising System Chatting
	USCRegisterChat(receiver, msgcont, userid, callback) {
		module.exports.GetObjId('chmsg', 'chatmsg', 10, function (chatmsgid) {
			module.exports.getinfodb('insert into chatmsg (chtid, msgcont, userid, date) values ("' + chatmsgid + '","' + msgcont + '","' + userid + '","' + module.exports.nodetime() + '")', function () {
				module.exports.GetObjId('chcon', 'chatconnect', 10, function (conid) {
					module.exports.getinfodb('insert into chatconnect (conid, receiver, msgid) values ("' + conid + '","' + receiver + '","' + chatmsgid + '")', function () {

						callback(chatmsgid, conid);
					});
				});
			});
		});

	},
	OCSDataInfo(staticcrs, opt, callback) {
		if (!opt || opt == 0) {
			module.exports.getinfodb('select pstage, eleprbs, ele_criteria, elestatus  from defele where crsname="' + staticcrs + '"', function (rs) {
				module.exports.getinfodb('select * from crshistory where crsname="' + staticcrs + '"', function (ra) {
					callback(rs, ra);
				});
			});
		} else if (opt == 1) {
			module.exports.getinfodb('select pstage, eleprbs, ele_criteria, elestatus  from defele where crsname="' + staticcrs + '"', function (rs) {
				module.exports.getinfodb('select * from crshistory', function (ra) {
					callback(rs, ra);
				});
			});
		}
	},
	OCSNumberOfPass(staticcrs, opt, callback) {
		var rtio;
		var rat, vgr, vst, vto;
		var statcrs = [];
		if (opt == '0') {
			module.exports.OCSDataInfo(staticcrs, 0, function (df, ch) {
				for (var ia = 0; ia < df.length; ia++) {
					statcrs[ia] = [df[ia].pstage]
					rtio = 0;
					vto = 0;
					for (var ib = 0; ib < ch.length; ib++) {
						if (df[ia].pstage == ch[ib].elestage && ch[ib].crseval != null && ch[ib].crseval != 'admin' && Boolean(ch[ib].crseval)) {
							rat = ch[ib].crseval.split(',');
							vgr = parseFloat(rat[0]);
							vst = parseFloat(rat[1]);
							vto += 1;

							if (vgr >= vst) {
								rtio += 1;
							}
							console.log(rat)

						}
					}

					if (vto == 0) {
						statcrs[ia][1] = 'never';
						statcrs[ia][2] = 0;
						statcrs[ia][3] = df[ia].eleprbs;
						statcrs[ia][4] = df[ia].ele_criteria;
					} else {
						statcrs[ia][1] = vto;
						statcrs[ia][2] = rtio;
						statcrs[ia][3] = df[ia].eleprbs;
						statcrs[ia][4] = df[ia].ele_criteria;
					}


				}
				callback(statcrs);
			});
		} else if (opt == '1') { // search and get statistics from all crshistory including subprogress.
			var tmp, chcrs, chele;
			module.exports.OCSDataInfo(staticcrs, 1, function (df, ch) {
				for (var ia = 0; ia < df.length; ia++) {
					statcrs[ia] = [df[ia].pstage]
					rtio = 0;
					vto = 0;
					for (var ib = 0; ib < ch.length; ib++) {

						//for crsstage check
						tmp = ch[ib].crsstage.split(',');
						chcrs = tmp[tmp.length - 1];

						//for elestage check
						tmp = ch[ib].elestage.split(',');
						chele = tmp[tmp.length - 1];

						if (staticcrs == chcrs && df[ia].pstage == chele && ch[ib].crseval != null && ch[ib].crseval != 'admin' && Boolean(ch[ib].crseval)) {
							rat = ch[ib].crseval.split(',');
							vgr = parseFloat(rat[0]);
							vst = parseFloat(rat[1]);
							vto += 1;

							if (vgr >= vst) {
								rtio += 1;
							}
							console.log(rat)

						}
					}

					if (vto == 0) {
						statcrs[ia][1] = 'never';
						statcrs[ia][2] = 0;
						statcrs[ia][3] = df[ia].eleprbs;
						statcrs[ia][4] = df[ia].ele_criteria;
					} else {
						statcrs[ia][1] = vto;
						statcrs[ia][2] = rtio;
						statcrs[ia][3] = df[ia].eleprbs;
						statcrs[ia][4] = df[ia].ele_criteria;
					}


				}
				callback(statcrs);
			});
		}
	},
	EPCParseRstcont: function (rst, delim) {
		var prbrst = [];
		var tmpr;
		var tmpr1;
		var tmpr2;
		var tva;
		var ua = 0;
		for (var ia = 0; ia < rst.length; ia++) {

			tmpr = rst[ia].rstcont;
			if (tmpr != null && tmpr != 'admin' && Boolean(tmpr)) {
				tmpr1 = tmpr.split('###');
				for (var ib = 0; ib < tmpr1.length; ib++) {
					tmpr2 = tmpr1[ib].split(delim);
					if (tmpr2[0][0] == 'p' || tmpr2[0][0] == 'g') {
						prbrst[ua] = [rst[ia].crsname, rst[ia].crsstage, rst[ia].elestage, tmpr2[0], tmpr2[5]];
						ua += 1;
					}
				}

			}

		}
		return prbrst;
	},
	EPCDistCrshistory: function (ansset) {
		/*
		var locind=[];
		var ua=0;
		var locchk;
		for(var ia=0; ia<ansset.length; ia++){
			locchk=0;
			for(var ib=0; ib<locind.length; ib++){
				if(locind[ib][0]==ansset[ia][0] && locind[ib][1]==ansset[ia][1] && locind[ib][2]==ansset[ia][2]){
					locchk=1;
				}
			}
			if(locchk==0){
				locind[ua]=[ansset[ia][0],ansset[ia][1],ansset[ia][2]]
				ua+=1;
			}
	
		}*/

		var mainind = module.exports.CEEUniqueList(ansset, 0);
		var crsind = module.exports.CEEUniqueList(ansset, 1);
		var eleind = module.exports.CEEUniqueList(ansset, 2);

		var crseleset = [];
		var ua;
		for (var ia = 0; ia < mainind.length; ia++) {
			crseleset[ia] = [mainind[ia], []];
			ua = 0;
		}


		var ub = 0;
		var uc = 0;
		var crspanel = [];
		var crschk;
		for (var ib = 0; ib < crseleset.length; ib++) {
			crspanel = [];
			ub = 0
			uc = 0;
			for (var ic = 0; ic < ansset.length; ic++) {
				if (ansset[ic][0] == crseleset[ib][0]) {
					for (id = 0; id < crsind.length; id++) {
						if (ansset[ic][1] == crsind[id]) {
							crschk = 0;
							for (var ie = 0; ie < crspanel.length; ie++) {
								if (crspanel[ie] == crsind[id]) {
									crschk = 1;
								}
							}
							if (crschk == 0) {
								crseleset[ib][1][ub] = [crsind[id], []];
								crspanel[uc] = crsind[id];
								uc += 1;
								ub += 1;
							}
						}
					}
				}
			}
		}

		var ue = 0;
		var ud = 0;
		var elepanel;
		var elechk;
		for (var ig = 0; ig < crseleset.length; ig++) {
			for (var ih = 0; ih < crseleset[ig][1].length; ih++) {
				elepanel = [];
				ue = 0;
				ud = 0;
				for (var ii = 0; ii < ansset.length; ii++) {
					if (crseleset[ig][0] == ansset[ii][0] && crseleset[ig][1][ih][0] == ansset[ii][1]) {
						for (var ij = 0; ij < eleind.length; ij++) {
							if (ansset[ii][2] == eleind[ij]) {
								elechk = 0;
								for (var ik = 0; ik < elepanel.length; ik++) {
									if (elepanel[ik] == eleind[ij]) {
										elechk = 1;
									}
								}
								if (elechk == 0) {
									crseleset[ig][1][ih][1][ud] = [eleind[ij], []];
									elepanel[ue] = eleind[ij];
									ue += 1;
									ud += 1;
								}


							}

						}
					}
				}
			}
		}

		var uf;
		var prbidpanel;
		var prbidchk;
		for (var il = 0; il < crseleset.length; il++) {
			for (var im = 0; im < crseleset[il][1].length; im++) {
				for (var io = 0; io < crseleset[il][1][im][1].length; io++) {

					uf = 0;
					prbidpanel = [];
					ug = 0;
					for (var ip = 0; ip < ansset.length; ip++) {
						if (ansset[ip][0] == crseleset[il][0] && ansset[ip][1] == crseleset[il][1][im][0] && ansset[ip][2] == crseleset[il][1][im][1][io][0]) {
							prbidchk = 0;
							for (var iq = 0; iq < prbidpanel.length; iq++) {
								if (ansset[ip][3] == prbidpanel[iq]) {
									prbidchk = 1;
								}
							}
							if (prbidchk == 0) {
								crseleset[il][1][im][1][io][1][uf] = [ansset[ip][3], [0, 0, 0, 0, 0, 0, 0]];//Ratio, 맞은것, 틀린것, 합계, 코드2, 코드3, 코드4 
								uf += 1;
								prbidpanel[ug] = ansset[ip][3];
								ug += 1;
							}

						}
					}

				}
			}
		}


		var pdchk;
		var toratio;
		for (var ir = 0; ir < crseleset.length; ir++) {
			for (var is = 0; is < crseleset[ir][1].length; is++) {
				for (var it = 0; it < crseleset[ir][1][is][1].length; it++) {
					for (var iu = 0; iu < crseleset[ir][1][is][1][it][1].length; iu++) {
						for (var iv = 0; iv < ansset.length; iv++) {
							if (ansset[iv][0] == crseleset[ir][0] && ansset[iv][1] == crseleset[ir][1][is][0] && ansset[iv][2] == crseleset[ir][1][is][1][it][0] && ansset[iv][3] == crseleset[ir][1][is][1][it][1][iu][0]) {
								if (ansset[iv][4] == 1) {
									crseleset[ir][1][is][1][it][1][iu][1][1] += 1;
									crseleset[ir][1][is][1][it][1][iu][1][3] += 1;

								} else if (ansset[iv][4] == 2) {
									crseleset[ir][1][is][1][it][1][iu][1][2] += 1;
									crseleset[ir][1][is][1][it][1][iu][1][3] += 1;
									crseleset[ir][1][is][1][it][1][iu][1][4] += 1;
								} else if (ansset[iv][4] == 3) {
									crseleset[ir][1][is][1][it][1][iu][1][2] += 1;
									crseleset[ir][1][is][1][it][1][iu][1][3] += 1;
									crseleset[ir][1][is][1][it][1][iu][1][5] += 1;
								} else if (ansset[iv][4] == 4) {
									crseleset[ir][1][is][1][it][1][iu][1][2] += 1;
									crseleset[ir][1][is][1][it][1][iu][1][3] += 1;
									crseleset[ir][1][is][1][it][1][iu][1][6] += 1;
								} else {
									console.log('error');
								}
								toratio = parseFloat(crseleset[ir][1][is][1][it][1][iu][1][1] / crseleset[ir][1][is][1][it][1][iu][1][3]);
								crseleset[ir][1][is][1][it][1][iu][1][0] = toratio.toFixed(2);


							}
						}
					}
				}
			}
		}
		/*
		return crseleset;
	
		var rstset=[];
		
		for(var ic=0; ic<locind.length; ic++){
			rstset[ic]=[locind[ic]]
			for(var id=0; id<ansset.length; id++){
				if(locind[ic][0]==ansset[id][0] && locind[ic][1]==ansset[id][1] && locind[ic][2]==ansset[id][2]){
					
				}
			}
		}
		
		return locind;
		*/
		return crseleset;
	},
	EPCPrbInCrs: function (prbstat, ansset) {
		var prbidind = module.exports.CEEUniqueList(ansset, 3);
		var prbrst = [];
		var tmprb;
		for (var ia = 0; ia < prbidind.length; ia++) {
			prbrst[ia] = [prbidind[ia], []];
			for (var ib = 0; ib < prbstat.length; ib++) {
				for (var ic = 0; ic < prbstat[ib][1].length; ic++) {
					for (var id = 0; id < prbstat[ib][1][ic][1].length; id++) {
						for (var ie = 0; ie < prbstat[ib][1][ic][1][id][1].length; ie++) {
							tmprb = prbstat[ib][1][ic][1][id][1][ie][0];
							if (tmprb == prbidind[ia]) {
								prbrst[ia][1].push([prbstat[ib][0], prbstat[ib][1][ic][0], prbstat[ib][1][ic][1][id][0], prbstat[ib][1][ic][1][id][1][ie][1]])
							}
						}
					}
				}

			}
		}
		return prbrst;

	},
	RCM: function (mql, callback) {
		var io = require('socket.io-client');
		var socket = io.connect('http://elcue.net/rcm');

		socket.emit('RCM', { mql: mql })
		callback();

	},
	CCSNickname: function (rs) {
		var namelist = [];
		var ua = 0;
		for (var ia = 0; ia < rs.length; ia++) {
			if (rs[ia].crsnick == null || rs[ia].crsnick == '') {
				namelist[ua] = rs[ia].Gcrsname;
			} else {
				namelist[ua] = rs[ia].crsnick;
			}
			ua += 1;
		}
		return namelist;
	},
	CCSNotification_n(userid, callback) {

		module.exports.getinfodb('select * from Gcourseinfo where stdid="' + userid + '" and subjmode="lec"', function (rs) {
			if (rs.length != 0) {
				var crsstring = 'where (userid="' + userid + '") and (';
				var crslist = [];
				var endlist = [];
				var nendlist;
				var endinter;
				var endintermsg;

				for (var ia = 0; ia < rs.length; ia++) {
					if (ia == rs.length - 1) {
						crsstring = crsstring + 'crsname="' + rs[ia].Gcrsname + '")';

					} else {
						crsstring = crsstring + 'crsname="' + rs[ia].Gcrsname + '" or ';
					}
					crslist[ia] = rs[ia].Gcrsname;
				}

				var fdchk;
				var count;
				var ub;
				module.exports.getinfodb('select * from crshistory ' + crsstring, function (ra) {
					for (var ib = 0; ib < crslist.length; ib++) {
						fdchk = 0;
						count = ra.length - 1;
						ub = 0;
						while (fdchk != 1 && count > 0) {
							if (crslist[ib] == ra[count].crsname) {
								fdchk = 1;
								endlist[ib] = ra[count].elestage;
							}
							count--;
						}
						if (fdchk == 0) {
							endlist[ib] = 0;
						}
					}
					nendlist = module.exports.CCSParsing(endlist);
					endinter = module.exports.CCSInterpret(nendlist);
					endintermsg = module.exports.CCSPutMessage(endinter);
					var namelist = module.exports.CCSNickname(rs);
					var namelist = [];
					var ua = 0;
					for (var ia = 0; ia < rs.length; ia++) {
						if (rs[ia].crsnick == null || rs[ia].crsnick == '') {
							endintermsg[ua].push(rs[ia].Gcrsname)
							endintermsg[ua].push(rs[ia].Gcrsname)
						} else {
							endintermsg[ua].push(rs[ia].Gcrsname)
							endintermsg[ua].push(rs[ia].crsnick);
						}
						ua += 1;
					}
					callback(rs, endintermsg);


				});
			} else {
				var endintermsg = [];
				callback(rs, endintermsg);
			}
		});


	},
	CCSNotification(rs, userid, callback) {

		var crsstring = 'where (userid="' + userid + '") and (';
		var crslist = [];
		var endlist = [];
		var nendlist;
		var endinter;
		var endintermsg;

		for (var ia = 0; ia < rs.length; ia++) {
			if (ia == rs.length - 1) {
				crsstring = crsstring + 'crsname="' + rs[ia].Gcrsname + '")';

			} else {
				crsstring = crsstring + 'crsname="' + rs[ia].Gcrsname + '" or ';
			}
			crslist[ia] = rs[ia].Gcrsname;
		}

		var fdchk;
		var count;
		var ub;
		module.exports.getinfodb('select * from crshistory ' + crsstring, function (ra) {
			for (var ib = 0; ib < crslist.length; ib++) {
				fdchk = 0;
				count = ra.length - 1;
				ub = 0;
				while (fdchk != 1 && count > 0) {
					if (crslist[ib] == ra[count].crsname) {
						fdchk = 1;
						endlist[ib] = ra[count].elestage;
					}
					count--;
				}
				if (fdchk == 0) {
					endlist[ib] = 0;
				}
			}
			nendlist = module.exports.CCSParsing(endlist);
			endinter = module.exports.CCSInterpret(nendlist);
			endintermsg = module.exports.CCSPutMessage(endinter);
			callback(endintermsg);


		});


	},
	CCSPutMessage(endinter) {
		var diclist = [[0, '코스를 시작해 주세요^^'], [1, '코스를 제작 중입니다. 기다려주세요!'], [2, '코스를 훌륭히 소화했습니다.'], [3, '여러분께 맞지 않는 코스인것 같네요. 다른 코스를 추천하겠습니다.'], [4, '잠시 점검중입니다. 곧 개인적으로 연락을 드리겠습니다.'], [5, '활동중'], [6, 'unexpected Error occured please check before CCSPutMessage']]

		var endintermsg = [];

		var ib;
		var ua;
		var stop;
		ua = 0;
		var msg;
		for (var ia = 0; ia < endinter.length; ia++) {
			ib = 0;
			stop = 0;

			while (ib < 6 && stop == 0) {
				if (endinter[ia][1] == diclist[ib][0]) {
					msg = diclist[ib][1];
					stop = 1;

				}
				ib += 1;
			}
			if (stop != 0) {
				endintermsg[ua] = [endinter[ia][0], msg, endinter[ia][1]];
				ua += 1;
			}
		}
		return endintermsg;
	},
	CCSCodeChk(vlist, ele) {
		var chk = 0;
		for (var ia = 0; ia < vlist.length; ia++) {
			if (ele == vlist[ia]) {
				chk = 1;
			}
		}
		if (chk == 0) {
			return 0;
		} else {
			return 1;
		}
	},
	CCSInterpret(nendlist) {
		var ua = 0;
		var endinter = [];

		var waitingforcontents = ['elefvwt'];
		var finishing = ['elefvvv', 'elefvic'];
		var pausingforfailure = ['eleffff', 'eleffps'];
		var waitingforspecial = ['elefffa']

		var waitrs, finishrs, pausingrs, specialstoprs;

		for (var ia = 0; ia < nendlist.length; ia++) {
			if (nendlist[ia] == 0) {
				endinter[ia] = [nendlist[ia], 0];
			} else {
				waitrs = module.exports.CCSCodeChk(waitingforcontents, nendlist[ia]);

				if (waitrs != 0) {
					endinter[ia] = [nendlist[ia], 1];
				} else {
					finishrs = module.exports.CCSCodeChk(finishing, nendlist[ia])
					if (finishrs != 0) {
						endinter[ia] = [nendlist[ia], 2];
					} else {
						pausingrs = module.exports.CCSCodeChk(pausingforfailure, nendlist[ia]);
						if (pausingrs != 0) {
							endinter[ia] = [nendlist[ia], 3];
						} else {
							specialstoprs = module.exports.CCSCodeChk(waitingforspecial, nendlist[ia]);
							if (specialstoprs != 0) {
								endinter[ia] = [nendlist[ia], 4];
							} else {
								endinter[ia] = [nendlist[ia], 5];
							}

						}
					}
				}

			}
		}
		return endinter;
	},
	CCSParsing(endlist) {
		var nendlist = [];
		var tmp;
		var tmp1;
		for (var ia = 0; ia < endlist.length; ia++) {
			tmp = endlist[ia];

			if (tmp === parseInt(tmp, 10)) {//integer일 경우 .split 기능을 쓸 수 없다. 
				nendlist[ia] = tmp;
			} else {
				tmp1 = tmp.split(',');
				nendlist[ia] = tmp1[tmp1.length - 1];
			}
		}
		return nendlist;
	},
	CDSPrbParsing(prbls) {
		var prblist = '';
		for (var ia = 0; ia < prbls.length; ia++) {
			if (prbls[ia].prbid[0] == 'p' || prbls[ia].prbid[0] == 'g') {
				if (prbls.length - 1 == ia) {
					prblist = prblist + prbls[ia].prbid;
				} else {
					prblist = prblist + prbls[ia].prbid + ',';
				}
			}
		}
		return prblist;
	},
	PCSCateParsing(rs, cateids) {
		var prtinfo = '';
		var childlist = [];
		var ua = 0;

		var es;

		for (var ia = 0; ia < rs.length; ia++) {
			if (rs[ia].cateids == cateids && rs[ia].cateparents == 0) {
				prtinfo = rs[ia].cateinfo;
			} else if (rs[ia].cateparents == cateids) {
				//es=rs[ia].cateinfo.replace(/\\/g,'@#');
				//childlist[ua]=[rs[ia].cateids,rs[ia].catelist,es,rs[ia].cateparents]
				childlist[ua] = [rs[ia].cateids, rs[ia].catelist, rs[ia].cateinfo, rs[ia].cateparents]
				childlist[ua][2] = childlist[ua][2].replace(/\\\\/g, '\\')
				//미해결 노트에 적어놨다. 이유를 모르겠다. 왜 이 코드를 붙여야 하는지. 
				childlist[ua][2] = childlist[ua][2].replace(/\\/g, '@#');
				ua += 1;
			}

		}

		return [prtinfo, childlist]
	},
	PCSPrbParsing(prtlist, callback) {
		var prblist = prtlist.split(',');
		module.exports.prbsetv2(prblist, function (prbcon) {
			callback(prbcon);
		});
	},
	PCSChildParsing(rst) {
		var golist = '';
		for (var ia = 0; ia < rst.length; ia++) {
			if (ia == rst.length - 1) {
				golist = golist + rst[ia][1];
			} else {
				golist = golist + rst[ia][1] + ',';
			}
		}
		return golist;

	},
	PCSPickingFreePrbcon(callback) {
		module.exports.getinfodb('select * from prb order by prbregi desc', function (rs) {
			var prblist = module.exports.CDSPrbParsing(rs);
			var o1prblist = prblist.split(',');
			var freeprbid = [];
			var ua = 0;
			module.exports.getinfodb('select pcsconnect.prbid from pcsconnect join pcscate on pcsconnect.normid=pcscate.pcsid where pcscate.pcsopt="csindex" and pcsconnect.cateopt="case_prb"', function (pcscs) {
				for (var ia = 0; ia < o1prblist.length; ia++) {
					prbchk = 0;
					for (var ib = 0; ib < pcscs.length; ib++) {
						if (o1prblist[ia] == pcscs[ib].prbid) {
							prbchk = 1;
						}
					}
					if (prbchk == 0) {
						freeprbid[ua] = o1prblist[ia];
						ua += 1;
					}
				}
				module.exports.prbsetv2(freeprbid, function (prbcon) {
					var prbidarr = [];
					for (var ia = 0; ia < prbcon.length; ia++) {
						prbidarr[ia] = prbcon[ia][0];
					}
					var prbidstr = module.exports.UnivArrayToString(prbidarr, ',');
					callback(prbcon, prbidstr);
				});
			})
		})
	},
	PRVPermutationEquityCheck(A, B) { //A=[pcs.dfaeafe234,pcs.sdfasdfik], B=[pcs.sdfasdfasdf,pcs.sdifjaif]
		//if pec ==0  일치내용 없음, pec==1 일치내용있음

		if (!Array.isArray(A)) {
			A = A.split(',');
			B = B.split(',');
		}

		var pec;

		if (A.length != B.length) {
			pec = 0;
		} else {
			var AO = [];
			var BN = [];
			for (var ia = 0; ia < A.length; ia++) {
				AO[ia] = A[ia];
				BN[ia] = B[ia];
			}

			var pecchk;
			var ua, sa, sb;
			var uc = 0;
			while (BN.length > 0) {
				pecchk = 0;
				for (var ib = 0; ib < AO.length; ib++) {
					if (AO[ib] == BN[0]) {
						pecchk = 1;
						ua = ib;
					}
				}
				if (pecchk == 0) {
					pec = 0;
					break;
				} else {
					sa = BN.indexOf(BN[0]);
					sb = AO.indexOf(AO[ua]);
					if (sa > -1) {
						BN.splice(sa, 1);
					}
					if (sb > -1) {
						AO.splice(sb, 1);
					}
				}
				uc += 1;
				if (uc > 100) {
					break;
				}
			}
			if (pecchk != 0) {
				if (BN.length == 0) {
					pec = 1;
				} else {
					console.log('UnexpectedErrorOccurred In PRVPermutationEquityFunction Of Serverflow');
					pec = 'error';
				}
			}

		}
		return pec;


	},
	PCSPermutationEquityCheck(A, B) {
		var AO = [];
		var BN = [];

		AO[0] = A[0];
		AO[1] = [];
		BN[0] = B[0];
		BN[1] = [];
		for (var ic = 0; ic < A[1].length; ic++) {
			AO[1][ic] = [A[1][ic][0], A[1][ic][1]];
			BN[1][ic] = [B[1][ic][0], B[1][ic][1]];
		}


		function schidx(ar) {
			this.pmindexof = function (ele) {
				var chk = 0;
				var idx = -2;
				for (var ie = 0; ie < ar[1].length; ie++) {
					if (ar[1][ie][0] == ele) {
						chk = 1;
						idx = ie;
						break;
					}
				}
				if (chk == 0) {
					this.rst = -1;
				} else {
					this.rst = idx;
				}
			}
		}

		var pec;
		var pecchk;
		var sa, sb;
		var ua;
		var uc = 0;
		while (BN[1].length > 0) {
			pecchk = 0;
			for (var ib = 0; ib < AO[1].length; ib++) {
				if (AO[1][ib][0] == BN[1][0][0]) {
					pecchk = 1;
					ua = ib;
				}
			}
			if (pecchk == 0) {
				pec = 0
				break;
			} else {
				sa = new schidx(BN);
				sb = new schidx(AO);
				sa.pmindexof(BN[1][0][0])
				sb.pmindexof(AO[1][ua][0])
				var idx = sa.rst;
				if (idx > -1) {
					BN[1].splice(idx, 1);
				}
				idx = sb.rst;
				if (idx > -1) {
					AO[1].splice(idx, 1);
				}
			}
			uc += 1;
			if (uc > 100) {
				break;
			}
		}
		if (pecchk != 0) {
			if (BN[1].length == 0) {
				pec = 1;
			} else {
				console.log('UnexpectedErrorOccurred In PCSPermutationEquityFunction Of Serverflow');
				pec = 'error';
			}
		}

		return pec;//if pec ==0  일치내용 없음, pec==1 일치내용있음

	},
	PCSListPCPGroup(pcsid, callback) {
		module.exports.PCSRetrievingCrindex(pcsid, function (prbcon, prbstr) {
			module.exports.PCSPrbParsing(prbstr, function (pcps) {
				module.exports.getinfodb('select pcsid,pcsinfo from pcscate where pcsopt="pcp" order by numid desc', function (pcs) {
					module.exports.PCSRetrievingPCPs(prbstr, function (pplist, pcplist) {
						var e;
						var ia = 4;
						var ib = 4;
						var dgs = function (pplist) {//문제를 pcp 갯수에 따라  구분; distinguish dgs
							var vist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//Possible number of pcp is limisted to 10
							var distprb = [];
							for (var ia = 0; ia < vist.length; ia++) {
								distprb[ia] = [];
								for (var ib = 0; ib < pplist.length; ib++) {
									if (pplist[ib][1].length - 1 == ia) {
										distprb[ia].push(pplist[ib]);
									}
								}
							}
							return distprb;
						}
						var distprb = dgs(pplist);



						var indpcpcomblist = function (distprb) {
							//	PCSPermutationEquityCheck(A,B)
							var indpcpcomblist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
							var uc, tmplist, tmpstr, tval;
							var uc = 0;
							var pec;
							for (var ib = 0; ib < distprb.length; ib++) {
								tmpstr = '';
								tmplist = [];
								tval = '';
								for (var ic = 0; ic < distprb[ib].length; ic++) {
									if (ic == 0) {
										tmplist[0] = [distprb[ib][0], distprb[ib][0][0]];
									} else {
										for (var id = 0; id < tmplist.length; id++) {

											pec = module.exports.PCSPermutationEquityCheck(tmplist[id][0], distprb[ib][ic]);
											if (pec != 0) {
												tval = id;
												break;
											}
										}
										if (pec == 0) {
											tmplist.push([distprb[ib][ic], distprb[ib][ic][0]]);
										} else if (pec == 1) {
											tmplist[tval] = [distprb[ib][ic], tmplist[tval][1] + ',' + distprb[ib][ic][0]];
										} else {
											console.log(pec);
											console.log('error occurred!! in PCSListPCPGroup');
										}
									}
								}
								if (tmplist.length != 0) {
									indpcpcomblist[ib] = [];
									for (var id = 0; id < tmplist.length; id++) {
										indpcpcomblist[ib].push([tmplist[id][0][1], tmplist[id][1]]);
									}
								}
							}
							return indpcpcomblist;
						}
						callback(indpcpcomblist(distprb));




					});
				});
			});
			//	var e=module.exports.PCSParsingPrbBasePCP(prbcon);
		});
	},
	UnivArrayToString(arr, del) {
		var str = '';
		for (var ia = 0; ia < arr.length; ia++) {
			if (arr.length - 1 == ia) {
				str = str + arr[ia];
			} else {
				str = str + arr[ia] + del;
			}
		}
		return str;
	},
	PCSRetrievingCrindex(crindex, callback) {
		module.exports.getinfodb('select pcsconnect.prbid from pcsconnect join pcscate on pcsconnect.normid=pcscate.pcsid where (pcscate.pcsid="' + crindex + '") and (pcsconnect.cateopt="case_prb")', function (rs) {
			var prbids = [];
			for (var ia = 0; ia < rs.length; ia++) {
				prbids[ia] = rs[ia].prbid;
			}

			module.exports.prbsetv2(prbids, function (prbcon) {
				var prbidarr = [];
				for (var ia = 0; ia < prbcon.length; ia++) {
					prbidarr[ia] = prbcon[ia][0];
				}
				var prbidstr = module.exports.UnivArrayToString(prbidarr, ',');
				callback(prbcon, prbidstr);

			});

		});
	},
	PCSRegisterPrbids(prbids, crindex, opt) {//문제가 여러가지라고 가정한다. 
		var o1prbids = prbids.split(',');

		if (Array.isArray(crindex)) {
			var o1crindex = crindex;
		} else {
			var o1crindex = crindex.split(',');
		}

		//opt==1 prb_pcp
		//opt==0 case_prb
		if (opt == 0) {
			var cateopt = "case_prb";
		} else {
			var cateopt = "prb_pcp";
		}
		var mqlstr;
		if (prbids != '' && crindex != '') {
			for (var ia = 0; ia < o1prbids.length; ia++) {
				for (var ib = 0; ib < o1crindex.length; ib++) {
					mqlstr = 'insert into pcsconnect (prbid, normid,cateopt,entityopt) values ("' + o1prbids[ia] + '","' + o1crindex[ib] + '","' + cateopt + '","' + 1 + '")';
					module.exports.getinfodb(mqlstr, function () { });
				}
			}
		}

	},
	PCSRemovePrbids(prbids, normid, opt) {
		var o1prbids = prbids.split(',');
		var o1normid = normid.split(',');

		//opt==1 prb_pcp
		//opt==0 case_prb
		if (opt == 0) {
			var cateopt = "case_prb";
		} else {
			var cateopt = "prb_pcp";
		}

		if (normid != '') {
			for (var ia = 0; ia < o1prbids.length; ia++) {
				for (var ib = 0; ib < o1normid.length; ib++) {
					module.exports.getinfodb('delete from pcsconnect where prbid="' + o1prbids[ia] + '" and normid="' + o1normid[ib] + '" and cateopt="' + cateopt + '"', function () { });
				}
			}
		}
	},
	PCSRetrievingPCPs1(cps, callback) {
		var o1cps = cps.split(',');
		var pplist = [];
		var pcplist = [];
		//var golist='';
		var ua = 0;
		var ue = 0;
		var chk;
		module.exports.getinfodb('select pcsconnect.normid,pcscate.pcsinfo,pcsconnect.entityopt,pcsconnect.prbid from pcsconnect join pcscate on pcsconnect.normid=pcscate.pcsid  where pcscate.pcsopt="pcp" and pcsconnect.cateopt="prb_pcp" order by pcsconnect.prbid', function (rs) {

			for (var ia = 0; ia < o1cps.length; ia++) {
				pplist[ia] = [o1cps[ia], []];
				ua = 0;
				for (var ib = 0; ib < rs.length; ib++) {
					if (rs[ib].prbid == o1cps[ia]) {
						pplist[ia][1][ua] = [rs[ib].normid, rs[ib].pcsinfo, rs[ib].entityopt]
						ua += 1;
						chk = 0;
						for (var ic = 0; ic < pcplist.length; ic++) {
							if (rs[ib].normid == pcplist[ic][0]) {
								chk = 1;
							}
						}
						if (chk == 0) {
							pcplist[ue] = [rs[ib].normid, rs[ib].pcsinfo];
							ue += 1;
						}
					}
				}
			}

			var prbase = [];
			var uc = 0;
			for (var ic = 0; ic < pplist.length; ic++) {
				if (pplist[ic][1].length != 0) {
					prbase[uc] = pplist[ic];
					uc += 1;
				}
			}


			var idpcps = [];
			var achk;
			var ua = 0;
			var pcpbase = [];
			var ub;
			for (var ia = 0; ia < pplist.length; ia++) {
				for (var ib = 0; ib < pplist[ia][1].length; ib++) {
					achk = 0;
					for (var ic = 0; ic < idpcps.length; ic++) {
						if (idpcps[ic] == pplist[ia][1][ib][0]) {
							achk = 1;
						}
					}
					if (achk == 0) {
						idpcps[ua] = pplist[ia][1][ib][0];
						ua += 1;
					}
				}
			}
			for (var id = 0; id < idpcps.length; id++) {
				pcpbase[id] = [idpcps[id], []];
				ub = 0;
				for (var ie = 0; ie < pplist.length; ie++) {
					for (var ig = 0; ig < pplist[ie][1].length; ig++) {
						if (pplist[ie][1][ig][0] == idpcps[id]) {
							pcpbase[id][1][ub] = pplist[ie][0];
							ub += 1;
						}
					}
				}
			}

			var ccount;
			for (var ie = 0; ie < pcplist.length; ie++) {
				ccount = 0;
				for (var ig = 0; ig < rs.length; ig++) {
					if (rs[ig].normid == pcplist[ie][0] && (rs[ig].entityopt == 1 || rs[ig].entityopt == 0)) {
						ccount += 1;
					}
				}
				pcplist[ie].push(ccount);
			}

			callback(prbase, pcpbase, pcplist)

		});
	},
	PCSRetrievingPCPs(cps, callback) {
		var o1cps = cps.split(',');
		var pplist = [];
		var pcplist = [];
		var golist = '';
		var ua = 0;
		var ub = 0;
		var chk;
		module.exports.getinfodb('select pcsconnect.normid,pcscate.pcsinfo,pcsconnect.prbid from pcsconnect join pcscate on pcsconnect.normid=pcscate.pcsid  where pcscate.pcsopt="pcp" and pcsconnect.cateopt="prb_pcp" order by pcsconnect.prbid', function (rs) {
			for (var ia = 0; ia < o1cps.length; ia++) {
				pplist[ia] = [o1cps[ia], []];
				ua = 0;
				for (var ib = 0; ib < rs.length; ib++) {
					if (rs[ib].prbid == o1cps[ia]) {
						pplist[ia][1][ua] = [rs[ib].normid, rs[ib].pcsinfo]
						ua += 1;
						chk = 0;
						for (var ic = 0; ic < pcplist.length; ic++) {
							if (rs[ib].normid == pcplist[ic][0]) {
								chk = 1;
							}
						}
						if (chk == 0) {
							pcplist[ub] = [rs[ib].normid, rs[ib].pcsinfo];
							ub += 1;
						}
					}
				}
			}
			callback(pplist, pcplist)

		});
	},
	PCSParsingPrbBasePCP(pplist) {
		var prbasepcp = '';
		var delim = '@@@';
		var pdelim = '###';
		for (var ia = 0; ia < pplist.length; ia++) {
			if (pplist[ia][1].length > 0) {
				prbasepcp = prbasepcp + pplist[ia][0] + delim;
				for (var ib = 0; ib < pplist[ia][1].length; ib++) {
					if (pplist[ia][1].length - 1 == ib) {
						prbasepcp = prbasepcp + pplist[ia][1][ib][0] + pdelim;
					} else {
						prbasepcp = prbasepcp + pplist[ia][1][ib][0] + delim;
					}
				}
			}
		}
		return prbasepcp;
	},
	PCSParsingPCPBasePrb(pplist) {
		var prbasepcp = '';
		var delim = '@@@';
		var pdelim = '###';
		var idpcps = [];
		var achk;
		var ua = 0;
		var pcpbase = [];
		var ub;
		for (var ia = 0; ia < pplist.length; ia++) {
			for (var ib = 0; ib < pplist[ia][1].length; ib++) {
				achk = 0;
				for (var ic = 0; ic < idpcps.length; ic++) {
					if (idpcps[ic] == pplist[ia][1][ib][0]) {
						achk = 1;
					}
				}
				if (achk == 0) {
					idpcps[ua] = pplist[ia][1][ib][0];
					ua += 1;
				}
			}
		}
		for (var id = 0; id < idpcps.length; id++) {
			pcpbase[id] = [idpcps[id], []];
			ub = 0;
			for (var ie = 0; ie < pplist.length; ie++) {
				for (var ig = 0; ig < pplist[ie][1].length; ig++) {
					if (pplist[ie][1][ig][0] == idpcps[id]) {
						pcpbase[id][1][ub] = pplist[ie][0];
						ub += 1;
					}
				}
			}
		}
		var pcpbasestr = '';
		for (var ih = 0; ih < pcpbase.length; ih++) {
			pcpbasestr = pcpbasestr + pcpbase[ih][0] + delim;
			for (var ii = 0; ii < pcpbase[ih][1].length; ii++) {
				if (pcpbase[ih][1].length - 1 == ii) {
					pcpbasestr = pcpbasestr + pcpbase[ih][1][ii] + pdelim;
				} else {
					pcpbasestr = pcpbasestr + pcpbase[ih][1][ii] + delim;
				}
			}
		}
		return pcpbasestr;
	},
	PCSAddModeChk1(prbase, prbids) {
		var prblist = [];
		var o1prbids = prbids.split(',');

		for (var ia = 0; ia < prbase.length; ia++) {
			prblist[ia] = prbase[ia][0];
		}

		var exiList = [];
		var ua = 0;
		for (var ib = 0; ib < o1prbids.length; ib++) {
			for (var ic = 0; ic < prblist.length; ic++) {
				if (o1prbids[ib] == prblist[ic]) {
					exiList[ua] = o1prbids[ib];
					ua += 1;
				}
			}
		}

		console.log('--------');
		console.log(exiList);
		console.log(prbase);
		console.log(prbids);
		console.log('--------');


		return exiList;
	},
	PCSAddModeChk(prbase, prbids) {
		var delim = '@@@';
		var pdelim = '###';
		var o1prbase = prbase.split(pdelim);
		var prblist = [];
		var o2prbase;
		var o1prbids = prbids.split(',');
		for (var ia = 0; ia < o1prbase.length - 1; ia++) {
			o2prbase = o1prbase[ia].split(delim);
			prblist[ia] = o2prbase[0];
		}

		var exiList = [];
		var ua = 0;
		for (var ib = 0; ib < o1prbids.length; ib++) {
			for (var ic = 0; ic < prblist.length; ic++) {
				if (o1prbids[ib] == prblist[ic]) {
					exiList[ua] = o1prbids[ib];
					ua += 1;
				}
			}
		}
		return exiList;
	},
	PCSRegisteredPCPCheck1(prbase, prbid, normid) {
		var achk = 0;
		var o1normid = normid.split(',');
		var excnormid = [];
		var ub = 0;
		var bchk = 0;
		for (var ic = 0; ic < prbase.length; ic++) {
			if (prbid == prbase[ic][0]) {
				for (var ie = 0; ie < o1normid.length; ie++) {
					achk = 0;
					for (var id = 0; id < prbase[ic][1].length; id++) {
						if (o1normid[ie] == prbase[ic][1][id][0]) {
							achk = 1;
						}
					}
					if (achk == 0) {
						excnormid[ub] = o1normid[ie];
						ub += 1;
					}
				}
			}
		}
		return excnormid
	},

	PCSRegisteredPCPCheck(prbase, prbid, normid) {
		var delim = '@@@';
		var pdelim = '###';
		var o1prbase = prbase.split(pdelim);
		var achk = 0;
		var o2prbase = [];
		var tmprbase;
		var ua;
		var o1normid = normid.split(',');
		var excnormid = [];
		var ub = 0;
		var bchk = 0;
		for (var ia = 0; ia < o1prbase.length - 1; ia++) {
			tmprbase = o1prbase[ia].split(delim);
			o2prbase[ia] = [tmprbase[0], []]
			ua = 0;
			for (var ib = 1; ib < tmprbase.length; ib++) {
				o2prbase[ia][1][ua] = tmprbase[ib];
				ua += 1;
			}
		}
		for (var ic = 0; ic < o2prbase.length; ic++) {
			if (prbid == o2prbase[ic][0]) {
				for (var ie = 0; ie < o1normid.length; ie++) {
					achk = 0;
					for (var id = 0; id < o2prbase[ic][1].length; id++) {
						if (o1normid[ie] == o2prbase[ic][1][id]) {
							achk = 1;
						}
					}
					if (achk == 0) {
						excnormid[ub] = o1normid[ie];
						ub += 1;
					}
				}
			}
		}
		return excnormid
	},
	PCSCheckMatchingNormid(prbase, prbid, normid) {
		var achk = 0;
		for (var ia = 0; ia < prbase.length; ia++) {
			if (prbase[ia][0] == prbid) {
				achk = 1;
				break;
			}
		}
		var bchk = 0;
		if (achk == 1) {
			for (var ib = 0; ib < prbase[ia][1].length; ib++) {
				if (prbase[ia][1][ib][0] == normid) {
					bchk = 1;
					break;
				}
			}
			return bchk;
		} else {
			console.log('error occurred from PCSCheckMatchingNormid. the normid does not exist in the prbase');
			return bchk;
		}
	},
	PCSNormidChk(normid) {
		var achk;
		if (normid == '') {
			achk = 0;
		} else {
			var o1normid = normid.split(',');
			achk = o1normid.length;
		}
		return achk;
	},
	YQWAreq(name, contact, exp) {
		var rst;
		var rstmsg;
		if (name == null || typeof name == 'undefined' || name.length > 20 || name == '') {
			rst = 0;
			rstmsg = '제대로 등록이 안되었네요... 이름을 다시 확인해주세요.';
		} else if (contact.length > 20 || contact == null || typeof contact == 'undefined' || contact == '') {
			rst = 1;
			rstmsg = '제대로 등록이 안되었네요... 연락처를 다시 확인해 주세요.';
		} else if (exp == null || typeof exp == 'undefined' || exp == '') {
			rst = 2;
			rstmsg = '제대로 등록이 안되었네요.. 내용을 다시 확인해주세요';
		} else {
			var str = { username: name, contact: contact, explanation: exp, createtime: module.exports.nodetime() };
			module.exports.getinfodb_par('insert into yqwareq SET ?', str, function (err, result) { });
			rst = 3;
			rstmsg = '성공적으로 등록되었습니다.';
		}
		return [rst, rstmsg];
	},
	RESU(userid, crs, opt, callback) {//Review Evaluation of Specific User
		var cecr = [];//Course Elment Connected Review
		var ua = 0;
		var pcr = []; // Problem Connected Review
		var ub = 0;
		var mysqlstr;
		if (opt == 0) {
			mysqlstr = 'select connect_prv.vidid,connect_prv.crsname, connect_prv.element, connect_prv.prbid, reviewcont.revcont,reviewcont.id as rv, connect_prv.id as cn from reviewcont join connect_prv on reviewcont.id=connect_prv.reviewid where (prbid is not null and userid="' + userid + '" and crsname="' + crs + '")'
		} else if (opt == 1) {
			mysqlstr = 'select connect_prv.vidid,connect_prv.crsname, connect_prv.element, connect_prv.prbid, reviewcont.revcont,reviewcont.id as rv, connect_prv.id as cn from reviewcont join connect_prv on reviewcont.id=connect_prv.reviewid where (prbid is not null and userid="' + userid + '")'
		}
		module.exports.getinfodb(mysqlstr, function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].crsname != null && rs[ia].element != null && rs[ia].vidid == null) {
					cecr[ua] = [rs[ia].rv, rs[ia].cn, rs[ia].crsname, rs[ia].element, rs[ia].prbid, rs[ia].revcont];
					ua += 1;
				}
				if (rs[ia].crsname == null && rs[ia].element == null && rs[ia].vidid == null) {
					pcr[ub] = [rs[ia].rv, rs[ia].cn, rs[ia].prbid, rs[ia].revcont];
					ub += 1;
				}
			}
			callback(cecr, pcr);

		});
	},
	QOCCsindex(callback) {
		var cslist = [];
		var ua = 0;
		module.exports.getinfodb('select pcsid,pcsinfo from pcscate where pcsopt="csindex"', function (pcs) {
			for (var ia = 0; ia < pcs.length; ia++) {
				cslist[ua] = [pcs[ia].pcsid, pcs[ia].pcsinfo];
				ua += 1;
			}
			callback(cslist);
		});
	},

	/*
			var revlist=[];
			var ua=0;
			module.exports.getinfodb('select reviewcont.revcont,connect_prv.id as conid,reviewcont.id as revid from connect_prv join reviewcont on connect_prv.reviewid=reviewcont.id where connect_prv.vidid="'+vidid+'"',function(rs){
				for(var ia=0; ia<rs.length; ia++){
					revlist[ia]=[rs[ia].conid,rs[ia].revid,rs[ia].revcont];
				}
				callback(revlist);
			});
	},
	*/
	QOCCallingVidList(callback) {
		var vidlist = [];
		module.exports.getinfodb('select videocont.vidinfo,videocont.id,reviewcont.revcont,videocont.vidaddr,reviewcont.userid,connect_prv.id as conid, reviewcont.id as revid from videocont left join connect_prv on connect_prv.vidid=videocont.id left join reviewcont on reviewcont.id=connect_prv.reviewid', function (rs) {
			var vidindlist = [];
			var achk;
			for (var ia = 0; ia < rs.length; ia++) {
				achk = 0;
				for (var ib = 0; ib < vidindlist.length; ib++) {
					if (vidindlist[ib][0] == rs[ia].id) {
						achk = 1;
					}
				}
				if (achk == 0) {
					vidindlist.push([rs[ia].id, rs[ia].vidaddr]);
				}
			}
			var revlist;
			for (var ic = 0; ic < vidindlist.length; ic++) {
				revlist = [];
				for (var id = 0; id < rs.length; id++) {
					if (vidindlist[ic][0] == rs[id].id && rs[id].revcont != null) {
						revlist.push([rs[id].conid, rs[id].revid, rs[id].revcont])
					}
				}
				for (var ie = 0; ie < rs.length; ie++) {
					//if(vidindlist[ic][0]==rs[ie].id && rs[ie].id!='mov.aaaaaaaaaa'){ //171204 mov.aaaaaaa가 default video로 할당이 되었는데 굳이 막을 필요는 없어 보여서 허락해본다.
					if (vidindlist[ic][0] == rs[ie].id) {
						vidlist.push([rs[ie].id, rs[ie].vidaddr, rs[ie].vidinfo, revlist]);
						break;
					}
				}
			}

			callback(vidlist);


		});
	},
	QOCCallingReviewOfProblem(prbid, callback) {
		var reviewlist = [];
		var ua = 0;
		module.exports.getinfodb('select revcont,prbid from reviewcont join connect_prv on reviewcont.id=connect_prv.reviewid  where prbid is not null', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].prbid == prbid) {
					reviewlist[ua] = rs[ia].revcont;
					ua += 1;
				}
			}
			callback(reviewlist);
		});

	},
	CallingPrblistOfVidid(vidid, callback) {
		var vprblist = [];
		var ua = 0;
		var achk;
		var bchk;
		module.exports.getinfodb('select prbid from connect_prv where (vidid="' + vidid + '") and (prbid is not null)', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				achk = 0;
				for (var ib = 0; ib < vprblist.length; ib++) {
					if (vprblist[ib] == rs[ia].prbid) {
						achk = 1;
					}
				}
				if (achk == 0) {
					vprblist[ua] = rs[ia].prbid;
					ua += 1;
				}
			}
			module.exports.getinfodb('select eleprbs from defele where elevideo="' + vidid + '"', function (ra) {
				for (var ic = 0; ic < ra.length; ic++) {
					var o1prbid = ra[ic].eleprbs.split(',');
					for (var ie = 0; ie < o1prbid.length; ie++) {
						bchk = 0;
						for (var id = 0; id < vprblist.length; id++) {
							if (vprblist[id] == o1prbid[ie]) {
								bchk = 1;
							}
						}
						if (bchk == 0) {
							if (o1prbid[ie] != '') {
								vprblist[ua] = o1prbid[ie];
								ua += 1;
							}
						}
					}
				}
				callback(vprblist);

			});

		});
	},
	RGVCallingReviews(vidid, callback) {
		var revlist = [];
		var ua = 0;
		module.exports.getinfodb('select reviewcont.revcont,connect_prv.id as conid,reviewcont.id as revid from connect_prv join reviewcont on connect_prv.reviewid=reviewcont.id where connect_prv.vidid="' + vidid + '"', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				revlist[ia] = [rs[ia].conid, rs[ia].revid, rs[ia].revcont];
			}
			callback(revlist);
		});
	},
	ROVCallingReviews(vadd, userid, callback) {
		var revlist = [];
		var ua = 0;
		module.exports.ROVGetSqlOfVideo(vadd, function (sql, vidlist) {
			module.exports.getinfodb('select reviewcont.revcont,connect_prv.id as conid,reviewcont.id as revid from connect_prv join reviewcont on connect_prv.reviewid=reviewcont.id where ' + sql + ' and reviewcont.userid="' + userid + '"', function (rs) {
				for (var ia = 0; ia < rs.length; ia++) {
					revlist[ia] = [rs[ia].conid, rs[ia].revid, rs[ia].revcont];
				}
				callback(revlist);

			});
		});
	},
	ROVGetSqlOfVideo(vadd, callback) {
		var sql = '';
		var vidlist = [];
		module.exports.getinfodb('select id from videocont where vidaddr="' + vadd + '"', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				if (ia == rs.length - 1) {
					sql = sql + 'connect_prv.vidid="' + rs[ia].id + '"'
				} else {
					sql = sql + 'connect_prv.vidid="' + rs[ia].id + '" or '
				}
				vidlist[ia] = rs[ia].id;
			}
			callback(sql, vidlist)
		});
	},
	ROVSendReview(userid, msg, vadd, callback) {
		console.log(userid, msg, vadd);
		module.exports.ROVGetSqlOfVideo(vadd, function (sql, vidlist) {

			module.exports.RegisterReview(userid, msg, function (revid) {


				module.exports.ROVConnectReview(revid, vidlist[0], function (conid) {
					callback(conid, revid);
				});
			});

		});
	},
	ROVConnectReview(revid, vidid, callback) {
		module.exports.GetObjId('con', 'connect_prv', 10, function (id) {
			module.exports.getinfodb('insert into connect_prv (id, vidid, reviewid,date) values("' + id + '","' + vidid + '","' + revid + '","' + module.exports.nodetime() + '")', function () {
				callback(id);
			});
		});
	},
	RGVRemoveReview(conid, revid) {
		module.exports.getinfodb('delete from connect_prv where id="' + conid + '"', function () { });
		module.exports.getinfodb('delete from reviewcont where id="' + conid + '"', function () { });
	},
	PRVCallingVideo(pcsstr, callback) {

		var pec;
		var selectedvideolist = [];
		var videolist = [];
		var achk;
		var exclusivelist = [];
		module.exports.getinfodb('select pcp,vidid,vidaddr,videocont.id as vid from connect_prv right join videocont on videocont.id=connect_prv.vidid where (prbid is null) and (reviewid is null) and (crsname is null) and (element is null) and (thumbid is null)', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].pcp != null) {
					pec = module.exports.PRVPermutationEquityCheck(pcsstr, rs[ia].pcp);
					if (pec == 0) {//일치내용 없음
					} else {//일치내용있음
						selectedvideolist.push([rs[ia].vidid, rs[ia].vidaddr])
					}

				}
				achk = 0;
				for (var ib = 0; ib < videolist.length; ib++) {
					if (videolist[ib][0] == rs[ia].vid) {
						achk = 1;
					}
				}
				if (achk == 0) {
					videolist.push([rs[ia].vid, rs[ia].vidaddr]);
				}


			}

			callback(videolist, selectedvideolist);
		});



	},
	PRVCountPCPVideo(pcpg, callback) {
		var str = '';
		var pec;
		var svl = [];//selectedVideoList
		for (var ig = 0; ig < pcpg.length; ig++) {
			if (Array.isArray(pcpg[ig])) {
				svl[ig] = [];
			} else {
				svl[ig] = 0;
			}
		}
		module.exports.getinfodb('select pcp,vidid,vidaddr,videocont.id as vid from connect_prv right join videocont on videocont.id=connect_prv.vidid where (prbid is null) and (reviewid is null) and (crsname is null) and (element is null) and (thumbid is null)', function (rs) {
			for (var ia = 0; ia < pcpg.length; ia++) {
				if (Array.isArray(pcpg[ia])) {
					for (var ib = 0; ib < pcpg[ia].length; ib++) {
						svl[ia][ib] = [];
						str = '';
						for (var ic = 0; ic < pcpg[ia][ib][0].length; ic++) {
							if (pcpg[ia][ib][0].length - 1 == ic) {
								str = str + pcpg[ia][ib][0][ic][0];
							} else {
								str = str + pcpg[ia][ib][0][ic][0] + ',';
							}
						}
						for (id = 0; id < rs.length; id++) {
							if (rs[id].pcp != null) {
								pec = module.exports.PRVPermutationEquityCheck(str, rs[id].pcp);
								if (pec != 0) {
									svl[ia][ib].push([rs[id].vidid, rs[id].vidaddr]);
								}

							}
						}



					}
				}
			}
			callback(svl);
		});
	},
	PRVPCPCount(pcpg, callback) {
		var indlist = [];
		var achk;
		var ua = 0;
		var branchnum = 0;
		module.exports.getinfodb('select pcp,vidid,vidaddr,videocont.id as vid from connect_prv right join videocont on videocont.id=connect_prv.vidid where (prbid is null) and (reviewid is null) and (crsname is null) and (element is null) and (thumbid is null)', function (rs) {
			for (var ia = 0; ia < pcpg.length; ia++) {
				for (var ib = 0; ib < pcpg[ia].length; ib++) {
					for (var id = 0; id < pcpg[ia][ib][0].length; id++) {
						achk = 0;
						for (var ic = 0; ic < indlist.length; ic++) {
							if (indlist[ic][0] == pcpg[ia][ib][0][id][0]) {
								achk = 1;
							}
						}
						if (achk == 0) {
							indlist[ua] = pcpg[ia][ib][0][id];
							ua += 1;
						}
					}
					branchnum += 1;
				}
			}

			var count;
			for (var ie = 0; ie < indlist.length; ie++) {
				count = 0;
				for (var ig = 0; ig < pcpg.length; ig++) {
					for (var ih = 0; ih < pcpg[ig].length; ih++) {
						for (var ii = 0; ii < pcpg[ig][ih][0].length; ii++) {
							if (indlist[ie][0] == pcpg[ig][ih][0][ii][0]) {
								count += 1;
							}
						}
					}
				}
				indlist[ie].push(count);
				indlist[ie].push((parseFloat(count / branchnum) * 100).toFixed(1));
			}

			var swap = function (array, i, j) {
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}

			var sortind = function (array) {
				for (var i = 0; i < array.length; i++) {
					for (var j = 1; j < array.length; j++) {
						if (array[j - 1][2] < array[j][2]) {
							swap(array, j - 1, j);
						}
					}
				}
				return array;
			}

			var nindlist = sortind(indlist);
			var count;
			var pcount;
			var pset;
			var o1pcp;
			var achk;
			for (var ie = 0; ie < nindlist.length; ie++) {
				count = 0;
				pcount = 0;
				pset = [];
				o1pcp;
				for (id = 0; id < rs.length; id++) {
					if (rs[id].pcp != null) {//get count of exactly matched video and pcp
						pec = module.exports.PRVPermutationEquityCheck(nindlist[ie][0], rs[id].pcp);
						if (pec != 0) {
							count += 1;
						}

					}
					if (rs[id].pcp != null) {/// pcount of partially matched video and pcp
						o1pcp = rs[id].pcp.split(',');
						for (var ig = 0; ig < o1pcp.length; ig++) {
							if (o1pcp[ig] == nindlist[ie][0]) {
								achk = 0;
								for (var ih = 0; ih < pset.length; ih++) {//PRV duplication problem**
									if (pset[ih][1] == rs[id].vidid) {
										achk = 1;
									}

								}
								if (achk == 0) {
									pset.push([rs[id].pcp, rs[id].vidid, rs[id].vidaddr])
								}
							}
						}
					}

				}
				nindlist[ie].push(count);
				nindlist[ie].push(pset.length);
				nindlist[ie].push(pset);

			}
			callback(nindlist);
		});
	},
	PLSEducationSeries(pcsid, opt, callback) {
		callback();
		module.exports.getinfodb('update pcscate set cslevel="' + opt + '" where pcsid="' + pcsid + '"', function (rs) {
		});
	},
	PLScslevel(callback) {
		module.exports.getinfodb('select pcsid,pcsinfo,cslevel from pcscate where pcsopt="csindex" order by cslevel asc ', function (rs) {
			var plslevel = [];
			var ua = 0;
			var ub = 0;
			var unass = [];
			var ass = [];
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].cslevel == 0) {
					unass.push([rs[ia].pcsid, rs[ia].pcsinfo, rs[ia].cslevel]);
				} else {
					ass.push([rs[ia].pcsid, rs[ia].pcsinfo, rs[ia].cslevel]);
				}
			}
			plslevel = [unass, ass];
			callback(plslevel);
		});
	},/*
PLSRemove(plsid,recvnum){
	var newlv;
	module.exports.getinfodb('delete from  pcscate where cslevel="'+recvnum+'" and  pcsid="'+pcsid+'" and pcsopt="csindex"',function(ra){});
	module.exports.getinfodb('select pcsid,cslevel from pcscate where pcsopt="csindex"',function(rs){
		for(var ia=0; ia<rs.length; ia++){
			if(rs[ia].cslevel>recvnum){
				newlv=rs[ia].cslevel-1;
				module.exports.getinfodb('update pcscate set cslevel="'+newlv+'" where (NOT (pcsid="'+pcsid+'")) and (pcsopt="csindex" and (pcsid="'+rs[ia].pcsid+'"))',function(ra){});
				
			}
		}
	});
},*/
	EERadd(pcsid) {
		module.exports.getinfodb('update EERCONSLK set slkorder="' + 1 + '" where inhid="' + pcsid + '"', function (rs) { });
	},
	PLSadd(pcsid) {
		module.exports.getinfodb('update pcscate set cslevel="' + 1 + '" where pcsid="' + pcsid + '" and pcsopt="csindex"', function (rs) { });
	},
	EERUpdate(pcsid, recvnum) {
		var newlv;
		module.exports.getinfodb('update EERCONSLK set slkorder="' + recvnum + '" where inhid="' + pcsid + '"', function (ra) {
			module.exports.getinfodb('select inhid,slkorder from EERCONSLK', function (rs) {
				for (var ia = 0; ia < rs.length; ia++) {
					if (rs[ia].slkorder >= recvnum) {
						newlv = rs[ia].slkorder + 1;
						module.exports.getinfodb('update EERCONSLK set slkorder="' + newlv + '" where (NOT ( inhid ="' + pcsid + '")) and (inhid="' + rs[ia].inhid + '")', function (ra) { });

					}
				}
			});
		});
	},

	PLSUpdate(pcsid, recvnum) {
		var newlv;
		console.log(recvnum);
		module.exports.getinfodb('update pcscate set cslevel="' + recvnum + '" where pcsid="' + pcsid + '" and pcsopt="csindex"', function (ra) {
			module.exports.getinfodb('select pcsid,cslevel from pcscate where pcsopt="csindex"', function (rs) {
				for (var ia = 0; ia < rs.length; ia++) {
					if (rs[ia].cslevel >= recvnum) {
						newlv = rs[ia].cslevel + 1;
						module.exports.getinfodb('update pcscate set cslevel="' + newlv + '" where (NOT (pcsid="' + pcsid + '")) and (pcsopt="csindex" and (pcsid="' + rs[ia].pcsid + '"))', function (ra) { });

					}
				}
			});
		});
	},
	PLSSameUpdate(pcsid, recvnum) {
		module.exports.getinfodb('update pcscate set cslevel="' + recvnum + '" where pcsid="' + pcsid + '" and pcsopt="csindex"', function (ra) { });
	},
	PLSCaseList(callback) {
		var caselist = [];
		var pcplist = [];
		module.exports.getinfodb('select pcsid,pcsinfo,pcsopt,cslevel from pcscate order by cslevel asc', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].pcsopt == 'csindex') {
					caselist.push([rs[ia].pcsid, rs[ia].pcsinfo, rs[ia].cslevel]);
				} else if (rs[ia].pcsopt == 'pcp') {
					pcplist.push([rs[ia].pcsid, rs[ia].pcsinfo, rs[ia].cslevel]);
				}
			}
			callback(caselist, pcplist);
		});
	},
	PLSDisplayFreePCP(crpcp, pcplist, caselist) {
		var vpcplist = [];
		var achk;
		for (var ie = 0; ie < pcplist.length; ie++) {
			achk = 0;
			for (var ic = 0; ic < crpcp.length; ic++) {
				for (var id = 0; id < crpcp[ic][1].length; id++) {
					if (crpcp[ic][1][id][0] == pcplist[ie][0]) {
						achk = 1;
						break;
					}
				}
				if (achk == 1) {
					break;
				}
			}
			if (achk == 0) {
				vpcplist.push(pcplist[ie])
			}
		}

		return vpcplist;
	},
	PLScrPCPDisplay(caselist, callback) {
		var crPCP = []; // crPCP list
		var ua;
		module.exports.getinfodb('select ca.pcsid as caseid, ca.pcsinfo as caseinfo, pc.pcsid as pcpid,pc.cslevel, pc.pcsinfo as pcpinfo from pcsconnect join pcscate as ca on pcsconnect.normid=ca.pcsid join pcscate as pc on pcsconnect.childitem=pc.pcsid where pcsconnect.cateopt="case_crpcp"', function (rs) {

			for (var ib = 0; ib < caselist.length; ib++) {
				crPCP[ib] = [caselist[ib], []];
				ua = 0;
				for (var ic = 0; ic < rs.length; ic++) {
					if (rs[ic].caseid == caselist[ib][0]) {
						crPCP[ib][1].push([rs[ic].pcpid, rs[ic].pcpinfo, rs[ic].cslevel]);
					}
				}

			}
			callback(crPCP);
		});
	},


	EEROmit(caseid, cslevel) {
		module.exports.getinfodb('select * from EERCONSLK', function (rs) {
			var ncslevel;
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].inhid == caseid) {
					module.exports.getinfodb('update EERCONSLK set slkorder=0 where inhid="' + caseid + '"', function () { });
				} else {
					var count = 0;
					for (var ib = 0; ib < rs.length; ib++) {
						if (rs[ib].slkorder == cslevel) {
							count += 1;
						}
					}
					if (count > 1) {
					} else {
						if (rs[ia].slkorder > cslevel) {
							ncslevel = rs[ia].slkorder - 1;
							module.exports.getinfodb('update EERCONSLK set slkorder=' + ncslevel + ' where inhid="' + rs[ia].inhid + '"', function () { });
						}
					}
				}
			}
		});
	},

	PLSOmit(caseid, cslevel) {
		module.exports.getinfodb('select * from pcscate where pcsopt="csindex"', function (rs) {
			var ncslevel;
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].pcsid == caseid) {
					module.exports.getinfodb('update pcscate set cslevel=0 where pcsid="' + caseid + '"', function () { });
				} else {
					var count = 0;
					for (var ib = 0; ib < rs.length; ib++) {
						if (rs[ib].cslevel == cslevel) {
							count += 1;
						}
					}
					if (count > 1) {
					} else {
						if (rs[ia].cslevel > cslevel) {
							ncslevel = rs[ia].cslevel - 1;
							module.exports.getinfodb('update pcscate set cslevel=' + ncslevel + ' where pcsid="' + rs[ia].pcsid + '"', function () { });
						}
					}
				}
			}
		});
	},
	CPMcslevelbasedCase(callback) {
		module.exports.getinfodb('select * from pcscate where pcsopt="csindex" order by cslevel asc', function (rs) {
			var caselist = [];
			for (var ia = 0; ia < rs.length; ia++) {
				caselist.push([rs[ia].pcsid, rs[ia].pcsinfo, rs[ia].cslevel, []]);
			}

			module.exports.getinfodb('select pt.prbid as prbid, pc.pcsid as pcsid from pcsconnect as pt join pcscate as pc on pt.normid=pc.pcsid where pt.cateopt="prb_pcp"', function (ra) {
				module.exports.getinfodb('select pcsconnect.childitem, pcscate.cslevel from pcscate join pcsconnect on pcsconnect.normid=pcscate.pcsid where pcsopt="csindex" and cateopt="case_crpcp"', function (rc) {

					var prbtlist = [];
					var achk;
					for (var ib = 0; ib < ra.length; ib++) {
						achk = 0;
						for (var ic = 0; ic < prbtlist.length; ic++) {
							if (prbtlist[ic] == ra[ib].prbid) {
								achk = 1;
								break;
							}
						}
						if (achk == 0) {
							prbtlist.push(ra[ib].prbid);
						}
					}


					var pcps;
					var count;
					for (var ie = 0; ie < prbtlist.length; ie++) {
						pcps = [];
						for (var id = 0; id < ra.length; id++) {
							if (ra[id].prbid == prbtlist[ie]) {
								pcps.push(ra[id].pcsid);
							}
						}

						count = 0;
						for (var ih = 0; ih < pcps.length; ih++) {
							for (var ii = 0; ii < rc.length; ii++) {
								if (pcps[ih] == rc[ii].childitem) {
									if (rc[ii].cslevel > count) {
										count = rc[ii].cslevel;
									}
								}

							}
						}
						for (var ig = 0; ig < caselist.length; ig++) {
							if (caselist[ig][2] == count) {
								caselist[ig][3].push([prbtlist[ie], pcps]);
								break;
							}
						}

					}


					callback(caselist, prbtlist);
				});
			})

		});
	},
	CPMcrpcpbasedCombination(caseid, csl, callback) {
		module.exports.getinfodb('select pt.prbid as prbid, pc.pcsid as pcsid,pc.pcsinfo as pcsinfo from pcsconnect as pt join pcscate as pc on pt.normid=pc.pcsid where pt.cateopt="prb_pcp"', function (ra) {
			//		module.exports.getinfodb('select pcsconnect.childitem, pcscate.cslevel from pcscate join pcsconnect on pcsconnect.normid=pcscate.pcsid where cateopt="case_crpcp" and pcscate.pcsid="'+caseid+'"',function(rc){

			module.exports.getinfodb('select pn.prbid, pt.childitem, pcs.pcsinfo, pcs.cslevel from pcsconnect as pt join pcsconnect as pn on pt.childitem=pn.normid join pcscate as pcs on pt.childitem=pcs.pcsid where pt.normid="' + caseid + '" and pt.cateopt="case_crpcp"', function (cr) {
				module.exports.getinfodb('select pcsconnect.childitem, pcscate.cslevel from pcscate join pcsconnect on pcsconnect.normid=pcscate.pcsid where pcsopt="csindex" and cateopt="case_crpcp"', function (rc) {
					var caselist = [];//caseid form [prbid,[crpcp],[nonecrpcp],[pcps]];
					var prblist = [];
					var bchk;
					for (var ia = 0; ia < cr.length; ia++) {
						bchk = 0;
						for (var ib = 0; ib < prblist.length; ib++) {
							if (prblist[ib] == cr[ia].prbid) {
								bchk = 1;
								break;
							}
						}
						if (bchk == 0) {
							prblist.push(cr[ia].prbid);
						}
					}

					var crpcp;
					var pcps;
					var nonepcp;
					var ja = 0;
					for (var ic = 0; ic < prblist.length; ic++) {
						caselist[ja] = [prblist[ic], [], [], []]

						//crpcp
						crpcp = [];
						for (var id = 0; id < cr.length; id++) {
							if (cr[id].prbid == prblist[ic]) {
								caselist[ja][1].push([cr[id].childitem, cr[id].pcsinfo])
								crpcp.push([cr[id].childitem, cr[id].pcsinfo]);
							}
						}



						//pcps
						pcps = [];
						var vpcps = [];
						for (var ie = 0; ie < ra.length; ie++) {
							if (ra[ie].prbid == prblist[ic]) {
								pcps.push([ra[ie].pcsid, ra[ie].pcsinfo]);
								vpcps.push([ra[ie].pcsid, ra[ie].pcsinfo]);

							}
						}
						caselist[ja][3] = pcps;




						count = 0;
						for (var ih = 0; ih < vpcps.length; ih++) {
							for (var ii = 0; ii < rc.length; ii++) {
								if (vpcps[ih][0] == rc[ii].childitem) {
									if (rc[ii].cslevel > count) {
										count = rc[ii].cslevel;
									}
								}

							}
						}

						//nonecrpcp
						nonepcp = [];
						for (var ig = 0; ig < crpcp.length; ig++) {
							for (var ih = 0; ih < vpcps.length; ih++) {
								if (crpcp[ig][0] == vpcps[ih][0]) {
									vpcps.splice(ih, 1);
									break;
								}
							}
						}
						caselist[ja][2] = vpcps;
						if (csl >= count) {
							ja += 1;
						} else {
							if (ic == prblist.length - 1) {
								caselist.splice(ja, 1);
							}
						}
					}

					var mode = 1;

					var crpcplen = [];
					var cchk;
					for (var ii = 0; ii < caselist.length; ii++) {
						cchk = 0;
						for (var ij = 0; ij < crpcplen.length; ij++) {
							if (crpcplen[ij] == caselist[ii][mode].length) {
								cchk = 1;
								break;
							}
						}
						if (cchk == 0) {
							crpcplen.push(caselist[ii][mode].length);
						}
					}

					var crpcp = [];
					for (var il = 0; il < crpcplen.length; il++) {
						crpcp[il] = [crpcplen[il], []]
						for (var im = 0; im < caselist.length; im++) {
							if (caselist[im][mode].length == crpcplen[il]) {
								crpcp[il][1].push(caselist[im])
							}
						}
					}

					//sort하는 법. 1. independent item을 구한다. 2. independent item을 중심으로 대상을 inspection한다. 
					//ind
					//inspection

					var indcrpcp;
					var crpcpstr;
					var indcrpcpstr;
					var dchk;
					var pec;
					var ua = 0;

					//indecrpcp 구하기.
					indcrpcp = [];
					for (var ip = 0; ip < crpcp.length; ip++) {

						for (var iq = 0; iq < crpcp[ip][1].length; iq++) {
							crpcpstr = [];
							pec = 0;
							for (var ir = 0; ir < crpcp[ip][1][iq][1].length; ir++) {
								crpcpstr.push(crpcp[ip][1][iq][1][ir][0]);
							}

							for (var is = 0; is < indcrpcp.length; is++) {
								indcrpcpstr = [];
								for (var it = 0; it < indcrpcp[is].length; it++) {
									indcrpcpstr.push(indcrpcp[is][it][0]);
								}
								pec = module.exports.PRVPermutationEquityCheck(crpcpstr, indcrpcpstr);
								if (pec == 1) {
									break;
								}


							}
							if (pec == 0) {
								indcrpcp.push(crpcp[ip][1][iq][1]);
							}
						}

					}

					var indcom = [];
					var tmpind = [];
					var tpec;
					var tcrpcpstr;
					var tindcrpcpstr;
					var tmpindstr;
					for (var ja = 0; ja < indcrpcp.length; ja++) {
						indcom[ja] = [indcrpcp[ja], []];
						tmpind = [];
						for (var jb = 0; jb < crpcp.length; jb++) {
							for (var jc = 0; jc < crpcp[jb][1].length; jc++) {


								crpcpstr = [];
								pec = 0;
								for (var ir = 0; ir < crpcp[jb][1][jc][1].length; ir++) {
									crpcpstr.push(crpcp[jb][1][jc][1][ir][0]);
								}

								indcrpcpstr = [];
								for (var it = 0; it < indcrpcp[ja].length; it++) {
									indcrpcpstr.push(indcrpcp[ja][it][0]);
								}

								pec = module.exports.PRVPermutationEquityCheck(crpcpstr, indcrpcpstr);
								if (pec == 1) {
									//	tmpind=[];
									tpec = 0;
									for (var jd = 0; jd < tmpind.length; jd++) {
										tcrpcpstr = [];
										for (var ir = 0; ir < crpcp[jb][1][jc][3].length; ir++) {
											tcrpcpstr.push(crpcp[jb][1][jc][3][ir][0]);
										}

										tmpindstr = [];
										for (var it = 0; it < tmpind[jd].length; it++) {
											tmpindstr.push(tmpind[jd][it][0]);
										}

										tpec = module.exports.PRVPermutationEquityCheck(tcrpcpstr, tmpindstr);
										if (tpec == 1) {
											break;
										}
									}
									if (tpec == 0) {
										tmpind.push(crpcp[jb][1][jc][3]);
									}
									//A=[pcs.dfaeafe234,pcs.sdfasdfik], B=[pcs.sdfasdfasdf,pcs.sdifjaif]
									//if pec ==0  일치내용 없음, pec==1 일치내용있음
								}


							}
						}
						indcom[ja][1] = tmpind;
					}


					var bcrpcp = [];
					var pstr;
					var kpec;
					var kcrpcpstr;
					var kindcrpcpstr;
					var ub;
					for (var iv = 0; iv < indcom.length; iv++) {

						bcrpcp[ua] = [indcom[iv][0], []];
						for (var jf = 0; jf < indcom[iv][1].length; jf++) {
							bcrpcp[ua][1][jf] = [indcom[iv][1][jf], []]

							for (var ip = 0; ip < crpcp.length; ip++) {
								for (var iu = 0; iu < crpcp[ip][1].length; iu++) {
									crpcpstr = [];
									pec = 0;
									kpec = 0;
									for (var ir = 0; ir < crpcp[ip][1][iu][1].length; ir++) {
										crpcpstr.push(crpcp[ip][1][iu][1][ir][0]);
									}

									indcrpcpstr = [];
									for (var it = 0; it < indcom[iv][0].length; it++) {
										indcrpcpstr.push(indcom[iv][0][it][0]);
									}

									pec = module.exports.PRVPermutationEquityCheck(crpcpstr, indcrpcpstr);
									if (pec == 1) {

										kcrpcpstr = [];
										kpec = 0;
										for (var jg = 0; jg < crpcp[ip][1][iu][3].length; jg++) {
											kcrpcpstr.push(crpcp[ip][1][iu][3][jg][0]);
										}

										kindcrpcpstr = [];
										for (var it = 0; it < indcom[iv][1][jf].length; it++) {
											kindcrpcpstr.push(indcom[iv][1][jf][it][0]);
										}

										kpec = module.exports.PRVPermutationEquityCheck(kcrpcpstr, kindcrpcpstr);
										if (kpec == 1) {
											bcrpcp[ua][1][jf][1].push(crpcp[ip][1][iu][0])
										}
									}
								}
							}
						}


						ua += 1;
					}
					for (var ix = 0; ix < bcrpcp.length; ix++) {
						for (var iz = 0; iz < bcrpcp[ix][1].length; iz++) {
							pstr = '';
							for (var i1 = 0; i1 < bcrpcp[ix][1][iz][1].length; i1++) {
								if (i1 == bcrpcp[ix][1][iz][1].length - 1) {
									pstr = pstr + bcrpcp[ix][1][iz][1][i1];
								} else {
									pstr = pstr + bcrpcp[ix][1][iz][1][i1] + ',';
								}
							}
							bcrpcp[ix][1][iz].push(pstr);
						}
					}

					callback(caselist, crpcp, bcrpcp, indcom);
				});
			});
		});

	},
	CPMCountPCPVideo(indcom, callback) {
		var cpmvideo = [];
		var str;
		var pec;
		module.exports.getinfodb('select pcp,vidid,vidaddr,videocont.id as vid from connect_prv right join videocont on videocont.id=connect_prv.vidid where (prbid is null) and (reviewid is null) and (crsname is null) and (element is null) and (thumbid is null)', function (rs) {
			for (var ia = 0; ia < indcom.length; ia++) {
				cpmvideo[ia] = []
				cpmvideo[ia][0] = [indcom[ia][0], []];
				cpmvideo[ia][1] = [];

				str = '';
				for (var ic = 0; ic < indcom[ia][0].length; ic++) {
					if (indcom[ia][0].length - 1 == ic) {
						str = str + indcom[ia][0][ic][0];
					} else {
						str = str + indcom[ia][0][ic][0] + ',';
					}

				}
				for (id = 0; id < rs.length; id++) {
					if (rs[id].pcp != null) {
						pec = module.exports.PRVPermutationEquityCheck(str, rs[id].pcp);
						if (pec != 0) {
							cpmvideo[ia][0][1].push([rs[id].vidid, rs[id].vidaddr]);
						}

					}
				}

				for (var ie = 0; ie < indcom[ia][1].length; ie++) {
					cpmvideo[ia][1][ie] = [indcom[ia][1][ie], []];
					str = '';
					for (var ig = 0; ig < indcom[ia][1][ie].length; ig++) {
						if (indcom[ia][1][ie].length - 1 == ig) {
							str = str + indcom[ia][1][ie][ig][0];
						} else {
							str = str + indcom[ia][1][ie][ig][0] + ',';
						}
					}


					for (id = 0; id < rs.length; id++) {
						if (rs[id].pcp != null) {
							pec = module.exports.PRVPermutationEquityCheck(str, rs[id].pcp);
							if (pec != 0) {
								cpmvideo[ia][1][ie][1].push([rs[id].vidid, rs[id].vidaddr]);
							}

						}
					}
				}



			}



			//individual video 
			var indpcp = [];
			var dchk;
			for (var ia = 0; ia < indcom.length; ia++) {
				for (var ib = 0; ib < indcom[ia][1].length; ib++) {
					for (var ic = 0; ic < indcom[ia][1][ib].length; ic++) {
						dchk = 0;
						for (var id = 0; id < indpcp.length; id++) {
							if (indpcp[id][0] == indcom[ia][1][ib][ic][0]) {
								dchk = 1;
							}
						}
						if (dchk == 0) {
							indpcp.push(indcom[ia][1][ib][ic])
						}
					}
				}
			}

			var indvidpcp = [];
			var tmp;
			var echk;
			for (var ia = 0; ia < indpcp.length; ia++) {
				indvidpcp[ia] = [indpcp[ia], []];
				for (id = 0; id < rs.length; id++) {
					if (rs[id].pcp != null) {
						tmp = rs[id].pcp.split(',');
						echk = 0;
						for (var ie = 0; ie < tmp.length; ie++) {
							if (tmp[ie] == indpcp[ia][0]) {
								echk = 1;
							}
						}
						if (echk == 1) {
							indvidpcp[ia][1].push([rs[id].vidid, rs[id].vidaddr]);
						}

					}
				}
			}

			callback(cpmvideo, indvidpcp);
		});
	},
	CPMRemoveExcute(vidid, pcpgstr) {
		var pec;
		module.exports.getinfodb('select vidid,pcp,id from connect_prv where conopt="vidid_pcp" and vidid="' + vidid + '"', function (rs) {
			for (var ia = 0; ia < rs.length; ia++) {
				pec = module.exports.PRVPermutationEquityCheck(pcpgstr, rs[ia].pcp);
				//if pec ==0  일치내용 없음, pec==1 일치내용있음
				if (pec == 1) {
					module.exports.getinfodb('delete from connect_prv where id="' + rs[ia].id + '"', function () { });
				}

			}
		});
	},
	CPMExclusivelist(vid, svid) {
		var exlist = [];
		var achk;
		for (var ia = 0; ia < vid.length; ia++) {
			achk = 0;
			for (var ib = 0; ib < svid.length; ib++) {
				if (vid[ia][0] == svid[ib][0]) {
					achk = 1;
				}
			}
			if (achk == 0) {
				exlist.push(vid[ia]);
			}
		}
		return exlist;
	},
	PCPgComparison(A, a, B, b) {
		var Astr = [];
		var Bstr = [];
		var pec = 0;

		for (var ia = 0; ia < A.length; ia++) {
			Astr.push(A[ia][a]);
		}

		for (var ib = 0; ib < B.length; ib++) {
			Bstr.push(B[ib][b]);
		}

		pec = module.exports.PRVPermutationEquityCheck(Astr, Bstr);
		return pec;
	},
	HighestCount(A, a) {
		var topcount = 0;
		for (var ia = 0; ia < A.length; ia++) {
			if (A[ia][a] > topcount) {
				topcount = A[ia][a];
			}
		}
		return topcount;
	},
	IndArray_v(I, i, A, a) {
		var achk;
		for (var ib = 0; ib < A.length; ib++) {
			achk = 0;
			for (var ia = 0; ia < I.length; ia++) {
				if (I[ia][i] == A[ib][a]) {
					achk = 1;
					break;
				}
			}
			if (achk == 0) {
				I.push(A[ib]);
			}
		}
		return I;

	},

	SortArray(A, a, opt) {
		var swap = function (array, i, j) {
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}

		var sortind = function (array, aa) {
			for (var i = 0; i < array.length; i++) {
				for (var j = 1; j < array.length; j++) {
					if (opt == 0) {
						if (array[j - 1][aa] < array[j][aa]) {
							swap(array, j - 1, j);
						}
					} else {
						if (array[j - 1][aa] > array[j][aa]) {
							swap(array, j - 1, j);
						}
					}
				}
			}
			return array;
		}
		return sortind(A, a);
	},
	CUEqmode(qmode, callback) {
		if (qmode == 0) {
			module.exports.getinfodb('select cr.userid as userid, cr.crsname as crsname, cr.eletime as eletime from crshistory as cr join prismusers as pu on cr.userid=pu.username  order by cr.crsname asc', function (rs) {
				var userbcrs = [];

				var induser = [];
				var achk;
				for (var ia = 0; ia < rs.length; ia++) {
					achk = 0;
					for (var ib = 0; ib < induser.length; ib++) {
						if (induser[ib] == rs[ia].userid) {
							achk = 1;
						}
					}
					if (achk == 0) {
						induser.push(rs[ia].userid)
					}
				}

				var ucrs;
				var achk;
				for (var ia = 0; ia < induser.length; ia++) {
					ucrs = [];
					for (var ib = 0; ib < rs.length; ib++) {
						achk = 0;
						if (rs[ib].userid == induser[ia]) {
							for (var ic = 0; ic < ucrs.length; ic++) {
								if (ucrs[ic] == rs[ib].crsname) {
									achk = 1;
									break;
								}
							}
							if (achk == 0) {
								ucrs.push(rs[ib].crsname);
							}
						}
					}
					userbcrs[ia] = [induser[ia], ucrs];
				}
				callback(userbcrs)
			});
		} else if (qmode == 1) {
			module.exports.getinfodb('select cr.userid as userid, cr.crsname as crsname, cr.eletime as eletime from crshistory as cr join prismusers as pu on cr.userid=pu.username  order by cr.crsname asc', function (rs) {
				var crsbuser = [];

				var indcrs = [];
				var achk;
				for (var ia = 0; ia < rs.length; ia++) {
					achk = 0;
					for (var ib = 0; ib < indcrs.length; ib++) {
						if (indcrs[ib] == rs[ia].crsname) {
							achk = 1;
							break;
						}
					}
					if (achk == 0) {
						indcrs.push(rs[ia].crsname);
					}
				}

				var bchk;
				for (var ia = 0; ia < indcrs.length; ia++) {
					crsbuser[ia] = [indcrs[ia], []]
					for (var ib = 0; ib < rs.length; ib++) {
						if (rs[ib].crsname == indcrs[ia]) {
							bchk = 0;
							for (var ic = 0; ic < crsbuser[ia][1].length; ic++) {
								if (crsbuser[ia][1][ic] == rs[ib].userid) {
									bchk = 1;
									break;
								}
							}
							if (bchk == 0) {
								crsbuser[ia][1].push(rs[ib].userid);
							}
						}
					}
				}

				callback(crsbuser);

			});
		} else {
			console.log('error!!');
		}
	},
	CUE(input, qmode, callback) {
		if (qmode == 0) {
			var userid = input[0];
			var crslist = input[1].split(',');
			var daybefore = parseInt(input[2]);
			var crsstr = '';
			for (var ia = 0; ia < crslist.length; ia++) {
				if (crslist.length - 1 == ia) {
					crsstr = crsstr + 'crsname="' + crslist[ia] + '"';
				} else {
					crsstr = crsstr + 'crsname="' + crslist[ia] + '" or ';
				}
			}

			if (daybefore == 0) {
				var querystr = 'select rstcont,crsname from crshistory where (userid="' + userid + '") and (' + crsstr + ')';
			} else {
				var querystr = 'select rstcont,crsname from crshistory where (userid="' + userid + '") and (' + crsstr + ') and (Date(eletime)>ADDDATE(CURDATE(),INTERVAL -' + daybefore + ' DAY))';
			}
		} else if (qmode == 1) {
			var useridlist = input[0].split(',');;
			var crs = input[1];
			var daybefore = parseInt(input[2]);
			var useridstr = '';
			for (var ia = 0; ia < useridlist.length; ia++) {
				if (useridlist.length - 1 == ia) {
					useridstr = useridstr + 'userid="' + useridlist[ia] + '"';
				} else {
					useridstr = useridstr + 'userid="' + useridlist[ia] + '" or ';
				}
			}

			if (daybefore == 0) {
				var querystr = 'select rstcont,crsname from crshistory where (' + useridstr + ') and (crsname="' + crs + '")';
			} else {
				var querystr = 'select rstcont,crsname from crshistory where (' + useridstr + ') and (crsname="' + crs + '") and (Date(eletime)>ADDDATE(CURDATE(),INTERVAL -' + daybefore + ' DAY))';
			}
		}
		module.exports.getinfodb(querystr, function (rst) {
			''
			module.exports.getinfodb('select pt0.prbid as prbid,pc.pcsinfo as pcpinfo,pc.pcsid as pcpid,pc1.pcsinfo as caseinfo,pc1.pcsid as caseid, pc1.cslevel as cslevel from pcsconnect as pt0 join pcscate as pc on pt0.normid=pc.pcsid join pcsconnect as pt1 on pt0.normid=pt1.childitem join pcscate as pc1 on pc1.pcsid=pt1.normid where pt1.cateopt="case_crpcp" and pt0.cateopt="prb_pcp"', function (pbp) {//prbpcp
				//		module.exports.getinfodb('select pc.pcsid as pcid, pc.pcsinfo as pcinfo, pn.pcsid as pnid, pn.pcsinfo as pninfo, pn.cslevel from pcscate as pc join pcsconnect as pt on pc.pcsid=pt.childitem join pcscate as pn on pn.pcsid=pt.normid where pt.cateopt="case_crpcp"',function(cscrpcp){
				var delim = '@@@';
				var prbrst = [];
				var tmpr;
				var tmpr1;
				var tmpr2;
				var tva;
				var ua = 0;
				for (var ia = 0; ia < rst.length; ia++) {

					tmpr = rst[ia].rstcont;
					if (tmpr != null && tmpr != 'admin' && Boolean(tmpr)) {
						tmpr1 = tmpr.split('###');
						for (var ib = 0; ib < tmpr1.length; ib++) {
							tmpr2 = tmpr1[ib].split(delim);
							if (tmpr2[0][0] == 'p' || tmpr2[0][0] == 'g') {
								prbrst[ua] = [tmpr2[0], tmpr2[5]];
								ua += 1;
							}
						}
					}
				}

				var prbpcp = [];
				for (var ib = 0; ib < prbrst.length; ib++) {
					prbpcp[ib] = [prbrst[ib][0], [], prbrst[ib][1]];
					for (var ic = 0; ic < pbp.length; ic++) {
						if (pbp[ic].prbid == prbrst[ib][0]) {
							prbpcp[ib][1].push([pbp[ic].pcpid, pbp[ic].pcpinfo, pbp[ic].caseid, pbp[ic].caseinfo, pbp[ic].cslevel]);
						}
					}
				}

				var caselist = [];
				var achk;
				var topcount;
				for (var ia = 0; ia < prbpcp.length; ia++) {
					achk = 0;
					topcount = 0;
					var tmpcaseid;
					var tmpcaseinfo;
					for (var ic = 0; ic < prbpcp[ia][1].length; ic++) {
						if (prbpcp[ia][1][ic][4] > topcount) {
							topcount = prbpcp[ia][1][ic][4];
							tmpcaseid = prbpcp[ia][1][ic][2];
							tmpcaseinfo = prbpcp[ia][1][ic][3];
						}
					}
					for (var ib = 0; ib < caselist.length; ib++) {
						if (caselist[ib][0] == tmpcaseid) {
							achk = 1;
							break;
						}
					}
					if (achk == 0) {
						caselist.push([tmpcaseid, tmpcaseinfo, topcount, []]);
					}
				}


				var indpcp = [];
				var pec;
				for (var ia = 0; ia < prbpcp.length; ia++) {
					pec = 0;
					for (var ib = 0; ib < indpcp.length; ib++) {
						pec = module.exports.PCPgComparison(prbpcp[ia][1], 0, indpcp[ib], 0);
						if (pec == 1) {
							break;
						}
					}
					if (pec == 0 && prbpcp[ia][1].length != 0) {
						indpcp.push(prbpcp[ia][1]);
					}
				}


				//indcrpcp
				var indcrpcp = [];
				var tmptop;
				var tmpcr;
				var pec;
				for (var ib = 0; ib < indpcp.length; ib++) {
					tmptop = module.exports.HighestCount(indpcp[ib], 4);
					tmpcr = [];
					pec = 0;
					for (var ia = 0; ia < indpcp[ib].length; ia++) {
						if (indpcp[ib][ia][4] == tmptop) {
							tmpcr.push(indpcp[ib][ia]);
						}
					}
					for (var ic = 0; ic < indcrpcp.length; ic++) {
						pec = module.exports.PCPgComparison(tmpcr, 0, indcrpcp[ic], 0);
						if (pec == 1) {
							break;
						}
					}
					if (pec == 0) {
						indcrpcp.push(tmpcr);
					}

					indpcp[ib] = [tmpcr, indpcp[ib]]
				}


				var caselist = module.exports.SortArray(caselist, 2, 1);

				var indcaselist = [];
				var tmpa;
				var pec;
				for (var ia = 0; ia < caselist.length; ia++) {
					indcaselist[ia] = [caselist[ia][0], caselist[ia][1], caselist[ia][1], []];
					for (var ib = 0; ib < indcrpcp.length; ib++) {
						if (caselist[ia][2] == indcrpcp[ib][0][4]) {
							indcaselist[ia][3].push([indcrpcp[ib], []]);
							for (var ic = 0; ic < indpcp.length; ic++) {
								pec = module.exports.PCPgComparison(indcrpcp[ib], 0, indpcp[ic][0], 0);
								if (pec == 1) {
									indcaselist[ia][3][indcaselist[ia][3].length - 1][1].push([indpcp[ic][1]])

								}
							}
						}
					}
				}


				var pec;
				var totalcount;
				var rgt;  //right
				var slw; //senseless wrong
				var cfw; // confession wrong
				var prblist;

				var prbtotal;
				var prbrgt;
				var prbslw;
				var prbcfw;
				var indprb;
				var achk;
				for (var ia = 0; ia < indcaselist.length; ia++) {
					for (var ib = 0; ib < indcaselist[ia][3].length; ib++) {
						for (var ic = 0; ic < indcaselist[ia][3][ib][1].length; ic++) {

							indprb = [];

							totalcount = 0;
							rgt = 0;
							slw = 0;
							cfw = 0;
							prblist = '';
							for (var id = 0; id < prbpcp.length; id++) {
								pec = module.exports.PCPgComparison(indcaselist[ia][3][ib][1][ic][0], 0, prbpcp[id][1], 0);
								if (pec == 1) {
									totalcount += 1;
									if (parseInt(prbpcp[id][2]) == 1) {
										rgt += 1;
									} else if (parseInt(prbpcp[id][2]) == 2 || parseInt(prbpcp[id][2]) == 4) {
										slw += 1;
									} else if (parseInt(prbpcp[id][2]) == 3) {
										cfw += 1;
									} else {
										console.log('error');
										console.log(prbpcp[id][2]);
									}
								}
							}
							indcaselist[ia][3][ib][1][ic][1] = [];
							indcaselist[ia][3][ib][1][ic][1].push(parseFloat(rgt / totalcount).toFixed(2));
							indcaselist[ia][3][ib][1][ic][1].push(totalcount);
							indcaselist[ia][3][ib][1][ic][1].push(rgt);
							indcaselist[ia][3][ib][1][ic][1].push(cfw);
							indcaselist[ia][3][ib][1][ic][1].push(slw);

							for (var ij = 0; ij < prbpcp.length; ij++) {
								pec = module.exports.PCPgComparison(indcaselist[ia][3][ib][1][ic][0], 0, prbpcp[ij][1], 0);
								if (pec == 1) {
									achk = 0;
									for (var ik = 0; ik < indprb.length; ik++) {
										if (indprb[ik][0] == prbpcp[ij][0]) {
											achk = 1;
											break;
										}
									}
									if (achk == 0) {
										indprb.push([prbpcp[ij][0]]);
									}
								}
							}

							for (var im = 0; im < indprb.length; im++) {
								prbrgt = 0;
								prbslw = 0;
								prbcfw = 0;
								prbtotal = 0;

								for (var il = 0; il < prbpcp.length; il++) {
									pec = module.exports.PCPgComparison(indcaselist[ia][3][ib][1][ic][0], 0, prbpcp[il][1], 0);
									if (pec == 1) {
										if (indprb[im][0] == prbpcp[il][0]) {
											prbtotal += 1;
											if (prbpcp[il][2] == 1) {
												prbrgt += 1;
											} else if (prbpcp[il][2] == 2 || prbpcp[il][2] == 4) {
												prbslw += 1;
											} else if (prbpcp[il][2] == 3) {
												prbcfw += 1;
											}
										}
									}
								}

								indprb[im].push(parseFloat(prbrgt / prbtotal).toFixed(2));
								indprb[im].push(prbtotal);
								indprb[im].push(prbrgt);
								indprb[im].push(prbcfw);
								indprb[im].push(prbslw);
							}
							indcaselist[ia][3][ib][1][ic][2] = indprb;
							/*
							indcaselist[ia][3][ib][1][ic].push(parseFloat(slw/totalcount).toFixed(1));
							indcaselist[ia][3][ib][1][ic].push(parseFloat(cfw/totalcount).toFixed(1));
							indcaselist[ia][3][ib][1][ic].push(parseFloat((cfw+slw)/totalcount).toFixed(1));*/

						}
					}
				}

				//count prbs statistics for pcp relation
				var sindprb = [];
				var achk;
				for (var ia = 0; ia < prbpcp.length; ia++) {
					achk = 0;
					for (var ib = 0; ib < sindprb.length; ib++) {
						if (prbpcp[ia][0] == sindprb[ib][0]) {
							achk = 1;
							break;
						}
					}
					if (achk == 0) {
						sindprb.push([prbpcp[ia][0], prbpcp[ia][1].length]);
					}

				}

				var totalprbnum = prbpcp.length;
				var sindprbnum = sindprb.length;
				var exprbnum = 0;
				var inprbnum = 0;
				var exprblist = [];
				for (var ib = 0; ib < sindprb.length; ib++) {
					if (sindprb[ib][1] == 0) {
						exprbnum += 1;
						exprblist.push(sindprb[ib][0]);
					} else {
						inprbnum += 1;
					}
				}
				var prbstatinfo = [totalprbnum, sindprbnum, inprbnum, exprbnum, exprblist];
				callback(indcaselist, prbstatinfo);

				//		});
			});
		});

	},
	ECUChatting(chat, userid, adminid) {
		var usermsg = [];
		var adminmsg = [];
		var anonmsg = [];

		for (var ia = 0; ia < chat.length; ia++) {
			if (chat[ia].userid == userid) {
				usermsg.push([chat[ia].msgcont, chat[ia].date]);
			} else if (chat[ia].userid == adminid) {
				adminmsg.push(chat[ia].msgcont);
			} else {
				anonmsg.push(chat[ia].msgcont);
			}
		}
		return [usermsg, adminmsg, anonmsg];
	},
	CheckString(chk, opt) {
		if (!opt || opt == 0) {
			var chkcode = 0;
			var achk;
			var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for (var ia = 0; ia < chk.length; ia++) {
				achk = 0;
				for (var ib = 0; ib < possible.length; ib++) {
					if (chk[ia] == possible[ib]) {
						achk = 1;
						break;
					}
				}
				if (achk == 0) {
					chkcode = 1;
					break;
				}

			}
			return chkcode;
		}
	},
	CheckDuplication(objid, objcol, objtable, callback) {
		module.exports.getinfodb('select ' + objcol + ' as objcol from ' + objtable, function (rs) {
			var achk = 0;
			for (var ia = 0; ia < rs.length; ia++) {
				if (rs[ia].objcol == objid) {
					achk = 1;
					break;
				}
			}
			callback(achk)
		});
	},
	POC(specificpcp, callback) {
		module.exports.getinfodb('select * from pcscate where pcsopt="csindex" order by cslevel asc', function (rs) {
			var caselist = [];
			for (var ia = 0; ia < rs.length; ia++) {
				caselist.push([rs[ia].pcsid, rs[ia].pcsinfo, rs[ia].cslevel, []]);
			}

			module.exports.getinfodb('select pt.prbid as prbid, pc.pcsid as pcsid, pc.pcsinfo as pcsinfo from pcsconnect as pt join pcscate as pc on pt.normid=pc.pcsid where pt.cateopt="prb_pcp"', function (ra) {
				module.exports.getinfodb('select pcsconnect.childitem, pcscate.cslevel from pcscate join pcsconnect on pcsconnect.normid=pcscate.pcsid where pcsopt="csindex" and cateopt="case_crpcp"', function (rc) {

					var prbtlist = [];
					var achk;
					for (var ib = 0; ib < ra.length; ib++) {
						achk = 0;
						for (var ic = 0; ic < prbtlist.length; ic++) {
							if (prbtlist[ic] == ra[ib].prbid) {
								achk = 1;
								break;
							}
						}
						if (achk == 0) {
							prbtlist.push(ra[ib].prbid);
						}
					}


					var pcps;
					var count;
					var achk;
					var prblist;
					for (var ie = 0; ie < prbtlist.length; ie++) {
						pcps = [];
						for (var id = 0; id < ra.length; id++) {
							if (ra[id].prbid == prbtlist[ie]) {
								pcps.push([ra[id].pcsid, ra[id].pcsinfo]);
							}
						}

						achk = 0;
						for (var ij = 0; ij < pcps.length; ij++) {
							if (pcps[ij][0] == specificpcp) {
								achk = 1;
								break;
							}
						}

						if (achk == 1) {
							count = 0;
							for (var ih = 0; ih < pcps.length; ih++) {
								for (var ii = 0; ii < rc.length; ii++) {
									if (pcps[ih][0] == rc[ii].childitem) {
										if (rc[ii].cslevel > count) {
											count = rc[ii].cslevel;
										}
									}

								}
							}
							for (var ig = 0; ig < caselist.length; ig++) {
								if (caselist[ig][2] == count) {
									caselist[ig][3].push([prbtlist[ie], pcps]);
									break;
								}
							}
						}

					}

					var specificlist = [];
					for (var ia = 0; ia < caselist.length; ia++) {
						if (caselist[ia][3].length != 0) {
							prblist = [];
							for (var ib = 0; ib < caselist[ia][3].length; ib++) {
								prblist.push(caselist[ia][3][ib][0]);
							}
							caselist[ia].push(prblist);
							specificlist.push(caselist[ia]);
						}
					}

					callback(specificlist);
				});
			})

		});
	},
	EPSstatic() {
		module.exports.getinfodb('select * from pcsconnect where cateopt="prb_pcp"', function (rs) {
			module.exports.getinfodb('select prbid from prb', function (ra) {
				module.exports.getinfodb('select * from pcscate where pcsopt="pcp"', function (rb) {
					var regprb = [];
					var achk;
					for (var ia = 0; ia < rs.length; ia++) {
						achk = 0;
						for (var ib = 0; ib < regprb.length; ib++) {
							if (regprb[ib] == rs[ia].prbid) {
								achk = 1;
								break;
							}
						}
						if (achk == 0) {
							regprb.push(rs[ia].prbid);
						}
					}

					var totalprb = [];
					var bchk;
					for (var ic = 0; ic < ra.length; ic++) {
						bchk = 0;
						for (var id = 0; id < totalprb.length; id++) {
							if (totalprb[id] == ra[ic].prbid) {

								bchk = 1;
								break;
							}
						}
						if (bchk == 0 && ra[ic].prbid[0] == 'p') {
							totalprb.push(ra[ic].prbid)
						}
					}

					var regentitycount = [];
					var cchk;
					for (var ig = 0; ig < rs.length; ig++) {
						cchk = 0;
						for (var ih = 0; ih < regentitycount.length; ih++) {
							if (regentitycount[ih] == rs[ig].normid) {
								cchk = 1;
								break;
							}
						}
						if (cchk == 0) {
							regentitycount.push(rs[ig].normid);
						}
					}


					var numberoftotalentity = rb.length;
					var numberofregentity = regentitycount.length;
					var numberofconnection = rs.length;

					var numberofkeyentity = 0;
					var numberofsubentity = 0;
					var numberofauxentity = 0;
					for (var ie = 0; ie < rs.length; ie++) {
						if (rs[ie].entityopt == 0) {
							numberofsubentity += 1;
						} else if (rs[ie].entityopt == 1) {
							numberofkeyentity += 1;
						} else if (rs[ie].entityopt == 2) {
							numberofauxentity += 1;
						}
					}

					var numberoftotalprb = totalprb.length;
					var numberofregprb = regprb.length;


					var str = { totalprb: numberoftotalprb, regprb: numberofregprb, totalentity: numberoftotalentity, numconnection: numberofconnection, numkeyentitycon: numberofkeyentity, numsubentitycon: numberofsubentity, date: module.exports.nodetime(), regentity: numberofregentity, numauxentitycon: numberofauxentity };
					module.exports.getinfodb_par('insert epsstatic SET ?', str, function (rs) { });

				});
			});
		});
	},
	EPSstaticmodify(callback) {
		var epsstatic = [];
		module.exports.getinfodb('select * from epsstatic', function (ra) {
			for (var ia = 0; ia < ra.length; ia++) {
				epsstatic[ia] = [ia + 1, ra[ia].totalprb, ra[ia].regprb, ra[ia].totalentity, ra[ia].regentity, ra[ia].numconnection, ra[ia].numkeyentitycon, ra[ia].numsubentitycon, ra[ia].numauxentitycon, parseFloat(ra[ia].numconnection / ra[ia].regprb).toFixed(1), ra[ia].date];
			}
			callback(epsstatic);
		});
	},
	EnRS(callback) {
		var indkeyentity = [];
		module.exports.getinfodb('select * from pcsconnect join pcscate on pcsconnect.normid=pcscate.pcsid where entityopt!=2 and cateopt="prb_pcp"', function (ra) {
			module.exports.getinfodb('select pcsid,pcsinfo from pcscate where pcsopt="pcp"', function (rb) {
				var prbidlist = [];
				var cchk;
				for (var ia = 0; ia < ra.length; ia++) {
					cchk = 0;
					for (var ib = 0; ib < prbidlist.length; ib++) {
						if (prbidlist[ib] == ra[ia].prbid) {
							cchk = 1;
							break;
						}
					}
					if (cchk == 0) {
						prbidlist.push(ra[ia].prbid)
					}
				}



				var achk;
				for (var ia = 0; ia < ra.length; ia++) {
					achk = 0;
					for (var ib = 0; ib < indkeyentity.length; ib++) {
						if (indkeyentity[ib][0] == ra[ia].normid) {
							achk = 1;
							break;
						}

					}
					if (achk == 0) {
						indkeyentity.push([ra[ia].normid, ra[ia].pcsinfo]);
					}
				}

				var enrs = [];
				var indprbid;
				var bchk;
				var prbstr;
				for (var ia = 0; ia < indkeyentity.length; ia++) {
					enrs[ia] = [indkeyentity[ia]];
					indprbid = [];
					for (var ib = 0; ib < ra.length; ib++) {

						if (indkeyentity[ia][0] == ra[ib].normid) {
							bchk = 0;
							for (var ic = 0; ic < indprbid.length; ic++) {
								if (indprbid[ic] == ra[ib].prbid) {
									bchk = 1;
									break;
								}
							}
							if (bchk == 0) {
								indprbid.push(ra[ib].prbid)
							}
						}
					}


					prbstr = '';
					for (var ie = 0; ie < indprbid.length; ie++) {
						if (indprbid.length - 1 == ie) {
							prbstr = prbstr + indprbid[ie];
						} else {
							prbstr = prbstr + indprbid[ie] + ',';
						}
					}
					enrs[ia].push(prbstr);
					enrs[ia].push(indprbid.length);

				}
				var emptyentity = [];
				var echk;
				for (var ig = 0; ig < rb.length; ig++) {
					echk = 0;
					for (var ih = 0; ih < enrs.length; ih++) {
						if (enrs[ih][0][0] == rb[ig].pcsid) {
							echk = 1;
							break;
						}
					}
					if (echk == 0) {
						emptyentity.push([rb[ig].pcsid, rb[ig].pcsinfo]);
					}
				}
				callback(module.exports.SortArray(enrs, 2, 0), emptyentity);
			});
		});

	},
	PEAindv(callback) {
		var prblist = [];
		module.exports.getinfodb('select prbid,source from prb', function (ra) {
			for (var ia = 0; ia < ra.length; ia++) {
				if (ra[ia].prbid[0] == 'p') {
					prblist.push([ra[ia].prbid, ra[ia].source]);
				}
			}
			callback(prblist);
		});
	},
	EERCreateSlk(slkinfo, modimode, callback) {
		if (modimode == 0) {
			module.exports.GetObjId('slb', 'EERSLAB', 4, function (slbid) {
				var rst = { slabinfo: slkinfo, inhid: slbid };
				module.exports.getinfodb_par('insert into EERSLAB SET ?', rst, function (err, result) { });

			});
		} else if (modimode == 1) {
			module.exports.GetObjId('blk', 'EERBLOCK', 4, function (blkid) {
				var rst = { blockinfo: slkinfo, inhid: blkid };
				module.exports.getinfodb_par('insert into EERBLOCK SET ?', rst, function (err, result) { });

			});
		}
		callback();
	},
	EERGetSlkList(callback) {
		module.exports.getinfodb('select * from EERSLAB', function (ra) {
			module.exports.getinfodb('select * from EERBLOCK', function (rb) {
				callback(ra, rb);
			});
		});
	},
	EERBlocklistOfSlab(slabid, callback) {
		module.exports.getinfodb('select EERCONSLK.inhid as slkid, EERBLOCK.blockinfo as blockinfo, EERCONSLK.slkorder as slkorder from EERCONSLK join EERBLOCK on EERCONSLK.blockid=EERBLOCK.inhid where EERCONSLK.slabid="' + slabid + '" order by slkorder asc', function (rb) {
			var blocklist = [];
			var unblocklist = [];
			var assblocklist = [];
			for (var ia = 0; ia < rb.length; ia++) {
				if (rb[ia].slkorder == 0) {
					unblocklist.push([rb[ia].slkid, rb[ia].blockinfo, rb[ia].slkorder]);
				} else {
					assblocklist.push([rb[ia].slkid, rb[ia].blockinfo, rb[ia].slkorder]);
				}
			}
			blocklist[0] = unblocklist;
			blocklist[1] = assblocklist;

			callback(blocklist);
		});
	},
	EERGetCaseList(slkid, callback) {
		module.exports.getinfodb('select * from pcscate where pcsopt="csindex"', function (ra) {
			module.exports.getinfodb('select * from EERCONCASE where slkid="' + slkid + '"', function (rb) {
				var caselist = [];
				var chcaselist = [];

				for (var ia = 0; ia < ra.length; ia++) {
					caselist.push([ra[ia].pcsid, ra[ia].pcsinfo]);
				}

				for (var ib = 0; ib < rb.length; ib++) {
					chcaselist.push([rb[ib].caseid, rb[ib].inhid]);
				}

				var achk;
				for (var ic = 0; ic < caselist.length; ic++) {
					achk = 0;
					for (var id = 0; id < chcaselist.length; id++) {
						if (chcaselist[id][0] == caselist[ic][0]) {
							achk = 1;
							break;
						}
					}
					if (achk == 0) {
						caselist[ic].push(0);
						caselist[ic].push(null);
					} else {
						caselist[ic].push(1);
						caselist[ic].push(chcaselist[id][1]);
					}
				}

				callback(caselist);


			});
		});
	},
	EERCreateCaseConnect(slkid, caseid, callback) {
		callback();
		module.exports.GetObjId('csb', 'EERCONCASE', 4, function (csbid) {
			var rst = { slkid: slkid, caseid: caseid, inhid: csbid };
			module.exports.getinfodb_par('insert into EERCONCASE SET ?', rst, function (err, result) { });

		});


	},
	EERConnectSlabToBlock(slabid, callback) {
		module.exports.getinfodb('select * from EERBLOCK', function (ra) {
			module.exports.getinfodb('select * from EERCONSLK where slabid="' + slabid + '"', function (rb) {
				var blocklist = [];
				var chblocklist = [];

				for (var ia = 0; ia < ra.length; ia++) {
					blocklist.push([ra[ia].inhid, ra[ia].blockinfo]);
				}

				for (var ib = 0; ib < rb.length; ib++) {
					chblocklist.push(rb[ib].blockid);
				}

				var achk;
				for (var ic = 0; ic < blocklist.length; ic++) {
					achk = 0;
					for (var id = 0; id < chblocklist.length; id++) {
						if (chblocklist[id] == blocklist[ic][0]) {
							achk = 1;
							break;
						}
					}
					if (achk == 0) {
						blocklist[ic].push(0);
					} else {
						blocklist[ic].push(1);
					}
				}

				callback(blocklist);

			});
		});
	},
	EERCreateSlkConnect(slabid, blockid, callback) {
		callback();
		module.exports.GetObjId('slk', 'EERCONSLK', 4, function (slkid) {
			var rst = { slabid: slabid, blockid: blockid, inhid: slkid, slkorder: 0 };
			module.exports.getinfodb_par('insert into EERCONSLK SET ?', rst, function (err, result) { });

		});
	},
	PFO(slkid, caseid, callback) {

		var LevelJudge = function (prblevelset, blocklevelset) {//prblevelset=[3,5,6], blocklevelset=[23,2,1]


			var achk;
			for (var ia = 0; ia < prblevelset.length; ia++) {
				achk = 0;
				for (var ib = 0; ib < blocklevelset.length; ib++) {
					if (blocklevelset[ib] == prblevelset[ia]) {
						achk = 1;
						break;
					}
				}
				if (achk == 0) {
					break;
				}
			}
			return achk;//achk==1이면 통과 안빼도 된다. achk==0이면 빼야 한다.
		}

		module.exports.getinfodb('select caseid, slabid, blockid, slkorder, slkid, pcon1.childitem as entity, pcon2.entityopt, pcon2.prbid, pcscate.cslevel, pct.pcsinfo,pct.cslevel as es from EERCONCASE join EERCONSLK on EERCONCASE.slkid=EERCONSLK.inhid join pcsconnect as pcon1 on pcon1.normid=EERCONCASE.caseid join pcsconnect as pcon2 on pcon2.normid=pcon1.childitem join pcscate on pcscate.pcsid=EERCONCASE.caseid join pcscate as pct on pct.pcsid = pcon2.normid where pcon1.cateopt="case_crpcp"', function (ra) {
			module.exports.getinfodb('select pcon1.prbid, pcscate.cslevel from pcsconnect as pcon1 join pcsconnect as pcon2 on pcon1.normid=pcon2.childitem join pcscate on pcon2.normid=pcscate.pcsid where pcon1.cateopt="prb_pcp"', function (rb) {
				var ownblock = [];
				for (var ia = 0; ia < ra.length; ia++) {
					if (ra[ia].slkid == slkid && ra[ia].caseid == caseid) {
						ownblock = [ra[ia].blockid, ra[ia].slkorder, ra[ia].cslevel];
						break;
					}
				}

				var elseblock = [];
				var upblock = [];
				var dchk;
				var echk;
				for (var ia = 0; ia < ra.length; ia++) {
					if (ra[ia].slkorder < ownblock[1]) {
						dchk = 0;
						for (var ib = 0; ib < elseblock.length; ib++) {
							if (elseblock[ib][0] == ra[ia].blockid) {
								dchk = 1;
								break;
							}
						}
						if (dchk == 0) {
							elseblock.push([ra[ia].blockid, ra[ia].slkorder]);
						}
					} else if (ra[ia].slkorder > ownblock[1]) {
						echk = 0;
						for (var ic = 0; ic < upblock.length; ic++) {
							if (upblock[ic][0] == ra[ia].blockid) {
								echk = 1;
								break;
							}
						}
						if (echk == 0) {
							upblock.push([ra[ia].blockid, ra[ia].slkorder]);
						}
					}
				}



				var vprblist = [];
				var ichk;
				for (var ia = 0; ia < ra.length; ia++) {

					if (ra[ia].blockid == ownblock[0] && ra[ia].cslevel <= ownblock[2]) {
						vprblist.push(ra[ia].prbid);
					}
				}

				var hchk;
				for (var ia = 0; ia < ra.length; ia++) {
					hchk = 0;
					for (var ib = 0; ib < elseblock.length; ib++) {
						if (elseblock[ib][0] == ra[ia].blockid) {
							hchk = 1;
							break;
						}
					}
					if (hchk == 1) {
						vprblist.push(ra[ia].prbid);
					}
				}



				var prblist = [];


				var jchk;
				for (var ia = 0; ia < vprblist.length; ia++) {
					jchk = 0;
					for (var ib = 0; ib < prblist.length; ib++) {
						if (prblist[ib] == vprblist[ia]) {
							jchk = 1;
							break;
						}
					}
					if (jchk == 0) {
						prblist.push(vprblist[ia]);
					}
				}

				/*
						for(var ia=0; ia<ra.length; ia++){
							if(ra[ia].entityopt==1 || ra[ia].entityopt==0){
								achk=0;
								for(var ib=0; ib<prblist.length; ib++){	
									if(prblist[ib]==ra[ia].prbid){	
										achk=1;
										break;
									}
								}
								if(achk==0){	
									prblist.push(ra[ia].prbid);
								}
							}
						}*/


				var blocklevellist = [];
				var bchk;
				for (var ia = 0; ia < ra.length; ia++) {
					bchk = 0;
					for (var ib = 0; ib < blocklevellist.length; ib++) {
						if (blocklevellist[ib] == ra[ia].cslevel) {
							bchk = 1;
							break;
						}
					}
					if (bchk == 0) {
						blocklevellist.push(ra[ia].cslevel);
					}
				}//

				var blacklist = [];//문제 리스트에서 빠뜨려야 하는 리스트
				var prblist2 = [];
				var prblevelset;
				var cchk;
				for (var ia = 0; ia < prblist.length; ia++) {
					prblevelset = [];
					for (var ib = 0; ib < rb.length; ib++) {
						if (rb[ib].prbid == prblist[ia]) {
							cchk = 0;
							for (var ic = 0; ic < prblevelset.length; ic++) {
								if (prblevelset[ic] == rb[ib].cslevel) {
									cchk = 1;
									break;
								}
							}
							if (cchk == 0) {
								prblevelset.push(rb[ib].cslevel);
							}
						}
					}
					if (LevelJudge(prblevelset, blocklevellist) == 0) {
						blacklist.push(prblist[ia]);
					} else {
						prblist2.push(prblist[ia])
					}
				}



				//BES Filtering

				var keyintarget = [];//keyentityintargetrange
				var achk;
				for (var ia = 0; ia < ra.length; ia++) {
					if (ra[ia].blockid == ownblock[0] && ra[ia].cslevel == ownblock[2]) {
						achk = 0;
						for (var ib = 0; ib < keyintarget.length; ib++) {
							if (keyintarget[ib][0] == ra[ia].entity) {
								achk = 1;
								break;
							}
						}
						if (achk == 0) {
							keyintarget.push([ra[ia].entity, ra[ia].pcsinfo, ra[ia].es])
						}
					}
				}


				var keyintargetbes = [];
				for (var ia = 0; ia < keyintarget.length; ia++) {
					if (keyintarget[ia][2] == 0) {
						keyintargetbes.push(keyintarget[ia])
					}
				}

				var BESset = [];
				var bchk;

				var prbentityset = [];
				for (var ia = 0; ia < prblist2.length; ia++) {
					prbentityset[ia] = [prblist2[ia], []]
					for (var ib = 0; ib < ra.length; ib++) {
						if (ra[ib].prbid == prblist2[ia]) {
							prbentityset[ia][1].push([ra[ib].entity, ra[ib].entityopt])
						}

					}
				}


				var achk;
				var bchk;
				for (var ia = 0; ia < keyintargetbes.length; ia++) {
					BESset[ia] = [keyintargetbes[ia], [], [], []];
					for (var ib = 0; ib < prbentityset.length; ib++) {
						achk = 0
						for (var ic = 0; ic < prbentityset[ib][1].length; ic++) {
							if (prbentityset[ib][1][ic][0] == keyintargetbes[ia][0] && prbentityset[ib][1][ic][1] == 1) {
								achk = 1;
								break;
							}
						}
						if (achk == 1) {
							bchk = 0;
							for (var id = 0; id < prbentityset[ib][1].length; id++) {
								if (prbentityset[ib][1][id][1] == 0) {
									bchk = 1;
									break;
								}
							}
							if (bchk == 0) {
								BESset[ia][3].push(prbentityset[ib][0])
							}
						}
					}
				}



				/*
				for(var ia=0; ia<keyintargetbes.length; ia++){
					BESset[ia]=[keyintargetbes[ia],[]];
					for(var ib=0; ib<prblist2.length; ib++){
						for(var ic=0; ic<ra.length; ic++){
							if(ra[ic].entity==keyintargetbes[ia][0] && ra[ic].prbid==prblist2[ib] && ra[ic].entityopt==1){
								BESset[ia][1].push(ra[ic].prbid);
							}// entityopt 1 // key
							if(ra[ic].entity==keyintargetbes[ia][0] && ra[ic].prbid==prblist2[ib] && ra[ic].entityopt==0){
								bchk=0;
								for(var id=0; id<BESset[ia][1].length; id++){
									if(BESset[ia][1][id]==ra[ic].prbid){
										bchk=1;
										break;
									}
								}
								if(bchk==0){
									BESset[ia][1].push(ra[ic].prbid);
								}
							}// entityopt 0 //sub
						}
					}
				}*/


				//EES Filtering


				var subinappl = [];
				var achk;
				for (var ia = 0; ia < ra.length; ia++) {
					if (ra[ia].blockid == ownblock[0] && ra[ia].cslevel < ownblock[2]) {//ownblock에서 서치. 
						achk = 0;
						for (var ic = 0; ic < subinappl.length; ic++) {
							if (subinappl[ic][0] == ra[ia].entity) {
								achk = 1;
								break;
							}
						}
						if (achk == 0) {
							subinappl.push([ra[ia].entity, ra[ia].pcsinfo]);
						}
					}
					for (var ib = 0; ib < elseblock.length; ib++) {


						if (elseblock[ib][0] == ra[ia].blockid) {
							achk = 0;
							for (var ic = 0; ic < subinappl.length; ic++) {
								if (subinappl[ic][0] == ra[ia].entity) {
									achk = 1;
									break;
								}
							}
							if (achk == 0) {
								subinappl.push([ra[ia].entity, ra[ia].pcsinfo]);
							}

						}
					}
				}

				/*
				var targetkey=[];//keyentity가 타겟에 범위에 있는문제들.
				var achk;
				for(var ia=0; ia<keyintarget.length; ia++){
					for(var ib=0; ib<ra.length; ib++){
						if(ra[ib].entity==keyintarget[ia][0] && ra[ib].entityopt==1){
							achk=0;
							for(var ic=0; ic<targetkey.length; ic++){
								if(targetkey[ic]==ra[ib].prbid){
									achk=1;
									break;
								}
							}
							if(achk==0){
								targetkey.push(ra[ib].prbid);	
							}
						}
					}
				}*/



				var EESset = [];
				var achk;
				var bchk;
				var cchk;
				var dchk;
				for (var ia = 0; ia < keyintarget.length; ia++) {
					EESset[ia] = [keyintarget[ia], [], [], []];
					if (keyintarget[ia][2] == 0) {
						for (var ib = 0; ib < prbentityset.length; ib++) {
							achk = 0;//타겟이 문제에 존재하는가의 여부 1이면 존재 0이면 존재하지 않음.
							for (var ic = 0; ic < prbentityset[ib][1].length; ic++) {
								if (prbentityset[ib][1][ic][0] == keyintarget[ia][0]) {
									achk = 1;
									break;
								}
							}
							if (achk == 1) {
								bchk = 0;//subentity가 존재하는가의 여부. 존재하면 1, 존재하지 않으면 0
								for (var id = 0; id < prbentityset[ib][1].length; id++) {
									if (prbentityset[ib][1][id][1] == 0) {
										bchk = 1;
										break;
									}
								}
								if (bchk == 1) {
									cchk = 0; //그 subentity가 target에 존재하는지의 여부. cchk가 0이면 존재하지 타겟에 존재, 1이면 응용에 존재
									for (var ie = 0; ie < subinappl.length; ie++) {
										for (var ig = 0; ig < prbentityset[ib][1].length; ig++) {
											if (prbentityset[ib][1][ig][0] == subinappl[ie][0] && prbentityset[ib][1][ig][1] == 0) {
												cchk = 1;
												break;
											}
										}
										if (cchk == 1) {
											break;
										}
									}
									if (cchk == 1) {
										EESset[ia][2].push(prbentityset[ib][0]);
									} else {
										EESset[ia][1].push(prbentityset[ib][0]);
									}
									var dchk = 0;
									for (var ih = 0; ih < EESset[ia][3].length; ih++) {
										if (EESset[ia][3][ih] == prbentityset[ib][0]) {
											dchk = 1;
											break;
										}
									}
									if (dchk == 0) {
										EESset[ia][3].push(prbentityset[ib][0]);
									}
								} else {
								}
							} else {
							}

						}

					} else {
						for (var ib = 0; ib < prbentityset.length; ib++) {

							achk = 0
							for (var ic = 0; ic < prbentityset[ib][1].length; ic++) {
								if (prbentityset[ib][1][ic][0] == keyintarget[ia][0] && prbentityset[ib][1][ic][1] == 1) {
									achk = 1;
									break;
								}
							}
							if (achk == 1) {
								EESset[ia][3].push(prbentityset[ib][0])
							}

						}



					}
				}


				var validset = [];
				for (var ia = 0; ia < keyintarget.length; ia++) {
					validset.push(keyintarget[ia]);
				}

				for (var ia = 0; ia < subinappl.length; ia++) {
					validset.push(subinappl[ia]);
				}

				var linearseries = [];
				for (var ia = 0; ia < validset.length; ia++) {
					linearseries[ia] = [validset[ia], [], [], []];
					for (var ib = 0; ib < prbentityset.length; ib++) {
						achk = 0;
						for (var ic = 0; ic < prbentityset[ib][1].length; ic++) {
							if (prbentityset[ib][1][ic][0] == validset[ia][0] && (prbentityset[ib][1][ic][1] == 0 || prbentityset[ib][1][ic][1] == 1)) {
								achk = 1;
								break;
							}
						}
						if (achk == 1) {
							linearseries[ia][3].push(prbentityset[ib][0]);
						}
					}
				}

				/*
				var entitylist;
				var achk;
				for(var ia=0; ia<targetkey.length; ia++){
					entitylist=[];
					for(var ib=0; ib<ra.length; ib++){	
						if(ra[ib].prbid==targetkey[ia] && ra[ib].entityopt==0){
							entitylist.push(ra[ib].entity);
						}
					}
		
					
					for(var ic=0; ic<subinappl.length; ic++){
						achk=0;
						for(var id=0; id<entitylist.length; id++){
							if(entitylist[id]==subinappl[ic][0]){
								achk=1;
								break;
							}
						}
						if(achk==1){
							break;
						}
					}
					
					if(achk==1){
						EESset[0].push(targetkey[ia]);
					}
				}
		
				var prbkeyinappl=[];
				var achk;
				for(var ia=0; ia<subinappl.length; ia++){
					for(var ib=0; ib<ra.length; ib++){
						if(ra[ib].entity==subinappl[ia][0] && ra[ib].entityopt==1){
							achk=0;
							for(var ic=0; ic<prbkeyinappl.length; ic++){
								if(prbkeyinappl[ic]==ra[ib].prbid){
									achk=1;
									break;
								}
							}
							if(achk==0){
								prbkeyinappl.push(ra[ib].prbid);
							}
						}
					}
				}
		
				var entitylist;
				var achk;
				for(var ia=0; ia<prbkeyinappl.length; ia++){
					entitylist=[];
					for(var ib=0; ib<ra.length; ib++){
						if(ra[ib].prbid==prbkeyinappl[ia] && (ra[ib].entityopt==2 || ra[ib].entityopt==0)){
							entitylist.push(ra[ib].entity);
						}
					}
					for(var ic=0; ic<keyintarget.length; ic++){
						achk=0;
						for(var id=0; id<entitylist.length; id++){
							if(entitylist[id]==keyintarget[ic][0]){
								achk=1;
								break;
							}
						}
						if(achk==1){
							break;
						}
					}
					if(achk==1){
						EESset[1].push(prbkeyinappl[ia])
					}
				}*/
				callback(BESset, EESset, linearseries);

			});
		});

	},
	doublepack(obj, delim1, delim2) {

		var dbp = [];
		for (var ia = 0; ia < obj.length; ia++) {
			dbp[ia] = module.exports.simpacking(obj[ia], delim1);
		}

		return module.exports.simpacking(dbp, delim2);

	},

	//GetObjId(obj,tbname,num,callback){
	signalServerDumpRecord(dump, opt, callback) {
		//opt=1; send Material from mentor to mentee
		//opt=2; send back Material result from mentee to mentor 
		//opt=3; request Connection from mentee to mentor
		//opt=4; accept connection from mentor of mentee's
		//opt=5; terminate connection by mentor
		if (opt == 1) { //crsname, ele, prbs, vidaddr, mentorid, menteeid
			module.exports.GetObjId('ssd', 'commrecord', 10, function (id) {
				module.exports.getinfodb('insert into commrecord(recordid,mentorid,menteeid,ioption,dumpmaterial) values("' + id + '","' + dump[4] + '","' + dump[5] + '","' + 'sendmaterial' + '","' + module.exports.simpacking([dump[0], dump[1], dump[2], dump[3]], '@@@') + '")', function () {
					callback();
				});
			});
		} else if (opt == 2) {//prbstatepanel,mentorid, menteeid, delim1, delim2
			module.exports.GetObjId('ssd', 'commrecord', 10, function (id) {
				module.exports.getinfodb('insert into commrecord(recordid,mentorid,menteeid,ioption,dumpmaterial) values("' + id + '","' + dump[1] + '","' + dump[2] + '","' + 'sendresult' + '","' + module.exports.doublepack(dump[0], dump[3], dump[4]) + '")', function () {
					callback(id);
				});

			});
		} else if (opt == 3) {//mentor , mentee
			module.exports.GetObjId('ssd', 'commrecord', 10, function (id) {
				module.exports.getinfodb('insert into commrecord(recordid,mentorid,menteeid,ioption) values("' + id + '","' + dump[0] + '","' + dump[1] + '","' + 'connectrequest' + '")', function () {
					callback();
				});
			});

		} else if (opt == 4) {//mentor, mentee
			module.exports.GetObjId('ssd', 'commrecord', 10, function (id) {
				module.exports.getinfodb('insert into commrecord(recordid,mentorid,menteeid,ioption) values("' + id + '","' + dump[0] + '","' + dump[1] + '","' + 'connectaccept' + '")', function () {
					callback();
				});
			});
		} else if (opt == 5) {//mentor mentee
			module.exports.GetObjId('ssd', 'commrecord', 10, function (id) {
				module.exports.getinfodb('insert into commrecord(recordid,mentorid,menteeid,ioption) values("' + id + '","' + dump[0] + '","' + dump[1] + '","' + 'disconnected' + '")', function () {
					callback();
				});
			});
		} else {
			console.log('error occurred from signalServerDumpRecord function');
		}
	},
	LoginCheck(user, pos, callback) {
		var msg;
		if (typeof user !== 'undefined' && user) {
			if (!Array.isArray(pos)) {
				if (user.position != pos) {
					msg = '로그인에 실패했습니다. 돌아가서 다시 로그인해주세요. ;; <a href="/">Login</a>' + user.position;
					callback(msg)
				} else {
					callback(null);
				}
			} else {
				var chk = 0;
				for (var ia = 0; ia < pos.length; ia++) {
					if (pos[ia] == user.position) {
						chk = 1;
						break;
					}
				}
				if (chk == 0) {
					msg = '로그인에 실패했습니다. 돌아가서 다시 로그인해주세요. ;; <a href="/">Login</a> ' + user.position;
					callback(msg)
				} else {
					callback(null);

				}
			}
		} else {
			msg = '로그인이 되지 않아습니다. 다시 시도해주시기 바래요.<a href="/">LogIn </a>'
			callback(msg)
		}
	},
	NUSDpickingFreeprb(searchDuration, callback) {


		module.exports.getinfodb('select * from cptproblemset', function (a) {
			var reglist = [];
			for (var ia = 0; ia < a.length; ia++) {
				var plist = a[ia].prblist.split(',');
				for (var ib = 0; ib < plist.length; ib++) {
					reglist.push(plist[ib]);
				}
			}

			var unreglist = [];
			//module.exports.getinfodb('select * from prb order by prbregi asc',function(b){
			module.exports.getinfodb('select * from prb order by prbregi desc limit 0, ' + searchDuration, function (b) {
				// module.exports.getinfodb('select * from prb where prbregi >= '+searchDuration+' order by prbregi desc',function(b){
				for (var ia = 0; ia < b.length; ia++) {
					var chk = 0;
					for (var ib = 0; ib < reglist.length; ib++) {
						if (reglist[ib] == b[ia].prbid) {
							chk = 1;
							break;
						}
					}
					if (chk == 0) {
						unreglist.push(b[ia].prbid)
					}
				}

				callback(unreglist);
			});
		});
	},

	rdcsRootcontentsobj(callback) {//reduce Cost
		module.exports.getinfodb('select r3.r3id, r3.listinfo as r3listinfo, r2.r2id, r2.r2listinfo as r2listinfo,cpt.cptid as r1id, cpt.listinfo as r1listinfo, cpt.prblist as prblist from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id join rkconnect as rk2 on rk.childcol=rk2.parentcol join r2list as r2 on r2.r2id=rk2.parentcol join cptproblemset as cpt on rk2.childcol=cpt.cptid order by r3.r3order, r2.r2order, rk2.rkorder', function (a) {


			var indr3set = [];
			for (var ia = 0; ia < a.length; ia++) {
				var chk = 0;
				for (var ib = 0; ib < indr3set.length; ib++) {
					if (indr3set[ib][0] == a[ia].r3id) {
						chk = 1;
						break;
					}
				}
				if (chk == 0) {
					indr3set.unshift([a[ia].r3id, a[ia].r3listinfo]);
				}
			}


			rootobj = [];
			for (var ia = 0; ia < indr3set.length; ia++) {
				var indr2set = [];
				rootobj[ia] = { r3id: indr3set[ia][0], r3listinfo: indr3set[ia][1], r2list: [] }
				for (var ib = 0; ib < a.length; ib++) {
					if (a[ib].r3id == indr3set[ia][0]) {
						var chk = 0;
						for (var ic = 0; ic < indr2set.length; ic++) {
							if (indr2set[ic][0] == a[ib].r2id) {
								chk = 1;
								break;
							}
						}
						if (chk == 0) {
							indr2set.push([a[ib].r2id, a[ib].r2listinfo])
						}


					}
				}

				for (var id = 0; id < indr2set.length; id++) {
					var indr1set = [];
					rootobj[ia].r2list[id] = { r2id: indr2set[id][0], r2listinfo: indr2set[id][1] };
					for (var ie = 0; ie < a.length; ie++) {
						if (a[ie].r2id == indr2set[id][0]) {
							var chk = 0;
							for (var ig = 0; ig < indr1set.length; ig++) {
								if (indr1set[ig][0] == a[ie].r1id) {
									chk = 1;
									break;
								}
							}
							if (chk == 0) {
								indr1set.push([a[ie].r1id, a[ie].r1listinfo, a[ie].prblist])
							}
						}
					}

					rootobj[ia].r2list[id].r1list = indr1set;

				}


			}

			callback(rootobj)
		});


	},
	rdcsdbUpdate() {
		module.exports.rdcsRootcontentsobj(function (rootobj) {
			module.exports.GetObjIdv2('rcon', 'rconstore', 'rconid', 10, function (rconid) {
				var istobj = { rconid: rconid, rconobj: JSON.stringify(rootobj), createdate: module.exports.nodetime() };
				module.exports.getinfodb_par('insert into rconstore set ?', istobj, function () {
				});
			});
		});
	},
	redfilterPrbvidset_pre(slotlist, a) {

		//red filter

		for (var ia = 0; ia < slotlist.length; ia++) {
			var prblist = slotlist[ia][5].split(',');
			var Nprblist = [];
			for (var ib = 0; ib < prblist.length; ib++) {
				var chk = 0;
				for (var ic = 0; ic < a.length; ic++) {
					if (a[ic].hisopt == 'prbsolve') {
						if (a[ic].prbid == prblist[ib]) {
							chk = 1;
							break;
						}
					}
				}
				if (chk == 0) {
					Nprblist.push(prblist[ib])
				}
			}
			var Nprbliststr = '';
			for (var id = 0; id < Nprblist.length; id++) {
				if (id < Nprblist.length - 1) {
					Nprbliststr = Nprbliststr + Nprblist[id] + ',';
				} else {
					Nprbliststr = Nprbliststr + Nprblist[id];
				}
			}
			slotlist[ia][5] = Nprbliststr;
		}

		return slotlist;
	},
	redfilterPrbvidset(prbvidset, a) {
		var timediff = 12;
		for (var ia = 0; ia < prbvidset.length; ia++) {
			for (var ib = 0; ib < prbvidset[ia].length; ib++) {
				var chk = 0;
				for (var ic = 0; ic < a.length; ic++) {
					//if(a[ic].hisopt=='prbsolve' && a[ic].prbid==prbvidset[ia][ib].prbid){
					if (a[ic].hisopt == 'prbsolve' && a[ic].prbid == prbvidset[ia][ib].prbid && Date.parse(a[ic].createdate) > (Date.now() - timediff * 60 * 60 * 1000)) {
						chk = 1;
						break;
					}
				}
				if (chk == 1) {
					prbvidset[ia][ib].redfilter = 1;
				} else {
					prbvidset[ia][ib].redfilter = 0;
				}
			};
		}
		return prbvidset;
	},
	buildSlotlist(robj) {
		var slotlist = [];
		for (var ib = 0; ib < robj[0].r2list.length; ib++) {
			for (var ic = 0; ic < robj[0].r2list[ib].r1list.length; ic++) {
				slotlist.push([robj[0].r3id, robj[0].r3listinfo, robj[0].r2list[ib].r2id, robj[0].r2list[ib].r2listinfo, robj[0].r2list[ib].r1list[ic][0], robj[0].r2list[ib].r1list[ic][1], robj[0].r2list[ib].r1list[ic][2]]);
			}
		}

		return slotlist;


	},
	connRcontovideo(slotlist, username, callback) {

		module.exports.getinfodb('select rk.parentcol, rk.numid, rk.childcol, vi.vidaddr, vi.vidinfo, vi.id from rkconnect as rk join videocont as vi on rk.parentcol=vi.id where conkind="rcvideo0"', function (vi) {
			module.exports.getinfodb('select * from rdcthistory where username="' + username + '"', function (a) {

				var prbvidset = [];
				for (var ic = 0; ic < slotlist.length; ic++) {
					var prblist = slotlist[ic][6].split(',')

					var prbvid = [];
					for (var ia = 0; ia < prblist.length; ia++) {
						prbvid[ia] = { prbid: prblist[ia], vidinfo: [], cptid: slotlist[ic][4] };
						//prbvid[ia]={prbid:prblist[ia],vidinfo:[]};

						for (var ib = 0; ib < vi.length; ib++) {
							if (vi[ib].childcol == prblist[ia]) {
								prbvid[ia].vidinfo.push([vi[ib].id, vi[ib].vidaddr, vi[ib].vidinfo])
							}
						}
					}

					prbvidset.push(prbvid);


				}

				prbvidset = module.exports.greyfilterPrbvidset(prbvidset, a);
				prbvidset = module.exports.redfilterPrbvidset(prbvidset, a);
				callback(prbvidset);

			});


		});

	},
	greyfilterPrbvidset(prbvidset, a) {
		for (var ia = 0; ia < prbvidset.length; ia++) {
			for (var ib = 0; ib < prbvidset[ia].length; ib++) {
				var chk = 0;
				for (var ic = 0; ic < a.length; ic++) {
					if (a[ic].hisopt == 'iknowitalready' && a[ic].prbid == prbvidset[ia][ib].prbid) {
						chk = 1;
						break;
					}
				}
				if (chk == 1) {
					prbvidset[ia][ib].greyfilter = 1;
				} else {
					prbvidset[ia][ib].greyfilter = 0;
				}
			}
		}
		return prbvidset;
	},
	greyfilterPrbvidset_pre(prblist, a) {
		var Nprblist = [];
		for (var ia = prblist.length - 1; ia >= 0; ia--) {
			var chk = 0;
			for (var ib = 0; ib < a.length; ib++) {
				if (a[ib].hisopt == 'iknowitalready' && a[ib].prbid == prblist[ia]) {
					chk = 1;
					break;
				}
			}
			if (chk == 0) {
				Nprblist.unshift([prblist[ia], 0]);
			} else {
				Nprblist.push([prblist[ia], 1]);;
			}
		}
		return Nprblist;

	},
	loadPrbtoprbvidset(pvs, callback) {//prbvidset
		var prblist = [];
		for (var ia = 0; ia < pvs.length; ia++) {
			prblist.push(pvs[ia].prbid);
		}

		//prbsetv2:function(plist,callback){
		module.exports.prbsetv2(prblist, function (prblist) {
			for (var ib = 0; ib < pvs.length; ib++) {
				for (var ia = 0; ia < prblist.length; ia++) {
					if (prblist[ia][0] == pvs[ib].prbid) {
						pvs[ib].prbcon = prblist[ia];
						break;
					}
				}
			}

			callback(pvs);
		});

	},
	decideRconnum(username, callback) {
		module.exports.getinfodb('select * from rdcthistory where username="' + username + '" and hisopt="prbsolve"', function (a) {
			var rconnum;
			if (a.length == 0) {
				rconnum = 0;
				callback(rconnum);
			} else if (a.length == 1) {
				rconnum = a[0].rconnum;
				callback(rconnum);
			} else {
				rconnum = a[a.length - 1].rconnum;
				callback(rconnum);

			}
		})
	},
	callSavetoask(username, callback) {
		module.exports.getinfodb('select prbid,hisopt,cptinfo from rdcthistory where username="' + username + '" and (hisopt="savetoask" or hisopt="rmsavetoask" or hisopt="mrmsavetoask")', function (a) {
			var indsta = [];
			for (var ia = 0; ia < a.length; ia++) {
				var chk = 0;
				for (var ib = 0; ib < indsta.length; ib++) {
					if (indsta[ib][0] == a[ia].prbid) {
						chk = 1;
						break;
					}
				}
				if (chk == 0) {
					indsta.push([a[ia].prbid, a[ia].cptinfo])
				}

			}

			var stalist = [];
			var cptlist = [];
			var lastval;
			for (var ia = 0; ia < indsta.length; ia++) {
				var numsta = 0;
				for (ib = 0; ib < a.length; ib++) {
					if (a[ib].prbid == indsta[ia][0]) {
						numsta += 1;
						lastval = a[ib].cptinfo;
					}
				}

				if (numsta % 2 == 1) {
					stalist.push(indsta[ia][0])
					cptlist.push(lastval);
				}
			}

			/*
			for(var ia=0 ;ia<a.length ;ia++){
				stalist.push(a[ia].prbid);
			}*/

			module.exports.prbsetv2(stalist, function (plist) {
				callback(stalist, plist, cptlist);
			});
		});
	},
	getPrbmulti(prbid) {
		var path = require('./prismpath.json');
		var prbpath = path.prismspam + prbid;
		var fs = require('fs');
		if (fs.existsSync(prbpath + '.js')) {
			var prbc = require(prbpath);
			var prbcont = prbc.spamprb('``');
			return prbcont;
		} else {
			return 0;
		}
	},
	R2toR1FreePicking(r3id, callback) {
		//module.exports.getinfodb('select * from rkconnect where conkind="rc21"',function(a){
		module.exports.getinfodb('select b.childcol as childcol from rkconnect as a join rkconnect as b on a.childcol=b.parentcol where a.parentcol="' + r3id + '" and a.conkind="rc32" and b.conkind="rc21"', function (a) {
			module.exports.getinfodb('select * from cptproblemset order by instructorder asc', function (b) {
				var indr1list = [];
				for (var ia = 0; ia < a.length; ia++) {
					var chk = 0;
					for (var ib = 0; ib < indr1list.length; ib++) {
						if (indr1list[ib] == a[ia].childcol) {
							chk = 1;
							break;
						}
					}
					if (chk == 0) {
						indr1list.push(a[ia].childcol)
					}
				}


				var freepicking = [];
				for (var ia = 0; ia < b.length; ia++) {
					var chk = 0;
					for (var ib = 0; ib < indr1list.length; ib++) {
						if (indr1list[ib] == b[ia].cptid) {
							chk = 1;
							break;
						}
					}
					if (chk == 0) {
						freepicking.push([b[ia].cptid, b[ia].listinfo, b[ia].prblist]);
					}
				}


				callback(freepicking);

			});

		});
	},
	applyLeadFilter(username, slotlist, callback) {

		//currentely activated cpt. 
		module.exports.getinfodb('select ft.childcol as cptid, ft.filterconid as filterconid from filterconnect as fl join filterconnect as ft on fl.childcol = ft.parentcol where fl.conkind="usertofilter" and fl.parentcol="' + username + '"', function (a) {
			//module.exports.getinfodb('select ft.childcol as cptid  from filterconnect as fl join filterconnect as ft on fl.childcol = ft.parentcol where fl.conkind="usertofilter" and fl.parentcol="'+username+'"',function(a){
			//linked from the past but not active yet
			module.exports.getinfodb('select fv.cptid,fv.prbset, fl.childcol as childcol from filterconnect as fl join filterr1vari as fv on fl.parentcol =fv.fr1id where fl.conkind="fru"', function (b) {
				//module.exports.getinfodb('select fv.cptid,fv.prbset from filterconnect as fl join filterr1vari as fv on fl.parentcol =fv.fr1id where fl.conkind="fru" and fl.childcol="'+username+'"',function(b){


				if (a.length != 0) {
					var cptidprbset = [];
					for (var ia = 0; ia < a.length; ia++) {
						var chk = 0;
						for (var ib = 0; ib < b.length; ib++) {
							if (a[ia].filterconid == b[ib].childcol) {
								chk = 1;
								break;
							}
						}
						if (chk == 1) {
							cptidprbset.push([b[ib].cptid, b[ib].prbset])
						}
					}



					var swap = function (array, i, j) {
						var temp = array[i];
						array[i] = array[j];
						array[j] = temp;
					}

					var sortind = function (array) {
						for (var i = 0; i < array.length; i++) {
							for (var j = 1; j < array.length; j++) {
								if (array[j - 1][1] > array[j][1]) {
									swap(array, j - 1, j);
								}
							}
						}
						return array;
					}


					var Nslotlist = [];
					for (var ia = 0; ia < slotlist.length; ia++) {
						for (var ib = 0; ib < cptidprbset.length; ib++) {
							if (slotlist[ia][4] == cptidprbset[ib][0]) {
								Nslotlist.push(slotlist[ia])

								//check whether the prb in the r1vari still exists at cptid of prb

								var allowedprbvec = [];
								var slotprblist = slotlist[ia][6].split(',');
								var cptprblist = cptidprbset[ib][1].split(',');
								var cptprborder = 0;

								for (var ic = 0; ic < cptprblist.length; ic++) {
									var chk = 0;
									for (var id = 0; id < slotprblist.length; id++) {
										if (slotprblist[id] == cptprblist[ic]) {
											chk = 1;
											break;
										}
									}
									if (chk == 1) {
										allowedprbvec.push([slotprblist[id], id])
									}
								}

								var nallowedprb = sortind(allowedprbvec);
								var allowedprbincptstr = '';
								for (var ic = 0; ic < nallowedprb.length; ic++) {
									if (ic == nallowedprb.length - 1) {
										allowedprbincptstr = allowedprbincptstr + nallowedprb[ic][0];
									} else {
										allowedprbincptstr = allowedprbincptstr + nallowedprb[ic][0] + ',';
									}
								}

								Nslotlist[Nslotlist.length - 1][6] = allowedprbincptstr;
							}
						}
					}

					callback(Nslotlist);
				} else {
					callback(slotlist);
				}
				/*
		
				var prbstr='';
				for(var ia=0; ia < cptidprbset.length; ia++){
					if(ia==cptidprbset.length-1){
						prbstr=prbstr+cptidprbset[ia][1];
					}else{
						prbstr=prbstr+cptidprbset[ia][1]+',';
					}
				}*/

			});
		});



	},
	getcptStructure(callback) {
		module.exports.getinfodb('select r3.r3id, r3.listinfo as r3listinfo, r2.r2id, r2.r2listinfo as r2listinfo,cpt.cptid as r1id, cpt.listinfo as r1listinfo, cpt.prblist as prblist from rkconnect as rk join r3list as r3 on rk.parentcol=r3.r3id join rkconnect as rk2 on rk.childcol=rk2.parentcol join r2list as r2 on r2.r2id=rk2.parentcol join cptproblemset as cpt on rk2.childcol=cpt.cptid order by r3.r3order, r2.r2order, rk2.rkorder', function (a) {


			var indr3set = [];
			for (var ia = 0; ia < a.length; ia++) {
				var chk = 0;
				for (var ib = 0; ib < indr3set.length; ib++) {
					if (indr3set[ib][0] == a[ia].r3id) {
						chk = 1;
						break;
					}
				}
				if (chk == 0) {
					indr3set.unshift([a[ia].r3id, a[ia].r3listinfo]);
				}
			}


			rootobj = [];
			for (var ia = 0; ia < indr3set.length; ia++) {
				var indr2set = [];
				rootobj[ia] = { r3id: indr3set[ia][0], r3listinfo: indr3set[ia][1], r2list: [] }
				for (var ib = 0; ib < a.length; ib++) {
					if (a[ib].r3id == indr3set[ia][0]) {
						var chk = 0;
						for (var ic = 0; ic < indr2set.length; ic++) {
							if (indr2set[ic][0] == a[ib].r2id) {
								chk = 1;
								break;
							}
						}
						if (chk == 0) {
							indr2set.push([a[ib].r2id, a[ib].r2listinfo])
						}


					}
				}

				for (var id = 0; id < indr2set.length; id++) {
					var indr1set = [];
					rootobj[ia].r2list[id] = { r2id: indr2set[id][0], r2listinfo: indr2set[id][1] };
					for (var ie = 0; ie < a.length; ie++) {
						if (a[ie].r2id == indr2set[id][0]) {
							var chk = 0;
							for (var ig = 0; ig < indr1set.length; ig++) {
								if (indr1set[ig][0] == a[ie].r1id) {
									chk = 1;
									break;
								}
							}
							if (chk == 0) {
								indr1set.push([a[ie].r1id, a[ie].r1listinfo, a[ie].prblist])
							}
						}
					}

					rootobj[ia].r2list[id].r1list = indr1set;

				}


			}
			callback(rootobj);

			/*
			var slotlist=[];
			for(var ib=0; ib<rootobj[0].r2list.length; ib++){
				for(var ic=0; ic<rootobj[0].r2list[ib].r1list.length; ic++){
					slotlist.push([rootobj[0].r3id,rootobj[0].r3listinfo,rootobj[0].r2list[ib].r2id,rootobj[0].r2list[ib].r2listinfo,rootobj[0].r2list[ib].r1list[ic][0],rootobj[0].r2list[ib].r1list[ic][1],rootobj[0].r2list[ib].r1list[ic][2]]);
				}
			}

			callback(slotlist);*/


		});



	},
	getMMTTconnection(callback) {


		var mmttconnectionstate = [];
		module.exports.getinfodb('select parentcol, childcol, conopt from mmttconnection', function (a) {
			var indmentor = [];
			for (var ia = 0; ia < a.length; ia++) {
				var chk = 0;
				for (var ib = 0; ib < indmentor.length; ib++) {
					if (indmentor[ib] == a[ia].parentcol && a[ia].childcol != null) {
						chk = 1;
						break;
					}
				}
				if (chk == 0) {
					indmentor.push(a[ia].parentcol)
				}
			}



			var allocatedmentorid = [];

			for (var ia = 0; ia < indmentor.length; ia++) {
				for (ib = 0; ib < a.length; ib++) {
					if (a[ib].parentcol == indmentor[ia] && a[ib].conopt == 1) {
						allocatedmentorid.push([a[ib].childcol, a[ib].parentcol])
					}
				}

			}

			for (ia = 0; ia < indmentor.length; ia++) {
				var selfmentee = [];
				for (var ic = 0; ic < a.length; ic++) {
					if (a[ic].conopt == 0 && indmentor[ia] == a[ic].parentcol) {
						selfmentee.push([a[ic].childcol, indmentor[ia]]);
					}
				}

				for (var id = 0; id < selfmentee.length; id++) {
					var chk = 0;
					for (var ie = 0; ie < a.length; ie++) {
						if (selfmentee[id][0] == a[ie].childcol && a[ie].conopt == 1) {
							chk = 1;
							break;
						}
					}
					if (chk == 0) {
						allocatedmentorid.push([selfmentee[id][0], indmentor[ia]])
					}
				}


			}

			for (ia = 0; ia < indmentor.length; ia++) {
				var wrsslist = [];
				for (ib = 0; ib < a.length; ib++) {
					if (a[ib].parentcol == indmentor[ia] && a[ib].conopt == 1) {
						wrsslist.push({ username: a[ib].childcol, selfmentor: 0, menteesocketid: '', menteeconnectionstate: '', wrssmentorsocketid: '', wrssmentorconnectionstate: '', selfmentorstate: 1 });
					}
				}


				var selfmentee = [];
				for (var ic = 0; ic < a.length; ic++) {
					if (a[ic].conopt == 0 && indmentor[ia] == a[ic].parentcol) {
						selfmentee.push(a[ic].childcol);
					}
				}

				for (var id = 0; id < selfmentee.length; id++) {
					var chk = 0;
					for (var ie = 0; ie < a.length; ie++) {
						if (selfmentee[id] == a[ie].childcol && a[ie].conopt == 1) {
							chk = 1;
							break;
						}
					}
					if (chk == 0) {
						wrsslist.push({ username: selfmentee[id], selfmentor: 1, menteesocketid: '', menteeconnectionstate: '', wrssmentorsocketid: '', wrssmentorconnectionstate: '', selfmentorstate: 1 });
					}
					//wrsslist.push({username:selfmentee[id], selfmentor:1, wrssmentorsocketid:'', wrssmentorconnectionstate:''});
				}



				mmttconnectionstate[ia] = { mentorid: indmentor[ia], mentorsocketid: '', connectionstate: 0, wrssmenteelist: wrsslist, menteelist: [] }
				//mmttconnectionstate[ia]={mentorid:indmentor[ia],mentorsocketid:'',connectionstate:0,wrssmentor:{wrssmentorconnectionstate:0, wrssmentorsocketid:''},menteelist:[]}
				for (var ib = 0; ib < a.length; ib++) {
					if (a[ib].parentcol == indmentor[ia] && a[ib].conopt == 0) {
						for (var ih = 0; ih < allocatedmentorid.length; ih++) {
							if (allocatedmentorid[ih][0] == a[ib].childcol) {
								if (allocatedmentorid[ih][1] == indmentor[ia]) {
									mmttconnectionstate[ia].menteelist.push({ username: a[ib].childcol, selfmentor: 1, menteesocketid: '', connectionstate: 0, wrssmentorconnectionstate: 0, wrssmentorsocketid: '', allocatedmentorid: allocatedmentorid[ih][1], selfmentorstate: 1 });
								} else {
									mmttconnectionstate[ia].menteelist.push({ username: a[ib].childcol, selfmentor: 0, menteesocketid: '', connectionstate: 0, wrssmentorconnectionstate: 0, wrssmentorsocketid: '', allocatedmentorid: allocatedmentorid[ih][1], selfmentorstate: 1 });
								}
								break;

							}
						}
					}
				}
			}


			var possiblecomb = [];

			for (var ia = 0; ia < mmttconnectionstate.length; ia++) {
				for (var ib = 0; ib < mmttconnectionstate[ia].menteelist.length; ib++) {
					possiblecomb.push([mmttconnectionstate[ia].mentorid, mmttconnectionstate[ia].menteelist[ib].username]);
				}
			}

			for (var ia = 0; ia < mmttconnectionstate.length; ia++) {
				for (var ib = 0; ib < mmttconnectionstate[ia].wrssmenteelist.length; ib++) {
					var chk = 0;
					for (var ic = 0; ic < possiblecomb.length; ic++) {
						if (possiblecomb[ic][0] == mmttconnectionstate[ia].mentorid && possiblecomb[ic][1] == mmttconnectionstate[ia].wrssmenteelist[ib].username) {
							chk = 1;
							break;
						}
					}
					if (chk == 0) {
						possiblecomb.push([mmttconnectionstate[ia].mentorid, mmttconnectionstate[ia].wrssmenteelist[ib].username])
					}
				}
			}



			callback(mmttconnectionstate, possiblecomb);


		});

		/*for backup
		var mmttconnectionstate=[];
		module.exports.getinfodb('select parentcol, childcol from mmttconnection',function(a){
			var indmentor=[];
			for(var ia=0; ia<a.length; ia++){
				var chk=0;
				for(var ib=0; ib<indmentor.length; ib++){
					if(indmentor[ib]==a[ia].parentcol){
						chk=1;
						break;
					}
				}
				if(chk==0){
					indmentor.push(a[ia].parentcol)
				}
			}
	
			for(ia=0; ia<indmentor.length; ia++){
				mmttconnectionstate[ia]={mentorid:indmentor[ia],mentorsocketid:'',connectionstate:0,menteelist:[]}
				//mmttconnectionstate[ia]={mentorid:indmentor[ia],mentorsocketid:'',connectionstate:0,wrssmentor:{wrssmentorconnectionstate:0, wrssmentorsocketid:''},menteelist:[]}
				for(var ib=0; ib<a.length; ib++){
					if(a[ib].parentcol==indmentor[ia]){
						mmttconnectionstate[ia].menteelist.push({username:a[ib].childcol,menteesocketid:'', connectionstate:0,wrssmentorconnectionstate:0, wrssmentorsocketid:''});
					}
				}
			}
		
			callback(mmttconnectionstate);
		});*/
	},
	instantPrbstoretotable(slotlist, users) {
		console.log(slotlist);
		function RandomString(length, opt) {
			if (!opt || opt == 0) {
				var text = '';
				var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
				for (var ia = 0; ia < length; ia++) {
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				return text;
			}
		}

		var randomstr = RandomString(10, 0);

		var async = require('async');
		var count = 0;
		async.whilst(
			function (callbackfunction) {
				callbackfunction(null, count < slotlist.length)
				//return count<slotlist.length
			},
			function (cback) {
				module.exports.getinfodb('insert into  mmttinstantprb (instantid,fcptid, prblist, createdate, mentorid, username) values ("' + randomstr + '","' + slotlist[count][4] + '","' + slotlist[count][6] + '","' + module.exports.nodetime() + '","' + users[0] + '","' + users[1] + '")', function (a) {
					count++;
					cback(null);
				});
			},
			function (err) {
				if (!err) {
				} else {
					console.log('we encountered errors at prbset in serverflow.js', err);
				}
			});
	}


}

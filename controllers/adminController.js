const admin = require("../models/admin.js");
const batch = require("../batch.js");

//admin page
const adminIndex = async function(req, res) {
	//session이 존재하면 바로 admin.ejs로 이동
	console.log(req.session);
	if(req.session.userid) {
		res.render("admin", {});
	} else {
		res.render("adminPassword", {});
	}
};

//admin login
const adminLogin = async function(req, res) {
	
	var sess = req.session;
	var username = "admin";
	var password = req.param("password");
	
	var loginResult = await admin.adminLogin([username, password]);

	var result = {};
	if(loginResult.length == 1) {
		result["success"] = 1;
		sess.userid = loginResult[0]["id"];
		sess.name = loginResult[0]["name"];//save user
		console.log(sess);
		res.render("admin", {
			loginResult: result
		});
	} else {
		result["success"] = 0;
		result["error"] = "login failed";
		res.render("adminPassword", {
			loginResult: result
		});
	}

};

//admin logout
const adminLogout = async function(req, res) {
	var sess = req.session;
	if(sess.userid) {
		req.session.destroy(function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("logout success");
				res.redirect("/");
			}
		});
	} else {
		res.redirect("/");
	}
};

//statistics - visitors
const statVisit = async function(req, res) {
	var data = {
		data: await admin.statVisit()
	}
	res.send(data);
};

//statistics - viewCount
const statViewCount = async function(req, res) {
	var data = {
		data: await admin.statViewCount()
	}
	res.send(data);
};

//batch
const runbatch = async function(req, res) {
	//TODO : return
	var retStr = "success";
	await batch.scraping();
	await res.send(retStr);
};

//export controller functions
exports.adminIndex = adminIndex;
exports.adminLogin = adminLogin;
exports.adminLogout = adminLogout;
exports.statVisit = statVisit;
exports.statViewCount = statViewCount;
exports.runbatch = runbatch;

/*
DONE : ADMIN - LOGIN/LOGOUT
1. [HOST]/admin에 접속한다.
1-a. 세션이 있으면 admin 메뉴페이지를 보여준다. - done
1-b. 세션이 없으면 비밀번호 입력 페이지를 보여준다. - done
2. 비밀번호 입력 후 일치하면, 세션 생성하고, admin 메뉴페이지로 이동한다. - done
3. admin페이지에서 로그아웃하면, 세션 삭제하고, adminPassword.ejs로 이동한다. - done
TODO : ADMIN - STATISTICS
1. 일별 접속자수(등락을 볼 수 있도록 바+선차트)
2. 포스트별 조회수 랭킹
*/
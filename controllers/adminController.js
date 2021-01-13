var admin = require("../models/admin.js");

//admin page
const adminIndex = async function(req, res) {
	res.render("adminPassword", {});
}

//admin login
const adminLogin = async function(req, res) {
	console.log(req.param("password"));
	res.send(req.param("password"));
}
//export controller functions
exports.adminIndex = adminIndex;
exports.adminLogin = adminLogin;
/*
TODO : ADMIN
1. [HOST]/admin에 접속한다.
1-a. 세션이 있으면 admin 메뉴페이지를 보여준다.
1-b. 세션이 없으면 비밀번호 입력 페이지를 보여준다.
2. 비밀번호 입력 후 일치하면, 세션 생성하고, admin 메뉴페이지로 이동한다.
*/
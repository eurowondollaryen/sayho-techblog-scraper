/*
admin.js
관리자 로그인 및 백오피스에 필요한 정보들을 조회한다.

*/
const pool = require('../db.js').pool;
exports.adminLogin = async function(parameters) {
	var list = [];
	await pool.query(`SELECT ID, NAME
	FROM ICTUSER
	WHERE ID = $1
	AND PWD = $2`, parameters)
	.then(function(res) { list = res.rows;});
	return list;
};
/*
blog.js
기술블로그 목록을 핸들링한다.
TODO : 현재는 하드코딩되어있지만, DB에서 가져오기
*/
//const { Pool } = require('pg');
//const pool = new Pool();
const pool = require('../db.js').pool;
exports.getBlogList = async function() {
	var rows = [];
	await pool.query("SELECT * FROM ICTBLOGS", (err, res) => {
		if(err) {
			return console.error("Error executing query", err.stack);
		}
		rows = res.rows;
		console.log(rows[0]);
	});
	return rows;
};
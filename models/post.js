/*
post.js
블로그 포스트 목록을 핸들링한다.
TODO : 현재는 하드코딩되어있지만, DB에서 가져오기
*/
const pool = require('../db.js').pool;
exports.getPostList = async function(parameters) {
	var list = [];
	await pool.query("SELECT POST_SEQ, TITLE, POST_URL,"
	+ " SUBTITLE, AUTHOR, NOTE_DTL, INST_DT FROM ICTPOSTS WHERE BLOG_ID = (SELECT BLOG_ID FROM ICTBLOGS WHERE ROUTE = $1)", parameters)
	.then(function(res) { list = res.rows;});
	return list;
}
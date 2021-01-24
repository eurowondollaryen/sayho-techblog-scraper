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

exports.statVisit = async function() {
	var list = [];
	await pool.query(`
	SELECT DT, COUNT(1) CNT
    FROM (SELECT IP, ROUTE, SUBSTR(TIMESTAMP,1,8) DT
          FROM ICTVISITLOG
          GROUP BY IP, ROUTE, SUBSTR(TIMESTAMP,1,8)
          ) A
    GROUP BY DT
	`).then(function(res) { list = res.rows; });
	return list;
};

exports.statViewCount = async function() {
	var list = [];
	await pool.query(`
	SELECT ROW_NUMBER() OVER(ORDER BY A.CNT DESC, A.POST_SEQ ASC) ROWNUM, (SELECT TITLE_KR FROM ICTBLOGS X WHERE X.BLOG_ID = B.BLOG_ID) BLOG_NAME, B.TITLE TITLE, B.POST_URL POST_URL, A.CNT CNT
	FROM (SELECT COUNT(1) CNT, POST_SEQ
			FROM ICTVIEWLOG
			GROUP BY POST_SEQ
			) A LEFT OUTER JOIN
			(SELECT BLOG_ID, POST_SEQ, TITLE, POST_URL
			FROM ICTPOSTS) B
	ON A.POST_SEQ = B.POST_SEQ
	WHERE A.POST_SEQ IS NOT NULL
	ORDER BY A.CNT DESC, A.POST_SEQ ASC
	`).then(function(res) { list = res.rows; });
	return list;
};
/*
query.js
검색 결과를 반환한다.
ORDER BY 기준 : 매일 순서대로 크롤링하여 INSERT 하므로, 새 글이 올라오면 POST_SEQ는 뒤에 있지만, INST_DT가 가장 최신이다.
그러므로 ORDER BY INST_DT DESC, POST_SEQ ASC로 하여, 갱신일별, 포스트 순서대로 조회한다.
*/
const pool = require('../db.js').pool;
exports.listGet = async function(parameters) {
	var list = [];
	await pool.query(`SELECT ROWNUM, POST_SEQ, TITLE
	, POST_URL, SUBTITLE, AUTHOR
	, NOTE_DTL, INST_DT, NEWPOST
	, VIEWCOUNT
FROM (SELECT ROW_NUMBER() OVER(ORDER BY INST_DT DESC, POST_SEQ ASC) ROWNUM
		  , POST_SEQ, TITLE, POST_URL
		  , SUBTITLE, AUTHOR, NOTE_DTL, INST_DT
		  , CASE WHEN INST_DT = TO_CHAR(NOW(), 'YYYYMMDD') THEN '1' ELSE '0' END NEWPOST 
		  , (SELECT COUNT(1) FROM (SELECT DISTINCT POST_SEQ, IP FROM ICTVIEWLOG) A WHERE A.POST_SEQ = T.POST_SEQ) VIEWCOUNT
   FROM ICTPOSTS T
   WHERE TITLE LIKE '%' || $1 || '%'
   ) A
ORDER BY ROWNUM`, parameters)
	.then(function(res) { list = res.rows;});
	return list;
}

exports.listPost = async function(parameters) {
	console.log(parameters);
	var list = [];
	await pool.query(`SELECT ROWNUM, POST_SEQ, TITLE
	, POST_URL, SUBTITLE, AUTHOR
	, NOTE_DTL, INST_DT, NEWPOST
	, VIEWCOUNT
FROM (SELECT ROW_NUMBER() OVER(ORDER BY INST_DT DESC, POST_SEQ ASC) ROWNUM
		  , POST_SEQ, TITLE, POST_URL
		  , SUBTITLE, AUTHOR, NOTE_DTL, INST_DT
		  , CASE WHEN INST_DT = TO_CHAR(NOW(), 'YYYYMMDD') THEN '1' ELSE '0' END NEWPOST 
		  , (SELECT COUNT(1) FROM (SELECT DISTINCT POST_SEQ, IP FROM ICTVIEWLOG) A WHERE A.POST_SEQ = T.POST_SEQ) VIEWCOUNT
   FROM ICTPOSTS T
   WHERE TITLE LIKE '%' || $1 || '%'
   ) A
WHERE ROWNUM BETWEEN $2 + 1 AND $2 + 10
ORDER BY ROWNUM`, parameters)
	.then(function(res) { list = res.rows;});
	return list;
}
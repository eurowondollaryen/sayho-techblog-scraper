/*
post.js
블로그 포스트 목록을 핸들링한다.
ORDER BY 기준 : 매일 순서대로 크롤링하여 INSERT 하므로, 새 글이 올라오면 POST_SEQ는 뒤에 있지만, INST_DT가 가장 최신이다.
그러므로 ORDER BY INST_DT DESC, POST_SEQ ASC로 하여, 갱신일별, 포스트 순서대로 조회한다.
*/
const pool = require("../db.js").pool;
exports.getPostList = async function (parameters) {
  var list = [];
  await pool
    .query(
      "SELECT POST_SEQ, TITLE, POST_URL," +
        " SUBTITLE, AUTHOR, NOTE_DTL, INST_DT" +
        ", CASE WHEN INST_DT = TO_CHAR(NOW(), 'YYYYMMDD') THEN '1' ELSE '0' END NEWPOST " +
        ", (SELECT COUNT(1) FROM (SELECT DISTINCT POST_SEQ, IP FROM ICTVIEWLOG) A WHERE A.POST_SEQ = T.POST_SEQ) VIEWCOUNT" +
        " FROM ICTPOSTS T WHERE BLOG_ID = (SELECT BLOG_ID FROM ICTBLOGS WHERE ROUTE = $1) ORDER BY INST_DT DESC, POST_SEQ ASC",
      parameters
    )
    .then(function (res) {
      list = res.rows;
    });
  return list;
};

//scroll load
exports.postPostList = async function (parameters) {
  var list = [];
  await pool
    .query(
      "SELECT ROWNUM, POST_SEQ, TITLE, POST_URL, SUBTITLE, AUTHOR, NOTE_DTL, INST_DT\n" +
        ", (SELECT COUNT(1) FROM (SELECT DISTINCT POST_SEQ, IP FROM ICTVIEWLOG) A WHERE A.POST_SEQ = T.POST_SEQ) VIEWCOUNT " +
        "FROM (SELECT (ROW_NUMBER() OVER(ORDER BY INST_DT DESC, POST_SEQ ASC)) AS ROWNUM, POST_SEQ, TITLE, POST_URL, SUBTITLE, AUTHOR, NOTE_DTL, INST_DT\n" +
        ", CASE WHEN INST_DT = TO_CHAR(NOW(), 'YYYYMMDD') THEN '1' ELSE '0' END NEWPOST " +
        "      FROM ICTPOSTS\n" +
        "      WHERE BLOG_ID = (SELECT BLOG_ID FROM ICTBLOGS WHERE ROUTE = $1)" +
        ") T\n" +
        "WHERE T.ROWNUM BETWEEN $2 + 1 AND $2 + 10 ORDER BY INST_DT DESC, POST_SEQ ASC",
      parameters
    )
    .then(function (res) {
      list = res.rows;
    });
  return list;
};

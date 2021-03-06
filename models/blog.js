/*
blog.js
기술블로그 목록을 핸들링한다.
TODO : 현재는 하드코딩되어있지만, DB에서 가져오기
*/
//const { Pool } = require('pg');
//const pool = new Pool();
const pool = require("../db.js").pool;
exports.getBlogList = async function () {
  var result = [];
  //console.log("[blog.js][getBlogList] execute query");
  await pool
    .query(
      "SELECT BLOG_ID, TITLE_KR, TITLE_EN, ROUTE, BASE_URL" +
        ", (SELECT COUNT(*) FROM ICTPOSTS X WHERE X.BLOG_ID = A.BLOG_ID) CNT" +
        ", (SELECT CASE WHEN MAX(INST_DT) = TO_CHAR(NOW(),'YYYYMMDD') THEN '1' ELSE '0' END FROM ICTPOSTS X WHERE X.BLOG_ID = A.BLOG_ID) NEWPOST" +
        " FROM ICTBLOGS A"
    )
    .then(function (res) {
      result = res.rows;
    });
  return result;
};

exports.getBlogId = async function (parameters) {
  var result = [];
  //console.log("[blog.js][getBlogId] execute query");
  await pool
    .query(
      "SELECT TITLE_KR, TITLE_EN, BASE_URL FROM ICTBLOGS WHERE ROUTE = $1",
      parameters
    )
    .then(function (res) {
      result = res.rows;
    });
  return result;
};

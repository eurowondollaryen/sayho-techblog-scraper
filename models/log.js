/*
log.js
로그를 핸들링한다.
*/
const pool = require('../db.js').pool;

//insert a log
exports.create = async function(parameters) {
	await pool.query("INSERT INTO ICTVIEWLOG(SEQ, POST_SEQ, DTL_NOTE, IP, TIMESTAMP) "
	+ "VALUES(NEXTVAL('SQ_ICTVIEWLOG'), $1, $2, $3, TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'))", parameters);
}
/*
log.js
로그를 핸들링한다.
*/
const pool = require('../db.js').pool;

//INSERT VIEW LOG
exports.create = async function(parameters) {
	await pool.query("INSERT INTO ICTVIEWLOG(SEQ, POST_SEQ, DTL_NOTE, IP, TIMESTAMP) "
	+ "VALUES(NEXTVAL('SQ_ICTVIEWLOG'), $1, $2, $3, TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'))", parameters);
};

//INSERT VISIT LOG
exports.visit = async function(parameters) {
	await pool.query("INSERT INTO ICTVISITLOG(SEQ, IP, ROUTE, TIMESTAMP) "
	+ "VALUES(NEXTVAL('SQ_ICTVISITLOG'), $1, $2, TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'))", parameters);
};
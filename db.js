/*
db.js
db configuration 정보가 들어있다.
postgresql metadata table 리스트
https://www.postgresql.org/docs/9.1/catalogs.html
*/
const { Pool } = require('pg');

//for heroku

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

//for local
/*
const pool = new Pool({
	user : "postgres",
	host : "127.0.0.1",
	database : "postgres",
	password : "root##3804",
	port : "5432"
});
*/
exports.connect = function(){
	//pool error check
	pool.on("error", (err, client) => {
		console.error("Unexpected error on idle client", err);
		process.exit(-1);
	});
	
	pool.connect((err, client, release) => {
		if(err) {
			return console.error("error acquiring client", err.stack);
		}
		client.query("SELECT NOW()", (err, res) => {
			release();
			if(err) {
				console.log(err.stack);
			} else {
				console.log(res.rows[0]);
			}
		});
	});
};
exports.pool = pool;

/*
1) get postgresql db name
: \l
: select datname from pg_database;

2) show table list in postgresql
select * from pg_tables where schemaname = 'public';
*/
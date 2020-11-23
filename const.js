const dbConfig = {
	user : "postgres",
	host : "127.0.0.1",
	database : "postgres",
	password : "root##3804",
	port : "5432"
};
module.exports = dbConfig;
/*
1) get postgresql db name
: \l
: select datname from pg_database;

2) show table list in postgresql
select * from pg_tables where schemaname = 'public';
*/
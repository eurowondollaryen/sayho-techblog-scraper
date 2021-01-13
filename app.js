var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");

//2021.01.13 로그인을 위한 session 추가
var session = require("express-session");
//body-parser : FOR HANDLING POST DATA
const bodyParser = require("body-parser");

//axios : get html from url
//cheerio : use queryselector
//npm install --save axios cheerio
const axios = require("axios");
const cheerio = require("cheerio");

//selenium
const {Builder, By, Key, until} = require("selenium-webdriver");

//node-schedule
//매일 자정에 scraping작업을 한다.
//reference : https://bblog.tistory.com/307
var schedule = require("node-schedule");
const batch = require("./batch.js");
var scheduler = schedule.scheduleJob("00 00 00 * * *", async function() {
	await batch.scraping();
});

//port set
const port = process.env.PORT || 3000;

//ejs init
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//use public directory
app.use(express.static(path.join(__dirname,'/public')));

//use session 2021.01.13 로그인을 위해 session 추가
app.use(session({
    secret: "qwe123",
    resave: false,
    saveUninitialized: true
}));

// CORS
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//use body-parser
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//run server
app.listen(port, function(){
    console.log('Server is running on  port ' + port);
});

/*
의문점 : selenium을 활용하려면 webdriver가 필요한데,
이거 heroku에서 세팅 가능한지? putty같은걸로 접속 되는지 확인해보기
https://devcenter.heroku.com/articles/heroku-cli-commands
*/

/******* DATABASE CONNECTION START *******/
/*
node js - pg => pool, client 차이는?
spring에서 db connection pool 사용하는 이유와 같다.
재접속 필요없으므로
https://node-postgres.com/features/pooling
*/

//db setting
require("./db.js").connect();

//for testing body-parser and express-session
/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));
//for what?
var router = require('./router/main')(app, fs);
*/

/*
routing method... what is better method??
//assigning route function into module.exports.....why?

module.exports = function(app, fs) {
    app.get("/", function(req, res) {
        res.render("index", {
            title: "hello world",
            length: 123
        });
    });
}

*/
/*
Selenium
npm install --save selenium-webdriver

selenium documentation
https://www.selenium.dev/documentation/en/getting_started_with_webdriver/locating_elements/
*/


require("./router.js").route(app);

//FOR TESTING BATCH LOGIC
app.get("/runbatch", async function(req, res) {
	await batch.scraping();
});

app.get("*", (req, res) => {
    res.end('<head><title>404</title></head><body><h1>404 Error!</h1></body>');
});
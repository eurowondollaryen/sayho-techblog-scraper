var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
//axios : get html from url
//cheerio : use queryselector
/* 
npm install --save axios cheerio
*/
const axios = require("axios");
const cheerio = require("cheerio");
/*
body-parser : FOR HANDLING POST DATA
express-session : SESSION MANAGEMENT
*/
//url global object
const global_urls = [{
    "title_kr" : "우아한형제들",
    "title_en" : "wooahan",
    "base_url" : "https://woowabros.github.io/"
}];
//port set
const port = process.env.PORT || 3000;

//ejs init
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//use public directory
app.use(express.static(path.join(__dirname,'/public')));

//run server
app.listen(port, function(){
           console.log('Server is running on  port ' + port);
});

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
//routing set
app.get("/", function(req, res) {
    //page rendering method 1. read file and render its text (very primitive)
    /*
    fs.readFile("index.html", function(error, data) {
        if(error) {
            console.log(error);
        }
        else {
            res.writeHead(200,{"Content-Type":"text/html"});//set headtype
            res.end(data);
        }
    });
    */
    //page rendering method 2. use render(EJS view resolver)
    res.render("index", {
        list : global_urls
    });
});

//wooahan web scrapping
/*
load : 인자로 html 문자열을 받아 cheerio 객체를 반환합니다.
children : 인자로 html selector를 문자열로 받아 cheerio 객체에서 선택된 html 문자열에서 해당하는 모든 태그들의 배열을 반환합니다.
each : 인자로 콜백 함수를 받아 태그들의 배열을 순회 하면서 콜백함수를 실행합니다.
find : 인자로 html selector 를 문자열로 받아 해당하는 태그를 반환합니다.
*/
app.get("/get/wooahan", function(req, res) {
    const getHtml = async () => {
        try {
            return await axios.get(global_urls[0]["base_url"]);//global url array
        } catch (error) {
            console.error(error);
        }
    };

    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);//cheerio init
        const $bodyList = $("div.list").children("div.list-module");

        $bodyList.each(function(i, elem) {
            ulList[i] = {
                author: $(this).find("span.post-meta").text(),
                url: global_urls[0]["base_url"] + $(this).find("a").attr("href"),
                title: $(this).find("a").children("h2.post-link").text(),
                subtitle: $(this).find("a").children("p.post-description").text()
            };
        });
        const data = ulList.filter(n => n.title);
        return data;
    }).then(data => {
        res.render("wooahan", {
            title: "우아한형제들",
            list: data
        });
    });
});

app.get("*", (req, res) => {
    res.end('<head><title>404</title></head><body><h1>404 Error!</h1></body>');
});
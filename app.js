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
    "base_url" : "https://woowabros.github.io"
}, {
	"title_kr" : "네이버(미구현)",
    "title_en" : "naver",
    "base_url" : "https://d2.naver.com/home"
}, {
	"title_kr" : "쿠팡(미구현)",
    "title_en" : "coupang",
    "base_url" : "https://medium.com/coupang-tech/technote/home"
}, {
	"title_kr" : "스포카",
    "title_en" : "spoqa",
    "base_url" : "https://spoqa.github.io/"
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
        console.log(ulList);
        const data = ulList.filter(n => n.title);
        return data;
    }).then(data => {
        res.render("wooahan", {
            title: "우아한형제들",
            list: data
        });
    });
});

app.get("/get/spoqa", function(req, res) {
    const getHtml = async () => {
        try {
        	console.log("connecting to " + global_urls[3]["base_url"] + "...");
            return await axios.get(global_urls[3]["base_url"]);//global url array
        } catch (error) {
            console.error(error);
        }
    };

    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);//cheerio init
        const $bodyList = $("ul.posts").children("li.post-item").children("div.post-author-info");
        
        $bodyList.each(function(i, elem) {
            ulList[i] = {
                url: global_urls[3]["base_url"] + $(this).find("h2.post-title").find("a").attr("href"),
                title: $(this).find("h2.post-title").find("a").find("span.post-title-words").text(),
                subtitle: $(this).find("p.post-description").text()
            };
        });
        console.log(ulList);
        const data = ulList.filter(n => n.title);
        return data;
    }).then(data => {
        res.render("spoqa", {
            title: "스포카",
            list: data
        });
    });
});

/* 현재 네이버, 쿠팡은 스크래핑 안됨.
페이지 로드 후 포스트를 다이나믹하게 불러오기 때문인 것으로 추정됨.*/
//naver web scrapping(미완)
/*
app.get("/get/naver", function(req, res) {
    const getHtml = async () => {
        try {
            return await axios.get(global_urls[1]["base_url"]);//global url array
        } catch (error) {
            console.error(error);
        }
    };

    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);//cheerio init
        console.log(html.data);
        const $bodyList = $("div.contents").children("div.post_article").children("div.cont_post");
        $bodyList.each(function(i, elem) {
            ulList[i] = {
                url: global_urls[1]["base_url"] + $(this).find("h2").find("a").attr("href"),
                title: $(this).find("h2").find("a").text(),
                subtitle: $(this).find("a.post_txt_wrap").children("div.post_txt").text()
            };
        });
        console.log(ulList);
        const data = ulList.filter(n => n.title);
        return data;
    }).then(data => {
        res.render("naver", {
            title: "네이버",
            list: data
        });
    });
});

//coupang
app.get("/get/coupang", function(req, res) {
    const getHtml = async () => {
        try {
        	console.log("connecting to " + global_urls[2]["base_url"] + "...");
            return await axios.get(global_urls[2]["base_url"]);//global url array
        } catch (error) {
            console.error(error);
        }
    };

    getHtml().then(html => {
        let ulList = [];
        console.log(html.data);

        const $ = cheerio.load(html.data);//cheerio init
        const $bodyList = $("section.u-marginTop30").children("div.row");
        
        $bodyList.each(function(i, elem) {
        	console.log("loop " + i + "" + $(this).text());
            ulList[i] = {
                url: global_urls[1]["base_url"] + $(this).find("h2").find("a").attr("href"),
                title: $(this).find("h2").find("a").text(),
                subtitle: $(this).find("a.post_txt_wrap").children("div.post_txt").text()
            };
        });
        const data = ulList.filter(n => n.title);
        return data;
    }).then(data => {
        res.render("coupang", {
            title: "쿠팡",
            list: data
        });
    });
});
*/
app.get("*", (req, res) => {
    res.end('<head><title>404</title></head><body><h1>404 Error!</h1></body>');
});
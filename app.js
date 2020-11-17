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
//TODO : VCNC (http://engineering.vcnc.co.kr/) 추가하기
//TODO : React.js 활용하기
//url global object
const global_urls = [{
    "title_kr" : "우아한형제들",
    "title_en" : "wooahan",
    "base_url" : "https://woowabros.github.io"
}, {
	"title_kr" : "네이버",
    "title_en" : "naver",
    "base_url" : "https://d2.naver.com/home"
}, {
	"title_kr" : "쿠팡",
    "title_en" : "coupang",
    "base_url" : "https://medium.com/coupang-tech/technote/home"
}, {
	"title_kr" : "스포카",
    "title_en" : "spoqa",
    "base_url" : "https://spoqa.github.io/"
}, {
    "title_kr" : "라인",
    "title_en" : "line",
    "base_url" : "https://engineering.linecorp.com/ko/blog/"
}, {
    "title_kr" : "구글",
    "title_en" : "google",
    "base_url" : "https://developers.googleblog.com/"
}, {
    "title_kr" : "NHN",
    "title_en" : "nhn",
    "base_url" : "https://meetup.toast.com/"
}, {
	"title_kr" : "뱅크샐러드",
	"title_en" : "banksalad",
	"base_url" : "https://blog.banksalad.com/tech/"
}, {
	"title_kr" : "레진코믹스",
	"title_en" : "lezhin",
	"base_url" : "https://tech.lezhin.com/"
}, {
	"title_kr" : "카카오",
	"title_en" : "kakao",
	"base_url" : "https://tech.kakao.com/blog/"
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

/*
Selenium
npm install --save selenium-webdriver

selenium documentation
https://www.selenium.dev/documentation/en/getting_started_with_webdriver/locating_elements/
*/

const {Builder, By, Key, until} = require("selenium-webdriver");




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

//naver
app.get("/get/naver", function(req, res) {
	//selenium
	(async function example() {
		var data = [];
		let driver = await new Builder().forBrowser('chrome').build();
		try {
			// Navigate to Url
			await driver.get(global_urls[1]["base_url"]);
			//wait till loaded
			await driver.wait(until.elementLocated(By.css('div.contents>div.post_article>div.cont_post')), 10000);
			
			let elements = await driver.findElements(By.css('div.contents>div.post_article>div.cont_post'));
			let count = 0;
			console.log(elements.length);
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.findElement(By.css("h2>a")).getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("h2>a")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("a.post_txt_wrap>div.post_txt")).getText();
			}
		}
		finally{
			driver.quit();
			res.render("naver", {
				title: "네이버",
				list: data
			});
		}
	})();
});

//coupang
app.get("/get/coupang", function(req, res) {
	//selenium
	(async function example() {
		var data = [];
		let driver = await new Builder().forBrowser('chrome').build();
		try {
			// Navigate to Url
			await driver.get(global_urls[2]["base_url"]);
			//wait till loaded
			await driver.wait(until.elementLocated(By.css('section.u-marginTop30>div.row>div.col>div.col')), 10000);
			
			let elements = await driver.findElements(By.css('section.u-marginTop30>div.row>div.col>div.col'));
			let count = 0;
			console.log(elements.length);
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.findElement(By.css("a")).getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("a>h3>div")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("div>div")).getText();
			}
		}
		finally{
			driver.quit();
			res.render("coupang", {
				title: "쿠팡",
				list: data
			});
		}
	})();
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

app.get("/get/line", function(req, res) {
    const getHtml = async () => {
        try {
            console.log("connecting to " + global_urls[4]["base_url"] + "...");
            return await axios.get(global_urls[4]["base_url"]);//global url array
        } catch (error) {
            console.error(error);
        }
    };

    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);//cheerio init
        const $bodyList = $("div#post-list").children("article.post").children("div.article-inner");
        
        $bodyList.each(function(i, elem) {
            ulList[i] = {
                url: $(this).find("header.entry-header").find("div.entry-header-text-top").find("h2.entry-title").find("a").attr("href"),
                title: $(this).find("header.entry-header").find("div.entry-header-text-top").find("h2.entry-title").find("a").text(),
                subtitle: $(this).find("header.entry-content").find("div.entry-summary").find("p").text()
            };
        });
        console.log(ulList);
        const data = ulList.filter(n => n.title);
        return data;
    }).then(data => {
        res.render("line", {
            title: "라인",
            list: data
        });
    });
});

app.get("/get/google", function(req, res) {
    const getHtml = async () => {
        try {
            console.log("connecting to " + global_urls[5]["base_url"] + "...");
            return await axios.get(global_urls[5]["base_url"]);//global url array
        } catch (error) {
            console.error(error);
        }
    };

    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);//cheerio init
        const $bodyList = $("div.Blog").children("div.post");
        
        $bodyList.each(function(i, elem) {
            ulList[i] = {
                url: $(this).find("h2.title").find("a").attr("href"),
                title: $(this).find("h2.title").find("a").text(),
                date: $(this).find("div.post-header").find("div.published").find("span.publishdate").text()
            };
        });
        console.log(ulList);
        const data = ulList.filter(n => n.title);
        return data;
    }).then(data => {
        res.render("google", {
            title: "구글",
            list: data
        });
    });
});

app.get("/get/nhn", function(req, res) {
	//selenium
	(async function example() {
		var data = [];
		let driver = await new Builder().forBrowser('chrome').build();
		try {
			// Navigate to Url
			await driver.get(global_urls[6]["base_url"]);
			//wait till loaded
			await driver.wait(until.elementLocated(By.css('ul.lst_type>li.lst_item>a')), 10000);
			
			let elements = await driver.findElements(By.css('ul.lst_type>li.lst_item>a'));
			let count = 0;
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("div.sec_box>h3")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("div.sec_box>p")).getText();
			}
		}
		finally{
			driver.quit();
			res.render("nhn", {
				title: "NHN",
				list: data
			});
		}
	})();
});

//banksalad
app.get("/get/banksalad", function(req, res) {
	//selenium
	(async function example() {
		var data = [];
		let driver = await new Builder().forBrowser('chrome').build();
		try {
			// Navigate to Url
			await driver.get(global_urls[7]["base_url"]);
			//wait till loaded
			await driver.wait(until.elementLocated(By.css('div.style__BlogPostsWrapper-sc-5a1k8p-0>div.post_card>div.post_details>div.post_content')), 10000);
			
			let elements = await driver.findElements(By.css('div.style__BlogPostsWrapper-sc-5a1k8p-0>div.post_card>div.post_details>div.post_content'));
			let count = 0;
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.findElement(By.css("h2>a")).getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("h2>a")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("p")).getText();
			}
		}
		finally{
			driver.quit();
			res.render("banksalad", {
				title: "Banksalad",
				list: data
			});
		}
	})();
});

//lezhin
app.get("/get/lezhin", function(req, res) {
	//selenium
	(async function example() {
		var data = [];
		let driver = await new Builder().forBrowser('chrome').build();
		try {
			// Navigate to Url
			await driver.get(global_urls[8]["base_url"]);
			//wait till loaded
			await driver.wait(until.elementLocated(By.css('ul.post-list>li.post-item')), 10000);
			
			let elements = await driver.findElements(By.css('ul.post-list>li.post-item'));
			let count = 0;
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.findElement(By.css("h2>a")).getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("h2>a")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("div.post-summary")).getText();
			}
		}
		finally{
			driver.quit();
			res.render("lezhin", {
				title: "레진코믹스",
				list: data
			});
		}
	})();
});

//kakao
app.get("/get/kakao", function(req, res) {
	//selenium
	(async function example() {
		var data = [];
		let driver = await new Builder().forBrowser('chrome').build();
		try {
			// Navigate to Url
			await driver.get(global_urls[9]["base_url"]);
			//wait till loaded
			await driver.wait(until.elementLocated(By.css('div.inner_g>div.wrap_post>ul.list_post>li>a.link_post')), 10000);
			
			let elements = await driver.findElements(By.css('div.inner_g>div.wrap_post>ul.list_post>li>a.link_post'));
			let count = 0;
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("strong")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("p.desc_post")).getText();
			}
		}
		finally{
			driver.quit();
			res.render("kakao", {
				title: "카카오",
				list: data
			});
		}
	})();
});


app.get("*", (req, res) => {
    res.end('<head><title>404</title></head><body><h1>404 Error!</h1></body>');
});
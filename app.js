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
/*
의문점 : selenium을 활용하려면 webdriver가 필요한데,
이거 heroku에서 세팅 가능한지? putty같은걸로 접속 되는지 확인해보기
https://devcenter.heroku.com/articles/heroku-cli-commands
*/
/*
TODO : Node scheduler 적용하기
https://bblog.tistory.com/307

*/

/*
2020.11.23
일단 API형태로 만들긴 함.
하지만  SELENIUM으로 긁어온걸 API로 만든거고, DB에서 불러와야 함.
그러므로 할 일은 크게 두가지임.
1. 스케쥴러로 DB에 넣는 로직 구현
2. API는 DB에서 조회해오는 방식
3. 페이지 출력은 /page/xxxx에서 ejs로 출력, request 받으면 db조회해오는 방식으로
*/

/******* DATABASE CONNECTION START *******/
/*
node js - pg => pool, client 차이는?
spring에서 db connection pool 사용하는 이유와 같다.
재접속 필요없으므로
https://node-postgres.com/features/pooling
*/
/*
//require("./aaa.js")는 해당 js파일의 module.exports에 접근한다.
const dbConfig = require("./const.js");
const { Pool } = require('pg');

const pool = new Pool(dbConfig);

//pool error check
pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

const sql = "SELECT * FROM PG_TABLES WHERE SCHEMANAME = $1";

const values = ['public'];

pool.connect((err, client, done) => {
	if(err) throw err;
	client.query(sql, values, (err, res) => {
		done();
		
		if(err) {
			console.log(err.stack);
		} else {
			console.log(res.rows[0]);
		}
	});
});
*/
/******* DATABASE CONNECTION START *******/


//url global object
const global_urls = [{
    "title_kr" : "우아한형제들",
    "title_en" : "wooahan",
	"route"    : "wooahan",
    "base_url" : "https://woowabros.github.io"
}, {
	"title_kr" : "네이버",
    "title_en" : "naver",
	"route"    : "naver",
    "base_url" : "https://d2.naver.com/home"
}, {
	"title_kr" : "쿠팡",
    "title_en" : "coupang",
	"route"    : "coupang",
    "base_url" : "https://medium.com/coupang-tech/technote/home"
}, {
	"title_kr" : "스포카",
    "title_en" : "spoqa",
	"route"    : "spoqa",
    "base_url" : "https://spoqa.github.io/"
}, {
    "title_kr" : "라인",
    "title_en" : "line",
	"route"    : "line",
    "base_url" : "https://engineering.linecorp.com/ko/blog/"
}, {
    "title_kr" : "구글",
    "title_en" : "google",
	"route"    : "google",
    "base_url" : "https://developers.googleblog.com/"
}, {
    "title_kr" : "NHN",
    "title_en" : "nhn",
	"route"    : "nhn",
    "base_url" : "https://meetup.toast.com/"
}, {
	"title_kr" : "뱅크샐러드",
	"title_en" : "banksalad",
	"route"    : "banksalad",
	"base_url" : "https://blog.banksalad.com/tech/"
}, {
	"title_kr" : "레진코믹스",
	"title_en" : "lezhin",
	"route"    : "lezhin",
	"base_url" : "https://tech.lezhin.com/"
}, {
	"title_kr" : "카카오",
	"title_en" : "kakao",
	"route"    : "kakao",
	"base_url" : "https://tech.kakao.com/blog/"
}, {
	"title_kr" : "VCNC",
	"title_en" : "VCNC",
	"route"    : "vcnc",
	"base_url" : "http://engineering.vcnc.co.kr/"
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

//각 회사의 포스트를 크롤링하여 DB에 넣는 함수
var scraping = function(company) {
	if(company == "wooahan") {
		
	} else if(company == "naver") {
		
	} else if(company == "coupang") {
		
	} else if(company == "spoqa") {
		
	} else if(company == "line") {
		
	} else if(company == "google") {
		
	} else if(company == "nhn") {
		
	} else if(company == "banksalad") {
		
	} else if(company == "lezhin") {
		
	} else if(company == "kakao") {
		
	} else if(company == "vcnc") {
		
	} else {
		console.log("company name not exists");
	}
};

//메인화면
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

app.get("/page/*", function(req, res) {
	console.log(req.url);
	
});


/* SCRAPING LOGIC */
//wooahan web scrapping
/*
return json from express
res.send(object)
res.json(object)
res.send(string)
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
		res.json(data);
		/*
        res.render("wooahan", {
            title: "우아한형제들",
            list: data
        });
		*/
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
			
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.findElement(By.css("h2>a")).getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("h2>a")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("a.post_txt_wrap>div.post_txt")).getText();
			}
		}
		finally{
			driver.quit();
			res.json(data);
			/*
			res.render("naver", {
				title: "네이버",
				list: data
			});
			*/
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
			
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.findElement(By.css("a")).getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("a>h3>div")).getText();
				data[count++]["subtitle"] = await e.findElement(By.css("div>div")).getText();
			}
		}
		finally{
			driver.quit();
			res.json(data);
			/*
			res.render("coupang", {
				title: "쿠팡",
				list: data
			});
			*/
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
		res.json(data);
		/*
        res.render("spoqa", {
            title: "스포카",
            list: data
        });
		*/
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
		res.json(data);
		/*
        res.render("line", {
            title: "라인",
            list: data
        });
		*/
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
		res.json(data);
		/*
        res.render("google", {
            title: "구글",
            list: data
        });
		*/
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
			res.json(data);
			/*
			res.render("nhn", {
				title: "NHN",
				list: data
			});
			*/
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
			res.json(data);
			/*
			res.render("banksalad", {
				title: "Banksalad",
				list: data
			});
			*/
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
			res.json(data);
			/*
			res.render("lezhin", {
				title: "레진코믹스",
				list: data
			});
			*/
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
			res.json();
			/*
			res.render("kakao", {
				title: "카카오",
				list: data
			});
			*/
		}
	})();
});

//VCNC
app.get("/get/vcnc", function(req, res) {
	//selenium
	(async function example() {
		var data = [];
		let driver = await new Builder().forBrowser('chrome').build();
		try {
			// Navigate to Url
			await driver.get(global_urls[10]["base_url"]);
			//wait till loaded
			await driver.wait(until.elementLocated(By.css('ul.archive>li')), 10000);
			
			let elements = await driver.findElements(By.css('ul.archive>li'));
			let count = 0;
			for(let e of elements) {
				data.push({});
				data[count]["url"] = await e.findElement(By.css("a")).getAttribute("href");
				data[count]["title"] = await e.findElement(By.css("a")).getText();
				data[count++]["date"] = await e.findElement(By.css("span.posts-date")).getText();
			}
		}
		finally{
			driver.quit();
			res.json();
			/*
			res.render("vcnc", {
				title: "VCNC",
				list: data
			});
			*/
		}
	})();
});
/*
(async function example() {
//todo : complete this. 2020.11.24
for(var i = 0; i < global_urls.length; ++i) {
	app.get("/page/" + global_urls[i]["route"], function(req, res) {
		//console.log(req);
		res.render(global_urls[i]["route"], {
			title: global_urls[i]["title_kr"]
		});
	});
}
})();
*/




app.get("*", (req, res) => {
    res.end('<head><title>404</title></head><body><h1>404 Error!</h1></body>');
});
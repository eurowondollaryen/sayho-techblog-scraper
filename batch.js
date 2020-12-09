/*selenium을 활용하여 db에 insert한다.*/

//postgres
const pool = require('./db.js').pool;

//axios : get html from url
//cheerio : use queryselector
//npm install --save axios cheerio
const axios = require("axios");
const cheerio = require("cheerio");

//selenium
const {Builder, By, Key, until} = require("selenium-webdriver");

var global_urls = [];
//1. 블로그 정보를 모두 가져온다.
var initGlobal = async function() {
	await pool.query("SELECT BLOG_ID, TITLE_KR, ROUTE, BASE_URL"
+" FROM ICTBLOGS"
+" ORDER BY BLOG_ID")
	.then(function(res) { global_urls = res.rows; });
}

//2. 각 회사의 포스트를 크롤링하여 DB에 insert한다.
var scraping = async function() {
		console.log("getting initial data...");
		await initGlobal();//초기데이터 가져오는데 성공!
		console.log(global_urls);
		console.log("batch start!! - " + new Date().toString());
		
		for(var i = 0; i < global_urls.length; ++i) {
			var blog_id = global_urls[i]["blog_id"];
			if(blog_id == "1001") {
				
			} else if (blog_id == "1002") {
				//2. naver
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
						console.log(data);
						
						driver.quit();
						//TODO : SELENIUM으로 조회된 OBJECT 배열을 DB에서 조회해온 내용과 비교하여, UPDATE OR INSERT
					}
				})();
			} else if (blog_id == "1003") {
			} else if (blog_id == "1004") {
			} else if (blog_id == "1005") {
			} else if (blog_id == "1006") {
			} else if (blog_id == "1007") {
			} else if (blog_id == "1008") {
			} else if (blog_id == "1009") {
			} else if (blog_id == "1010") {
			} else if (blog_id == "1011") {
			} else {
				console.log("[Error] batch logic Not written!");
			}
		}
		
};


//export scraping function
exports.scraping = scraping;
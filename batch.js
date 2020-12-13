/*selenium을 활용하여 db에 insert한다.*/
/*
heroku setting for Selenium
method 1. buildpack with command
# heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-chromedriver
# heroku buildpacks:add --index 2 https://github.com/heroku/heroku-buildpack-google-chrome

method 2. config in heroku dashboard
Settings -> Add buildpacks -> https://github.com/heroku/heroku-buildpack-chromedriver -> Save changes
Settings -> Add buildpacks -> https://github.com/heroku/heroku-buildpack-google-chrome -> Save changes
*/
//postgres
const pool = require('./db.js').pool;

//axios : get html from url
//cheerio : use queryselector
//npm install --save axios cheerio
const axios = require("axios");
const cheerio = require("cheerio");

//selenium
const {Builder, By, Key, until} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
//Below arguments are critical for Heroku deployment
let options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");


let global_urls = [];

//selenium으로 조회된 object를 가지고 merge into 해주는 함수
const postMerge = async function (postObj) {
    const queryStr = "WITH UPSERT AS (UPDATE ICTPOSTS \n"
        + "SET UPDT_DT = TO_CHAR(NOW(),'YYYYMMDD') \n"
        + "WHERE BLOG_ID = '" + postObj["blog_id"] + "' \n"
        + "AND TITLE = '" + postObj["title"] + "' RETURNING *)\n"
        + "INSERT INTO ICTPOSTS(BLOG_ID, POST_SEQ, TITLE, POST_URL, SUBTITLE, AUTHOR, NOTE_DTL, INST_DT) \n"
        + "SELECT '" + postObj["blog_id"] + "' \n"
        + ",(SELECT COUNT(*) FROM ICTBLOGS WHERE BLOG_ID = '" + postObj["blog_id"] + "')+1\n"
        + ",'" + postObj["title"] + "'\n"
        + ",'" + postObj["post_url"] + "'\n"
        + ",'" + postObj["subtitle"] + "'\n"
        + ",'" + postObj["author"] + "'\n"
        + ",'" + postObj["note_dtl"] + "'\n"
        + ",TO_CHAR(NOW(), 'YYYYMMDD') \n"
        + "WHERE NOT EXISTS(SELECT * FROM UPSERT)";
    console.log(queryStr);
    await pool.query(queryStr);
};

//1. 블로그 정보를 모두 가져온다.
const initGlobal = async function () {
    await pool.query("SELECT BLOG_ID, TITLE_KR, ROUTE, BASE_URL"
        + " FROM ICTBLOGS"
        + " ORDER BY BLOG_ID")
        .then(function (res) {
            global_urls = res.rows;
        });
};

//2. 각 회사의 포스트를 크롤링하여 DB에 insert한다.
const scraping = async function () {
    //build chrome driver
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)//option for heroku deployment.
        .build();

    console.log("getting initial data...");
    await initGlobal();//초기데이터 가져오는데 성공!
    console.log("batch start!! - " + new Date().toString());
    var i = 0;
    
    //주의 : async, await을 사용하려면 forEach를 사용해야한다.
    global_urls.forEach((item) => {
        var blog_id = item["blog_id"];
        if (blog_id == "1001") {

        } else if (blog_id == "1002") {
            //2. naver
            (async function example() {
                var data = [];
                try {
                    // Navigate to Url
                    await driver.get(item["base_url"]);
                    //wait till loaded
                    await driver.wait(until.elementLocated(By.css('div.contents>div.post_article>div.cont_post')), 10000);

                    let elements = await driver.findElements(By.css('div.contents>div.post_article>div.cont_post'));
                    let count = 0;

                    for (let e of elements) {
                        if (e != undefined && e != null) {
                            //console.log(item);//undefined로 나옴
                            await data.push({
                                blog_id: item["blog_id"],
                                title: await e.findElement(By.css("h2>a")).getText(),
                                post_url: await e.findElement(By.css("h2>a")).getAttribute("href"),
                                subtitle: await e.findElement(By.css("a.post_txt_wrap>div.post_txt")).getText(),
                                author: "",
                                note_dtl: ""
                            });
                            /*
                            data[count]["blog_id"] = global_urls[i]["blog_id"];
                            data[count]["title"] = await e.findElement(By.css("h2>a")).getText();
                            data[count]["post_url"] = await e.findElement(By.css("h2>a")).getAttribute("href");
                            data[count]["subtitle"] = await e.findElement(By.css("a.post_txt_wrap>div.post_txt")).getText();
                            data[count]["author"] = "";
                            data[count++]["note_dtl"] = "";*/
                        }
                    }
                } finally {

                    driver.quit();
                    //TODO : SELENIUM으로 조회된 OBJECT 배열을 DB에서 조회해온 내용과 비교하여, UPDATE OR INSERT
                    for (var j = 0; j < data.length; ++j) {
                        console.log(data[j]);
                        //await postMerge(data[j]);
                    }

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
    });
};


//export scraping function
exports.scraping = scraping;
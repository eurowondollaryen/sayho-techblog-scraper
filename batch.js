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
//TODO: 이 쿼리의 문제점 : TITLE이 바뀌면 새롭게 INSERT된다.
const postMerge = async function (postObj) {
    const queryStr = "WITH UPSERT AS (UPDATE ICTPOSTS \n"
        + "SET UPDT_DT = TO_CHAR(NOW(),'YYYYMMDD') \n"
        + "WHERE BLOG_ID = $1 \n"
        + "AND TITLE = $2 RETURNING *)\n"
        + "INSERT INTO ICTPOSTS(BLOG_ID, POST_SEQ, TITLE, POST_URL, SUBTITLE, AUTHOR, NOTE_DTL, INST_DT) \n"
        + "SELECT $1 \n"
        + ",NEXTVAL('SQ_ICTPOSTS')\n"
        + ",$2\n"
        + ",$3\n"
        + ",$4\n"
        + ",$5\n"
        + ",$6\n"
        + ",TO_CHAR(NOW(), 'YYYYMMDD') \n"
        + "WHERE NOT EXISTS(SELECT * FROM UPSERT)";
    const param = [postObj["blog_id"], postObj["title"], postObj["post_url"], postObj["subtitle"], postObj["author"], postObj["note_dtl"]];
    await pool.query(queryStr, param);
};

//1. 블로그 정보를 모두 가져온다.
const initGlobal = async function () {
    await pool.query("SELECT BLOG_ID, TITLE_KR, TITLE_EN, ROUTE, BASE_URL"
        + " FROM ICTBLOGS"
        + " ORDER BY BLOG_ID")
        .then(function (res) {
            global_urls = res.rows;
        });
};

//2. 각 회사의 포스트를 크롤링하여 DB에 insert한다.
const scraping = async function () {
    /*
    //build chrome driver
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)//option for heroku deployment.
        .build();
    */
    console.log("getting initial data...");
    await initGlobal();//초기데이터 가져오는데 성공!
    console.log("batch start!! - " + new Date().toString());
    var i = 0;

    //주의 : async, await을 사용하려면 for loop가 아닌, forEach를 사용해야한다. 안그러면 안에서 global_urls의 값이 undefined로 나옴.
    //reference :  https://velog.io/@ksh4820/asyncawait%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4-loop-%EB%8B%A4%EB%A3%A8%EA%B8%B0
    global_urls.forEach(async (item) => {
        var blog_id = item["blog_id"];

        if (blog_id == "1001") {
            const getHtml = async () => {
                try {
                    return await axios.get(item["base_url"]);//global url array
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
                        blog_id: item["blog_id"],
                        title: $(this).find("a").children("h2.post-link").text(),
                        post_url: item["base_url"] + $(this).find("a").attr("href"),
                        subtitle: $(this).find("a").children("p.post-description").text(),
                        author: $(this).find("span.post-meta").text(),
                        note_dtl: ""
                    };
                });
                const data = ulList.filter(n => n.title);
                return data;
            }).then(data => {
                //merge
                data.forEach(async function (post) {
                    await postMerge(post);
                });
                console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
            });
        } else if (blog_id == "1002") {//naver, selenium
            try{
                //2. naver
                var data = [];
                try {
                    let driver = await new Builder()
                        .forBrowser('chrome')
                        .setChromeOptions(options)//option for heroku deployment.
                        .build();
                    // Navigate to Url
                    await driver.get(item["base_url"]);
                    //wait till loaded
                    await driver.wait(until.elementLocated(By.css('div.contents>div.post_article>div.cont_post')), 10000);

                    let elements = await driver.findElements(By.css('div.contents>div.post_article>div.cont_post'));
                    let count = 0;

                    for (let e of elements) {
                        if (e != undefined && e != null) {
                            data.push({
                                blog_id: item["blog_id"],
                                title: await e.findElement(By.css("h2>a")).getText(),
                                post_url: await e.findElement(By.css("h2>a")).getAttribute("href"),
                                subtitle: await e.findElement(By.css("a.post_txt_wrap>div.post_txt")).getText(),
                                author: "",
                                note_dtl: ""
                            });
                        }
                    }
                }
                catch (error) {
                    console.log("error occured in " + item["blog_id"]);
                    console.error(error);
                }
                finally {
                    driver.close();
                    driver.quit();
                    //merge into
                    data.forEach(async function (post) {
                        await postMerge(post);
                    });
                    console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
                }
            } catch(e) {
                console.log(e.toString());
            }
        } else if (blog_id == "1003") {//coupang, selenium
            (async () => {
                var data = [];
                try {
                    let driver = await new Builder()
                        .forBrowser('chrome')
                        .setChromeOptions(options)//option for heroku deployment.
                        .build();
                    // Navigate to Url
                    await driver.get(item["base_url"]);
                    //wait till loaded
                    await driver.wait(until.elementLocated(By.css('section.u-marginTop30>div.row>div.col>div.col')), 10000);
                    
                    let elements = await driver.findElements(By.css('section.u-marginTop30>div.row>div.col>div.col'));
                    let count = 0;
                    
                    for(let e of elements) {
                        data.push({
                            blog_id: item["blog_id"],
                            title: await e.findElement(By.css("a>h3>div")).getText(),
                            post_url: await e.findElement(By.css("a")).getAttribute("href"),
                            subtitle: await e.findElement(By.css("div>div")).getText(),
                            author: "",
                            note_dtl: ""
                        });
                    }
                }
                catch (error) {
                    console.log("error occured in " + item["blog_id"]);
                    console.error(error);
                }
                finally{
                    driver.close();
                    driver.quit();
                    //merge into
                    data.forEach(async function (post) {
                        await postMerge(post);
                    });
                    console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
                }
            })();
        } else if (blog_id == "1004") {//spoqa, axios
            const getHtml = async () => {
                try {
                    console.log("connecting to " + item["base_url"] + "...");
                    return await axios.get(item["base_url"]);//global url array
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
                        blog_id: item["blog_id"],
                        title: $(this).find("h2.post-title").find("a").find("span.post-title-words").text(),
                        post_url: item["base_url"] + $(this).find("h2.post-title").find("a").attr("href"),
                        subtitle: $(this).find("p.post-description").text(),
                        author: "",
                        note_dtl: ""
                    };
                });
                const data = ulList.filter(n => n.title);
                return data;
            }).then(data => {
                //merge
                data.forEach(async function (post) {
                    await postMerge(post);
                });
                console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
            });

        } else if (blog_id == "1005") {//line, axios
            const getHtml = async () => {
                try {
                    console.log("connecting to " + item["base_url"] + "...");
                    return await axios.get(item["base_url"]);//global url array
                } catch (error) {
                    console.error(error);
                }
            };
        
            getHtml().then(html => {
                let ulList = [];
                const $ = cheerio.load(html.data);//cheerio init
                const $bodyList = $("div.ast-row").children("article.post").children("div.ast-post-format-").children("div.post-content");
                
                $bodyList.each(function(i, elem) {
                    ulList[i] = {
                        blog_id: item["blog_id"],
                        title: $(this).find("header.entry-header").find("h2.entry-title").find("a").text(),
                        post_url: $(this).find("header.entry-header").find("h2.entry-title").find("a").attr("href"),
                        subtitle: ""/*$(this).find("div.entry-content").find("div.entry-summary").find("p").text()*/,
                        author: $(this).find("header.entry-header").find("h2.entry-meta").find("span.author").find("a").find("span").text(),
                        note_dtl: ""
                    };
                });
                const data = ulList.filter(n => n.title);
                return data;
            }).then(data => {
                //merge
                data.forEach(async function (post) {
                    await postMerge(post);
                });
                console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
            });
        } else if (blog_id == "1006") {//google, axios
            const getHtml = async () => {
                try {
                    console.log("connecting to " + item["base_url"] + "...");
                    return await axios.get(item["base_url"]);//global url array
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
                        blog_id: item["blog_id"],
                        title: $(this).find("h2.title").find("a").text(),
                        post_url: $(this).find("h2.title").find("a").attr("href"),
                        subtitle: "",
                        author: "",
                        note_dtl: $(this).find("div.post-header").find("div.published").find("span.publishdate").text()
                    };
                });
                const data = ulList.filter(n => n.title);
                return data;
            }).then(data => {
                //merge
                data.forEach(async function (post) {
                    await postMerge(post);
                });
                console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
            });
        } else if (blog_id == "1007") {//nhn, selenium
            (async () => {
                var data = [];
                try {
                    let driver = await new Builder()
                        .forBrowser('chrome')
                        .setChromeOptions(options)//option for heroku deployment.
                        .build();
                    // Navigate to Url
                    await driver.get(item["base_url"]);
                    //wait till loaded
                    await driver.wait(until.elementLocated(By.css('ul.lst_type>li.lst_item>a')), 10000);
                    
                    let elements = await driver.findElements(By.css('ul.lst_type>li.lst_item>a'));
                    let count = 0;
                    for(let e of elements) {
                        data.push({
                            blog_id: item["blog_id"],
                            title: await e.findElement(By.css("div.sec_box>h3")).getText(),
                            post_url: await e.getAttribute("href"),
                            subtitle: await e.findElement(By.css("div.sec_box>p")).getText(),
                            author: "",
                            note_dtl: ""
                        });
                    }
                }
                catch (error) {
                    console.log("error occured in " + item["blog_id"]);
                    console.error(error);
                }
                finally{
                    driver.close();
                    driver.quit();
                    data.forEach(async function (post) {
                        await postMerge(post);
                    });
                    console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
                }
            })();
        } else if (blog_id == "1008") {//banksalad, selenium
            (async function example() {
                var data = [];
                try {
                    let driver = await new Builder()
                        .forBrowser('chrome')
                        .setChromeOptions(options)//option for heroku deployment.
                        .build();
                    // Navigate to Url
                    await driver.get(item["base_url"]);
                    //wait till loaded
                    await driver.wait(until.elementLocated(By.css('div.style__BlogPostsWrapper-sc-5a1k8p-0>div.post_card>div.post_details>div.post_content')), 10000);
                    
                    let elements = await driver.findElements(By.css('div.style__BlogPostsWrapper-sc-5a1k8p-0>div.post_card>div.post_details>div.post_content'));
                    let count = 0;
                    for(let e of elements) {
                        data.push({
                            blog_id: item["blog_id"],
                            title: await e.findElement(By.css("h2>a")).getText(),
                            post_url: await e.findElement(By.css("h2>a")).getAttribute("href"),
                            subtitle: await e.findElement(By.css("p")).getText(),
                            author: "",
                            note_dtl: ""
                        });
                    }
                }
                finally{
                    driver.close();
                    driver.quit();
                    data.forEach(async function (post) {
                        await postMerge(post);
                    });
                    console.log(item["blog_id"] + " - " + item["title_en"] + " insert completed!");
                }
            })();
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
//wooahan web scrapping
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
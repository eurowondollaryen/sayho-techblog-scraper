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
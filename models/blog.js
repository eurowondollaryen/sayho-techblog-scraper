/*
blog.js
기술블로그 목록을 핸들링한다.
TODO : 현재는 하드코딩되어있지만, DB에서 가져오기
*/
exports.getBlogList = function() {
	var blogList = [
		{
			blog_id : 1001,
			title_kr : "우아한형제들",
			title_en : "wooahan",
			route : "wooahan",
			base_url : "https://woowabros.github.io",
			inst_dt : "20201129"
		},
		{
			blog_id : 1002,
			title_kr : "네이버",
			title_en : "naver",
			route : "naver",
			base_url : "https://d2.naver.com/home",
			inst_dt : "20201129"
		}
	]
	return blogList;
}
/*
post.js
블로그 포스트 목록을 핸들링한다.
TODO : 현재는 하드코딩되어있지만, DB에서 가져오기
*/
exports.getPostList = function() {
	var postList = [
		{
			blog_id : 1001,
			post_seq : 1,
			title : "내가 꿈꾸는 프로그래머로서의 삶",
			post_url : "/techcourse/2020/11/27/techcourse-level4-retrospective.html",
			subtitle : "우테코 크루들의 꿈에 대해 공유합니다.",
			author : "이원미",
			note_dtl : "",
			inst_dt : "20201129"
		}
	]
	return postList;
}
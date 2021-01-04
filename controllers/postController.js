var post = require("../models/post.js");
var blog = require("../models/blog.js");

const list = function(req, res) {
	console.log("list");
};

const create = function(req, res) {
	console.log("create");
};

const update = function(req, res) {
	console.log("update");
};

const remove = function(req, res) {
	console.log("remove");
};

const getPostListGet = async function(req, res) {
	console.log("[postController][getPostList]request data : " + req.param("company"));
	var parameters = [req.param("company")];
	//todo : parameter 이상한 값이 들어오면 예외처리
	var list = await post.getPostList(parameters);
	var blogInfo = await blog.getBlogId(parameters);
	res.render("postList", {
		"title": blogInfo[0]["title_kr"],
		"list": list
	});
};

const getPostListPost = async function(req, res) {
	console.log("[postController][getPostList2] request data : " + req.param("company"));
	var parameters = [req.param("company"), req.param("rowcount")];
	res.send({
		data: await post.postPostList(parameters)
	});
}

//export controller functions
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getPostListGet = getPostListGet;
exports.getPostListPost = getPostListPost;
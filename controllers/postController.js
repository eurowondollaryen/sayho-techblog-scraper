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

const getPostList = async function(req, res) {
	console.log("[postController][getPostList]request data : " + req.param("company"));
	
	var parameters = [req.param("company")];
	var list = await post.getPostList(parameters);
	var blogInfo = await blog.getBlogId(parameters);
	res.render(req.param("company"), {
		title: blogInfo[0]["title_kr"],
		list: list
	});
};

//export controller functions
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getPostList = getPostList;
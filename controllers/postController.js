var post = require("../models/post.js");

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
	res.render(req.param("company"), {
		list: list
	});
};

//export controller functions
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getPostList = getPostList;
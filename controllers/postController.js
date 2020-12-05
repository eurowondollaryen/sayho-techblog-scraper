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

const getPostList = function(req, res) {
	//console.log(req);
	//console.log(req.body);
	console.log(post.getPostList()[0].a);
	console.log("request data : " + req.param("company"));
	//TODO : 여기서 db 조회해서
	//TODO : 결과값으로 page rendering
};

//export controller functions
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getPostList = getPostList;
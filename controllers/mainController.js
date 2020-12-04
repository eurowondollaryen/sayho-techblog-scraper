var posts = require("../models/posts.js");
exports.list = function(req, res) {
	console.log("list");
};

exports.create = function(req, res) {
	console.log("create");
};
exports.update = function(req, res) {
	console.log("update");
};
exports.remove = function(req, res) {
	console.log("remove");
};
exports.getPosts = function(req, res) {
	//console.log(req);
	//console.log(req.body);
	console.log("request data : " + req.param("company"));
	//TODO : 여기서 db 조회해서
	//TODO : 결과값으로 page rendering
};
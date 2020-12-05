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

const getBlogList = function(req, res) {
	//console.log(req);
	//console.log(req.body);
	console.log(blog.getBlogList()[0].a);
	console.log("request data : " + req.param("company"));
	res.end(blog.getBlogList());
	return blog.getBlogList();
};

const printBlogList = function(req, res) {
	res.render("index", {
		list : blog.getBlogList()
	});
};

//export controller functions
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getBlogList = getBlogList;
exports.printBlogList = printBlogList;
//post : req.body, get(url) : req.query
var blog = require("../models/blog.js");

const list = function (req, res) {
  console.log("list");
};

const create = function (req, res) {
  console.log("create");
};

const update = function (req, res) {
  console.log("update");
};

const remove = function (req, res) {
  console.log("remove");
};

const getBlogList = function (req, res) {
  console.log(
    "[blogController][getBlogList]request data : " + req.query["company"]
  );
  res.end(blog.getBlogList());
  return blog.getBlogList();
};

const printBlogList = async function (req, res) {
  // TODO: solve promise problem
  //reference : https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8#.w234uo7h3
  var list = await blog.getBlogList();
  res.render("index", {
    list: list,
  });
};

//export controller functions
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getBlogList = getBlogList;
exports.printBlogList = printBlogList;

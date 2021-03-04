//post : req.body, get(url) : req.query
var post = require("../models/post.js");
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

const getPostListGet = async function (req, res) {
  console.log(
    "[postController][getPostList]request data : " + req.query["company"]
  );
  var parameters = [req.query["company"]];
  //parameter가 null이면 404
  if (parameters[0] == null || parameters[0] == undefined) {
    res.end("<head><title>404</title></head><body><h1>404 Error!</h1></body>");
    return;
  }

  var list = await post.getPostList(parameters);
  var blogInfo = await blog.getBlogId(parameters);
  //없는 회사명을 입력했을 경우 404
  if (blogInfo[0] == null || blogInfo[0] == undefined) {
    res.end("<head><title>404</title></head><body><h1>404 Error!</h1></body>");
    return;
  }

  res.render("postList", {
    title: blogInfo[0]["title_kr"],
    list: list,
  });
};
const getPostListPost = async function (req, res) {
  console.log(req.body["company"]);
  console.log(
    "[postController][getPostList2] request data : " + req.body["company"]
  );
  var parameters = [req.body["company"], req.body["rowcount"]];
  res.send({
    data: await post.postPostList(parameters),
  });
};

//export controller functions
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getPostListGet = getPostListGet;
exports.getPostListPost = getPostListPost;

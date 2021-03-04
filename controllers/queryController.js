//post : req.body, get(url) : req.query
var query = require("../models/query.js");

const listGet = async function (req, res) {
  console.log(
    "[queryController][listGet]request data : " + req.query["queryText"]
  );
  var parameters = [req.query["queryText"]];

  var list = await query.listGet(parameters);

  res.render("queryResult", {
    queryText: parameters[0],
    list: list,
  });
};

const listPost = async function (req, res) {
  console.log(
    "[queryController][listPost]request data : " + req.body["queryText"]
  );
  var parameters = [req.body["queryText"], req.body["rowcount"]];
  res.send({
    data: await query.listPost(parameters),
  });
};

//export controller functions
exports.listGet = listGet;
exports.listPost = listPost;

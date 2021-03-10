//post : req.body, get(url) : req.query
var log = require("../models/log.js");

const list = function (req, res) {
  console.log("list");
};

/*
POST VIEW LOG
*/
const create = async function (req, res) {
  var clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("[logController][create] request data : " + clientIp);

  var parameters = [req.body["post_seq"], req.body["dtl_note"], clientIp];
  await log.create(parameters);
};

/*
PAGE VISIT LOG
*/
const visit = async function (req, res) {
  var clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("[logController][visit] request data : " + clientIp);

  var parameters = [clientIp, req.body["route"]];
  await log.visit(parameters);
};

//export controller functions
exports.list = list;
exports.create = create;
exports.visit = visit;

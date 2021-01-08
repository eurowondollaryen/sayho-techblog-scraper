var query = require("../models/query.js");

const listGet = async function(req, res) {
	console.log("[queryController][listGet]request data : " + req.param("queryText"));
	var parameters = [req.param("queryText")];

	var list = await query.listGet(parameters);

	res.render("queryResult", {
		"queryText": parameters[0],
		"list": list
	});
};

const listPost = async function(req, res) {
	console.log("[queryController][listPost]request data : " + req.param("queryText"));
	var parameters = [req.param("queryText"), req.param("rowcount")];
	res.send({
		data: await query.listPost(parameters)
	});
};

//export controller functions
exports.listGet = listGet;
exports.listPost = listPost;
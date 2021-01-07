var query = require("../models/query.js");

const list = async function(req, res) {
	console.log("[queryController][list]request data : " + req.param("queryText"));
	var parameters = [req.param("queryText")];

	var list = await query.list(parameters);

	res.render("queryResult", {
		"queryText": parameters[0],
		"list": list
	});
};

//export controller functions
exports.list = list;
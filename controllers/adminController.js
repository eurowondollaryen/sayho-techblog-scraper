var query = require("../models/admin.js");

//admin page
const adminIndex = async function(req, res) {
	res.render("adminIndex", {});
}
//export controller functions
exports.adminIndex = adminIndex;
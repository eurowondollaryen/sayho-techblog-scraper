var log = require("../models/log.js");

const list = function(req, res) {
	console.log("list");
};

const create = async function(req, res) {
    var clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("[logController][create] request data : " + clientIp);
    
    var parameters = [req.param("post_seq"), req.param("dtl_note"), clientIp];
    await log.create(parameters);
    /*
	res.send({
		data: 
    });
    */
};

//export controller functions
exports.list = list;
exports.create = create;
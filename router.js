/*
router의 역할
controller 호출 후
app.js로부터 express()를 통해 생성한 app parameter를 넘겨받아
각 경로에 맞는 controller 함수를 연결
*/

//binding controller
var postController = require("./controllers/postController.js");
var blogController = require("./controllers/blogController.js");
var logController = require("./controllers/logController.js");
var queryController = require("./controllers/queryController.js");
var adminController = require("./controllers/adminController.js");

exports.route = function(app) {
	//main route
	app.get("/", blogController.printBlogList);
	//post route
	//app.get("/", post.list);
	app.get("/createPost", postController.create);
	app.get("/updatePost", postController.update);
	app.get("/removePost", postController.remove);
	app.get("/postList", postController.getPostListGet);
	app.post("/postList", postController.getPostListPost);
	
	//blog route
	app.get("/createBlog", blogController.create);
	app.get("/updateBlog", blogController.update);
	app.get("/removeBlog", blogController.remove);
	app.get("/blogList", blogController.getBlogList);
	
	//log route
	app.post("/createlog", logController.create);

	//query route
	app.get("/query", queryController.listGet);
	app.post("/query", queryController.listPost);

	//admin route
	app.get("/admin", adminController.adminIndex);
	app.post("/adminLogin", adminController.adminLogin);
	app.post("/adminLogout", adminController.adminLogout);
};
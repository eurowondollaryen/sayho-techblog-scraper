/*
router의 역할
controller 호출 후
app.js로부터 express()를 통해 생성한 app parameter를 넘겨받아
각 경로에 맞는 controller 함수를 연결
*/

//binding controller
//var mainController = require("./controllers/mainController.js");
var postController = require("./controllers/postController.js");
var blogController = require("./controllers/blogController.js");

exports.route = function(app) {
	//main route
	app.get("/", blogController.printBlogList);
	//post route
	//app.get("/", post.list);
	app.get("/createPost", postController.create);
	app.get("/updatePost", postController.update);
	app.get("/removePost", postController.remove);
	app.get("/postList", postController.getPostList);
	
	//blog route
	app.get("/createBlog", blogController.create);
	app.get("/updateBlog", blogController.update);
	app.get("/removeBlog", blogController.remove);
	app.get("/blogList", blogController.getBlogList);
	
};
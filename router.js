/*
router의 역할
controller 호출 후
app.js로부터 express()를 통해 생성한 app 인자값을 넘겨받아
각 경로에 맞는 controller 함수를 연결
*/

//binding controller
var posts = require("./controllers/mainController.js");

exports.route = function(app) {
	app.get("/", posts.list);
	app.post("/create", posts.create);
	app.post("/update", posts.update);
	app.post("/remove", posts.remove);
};
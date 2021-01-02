//
var switchTheme = function(theme) {
    //var theme = btnObj.classList[1].split('-')[1];
    var html = document.querySelector('html');
    html.dataset.theme = theme;
    var btn = document.getElementById("theme_btn");
    if(theme == "dark") {
        window.localStorage.theme = "dark";
        btn.innerHTML = "라이트 모드로 보기";
        btn.classList.remove("btn-dark");
        btn.classList.add("btn-light");
        html.dataset.theme = "dark";
    } else {
        window.localStorage.theme = "light";
        btn.innerHTML = "다크 모드로 보기";
        btn.classList.remove("btn-light");
        btn.classList.add("btn-dark");
        html.dataset.theme = "light";
    }
}
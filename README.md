# sayho-techblog-scraper
기술블로그 web scraper

### 개발 목적
- 여러 국내/외 IT 회사들의 시행착오와, 적용하는 기술, 현업에서 필요로 하는 기술 수준을 한 눈에 보고 싶어서

### 사용 기술
- Frondend : ejs + React.js
- Backend : Node.js(express)
- <del>axios (url로부터 html을 가져오는 라이브러리)</del>
- <del>cheerio (가져온 html 데이터를 querySelector처럼 접근할 수 있게 도와주는 라이브러리)</del>
- selenium (동적인 웹페이지까지 스크래핑 가능한 라이브러리. 브라우저 드라이버가 필요하다.)

### 현재 구동 방식
- 각 기술블로그의 url을 scraping 하여 게시글을 가져와서 보여준다.

### 문제점
1. 매번 서버에서 해당 url에 접속해서 똑같은 게시글을 가져오는 것은 서버 측면에서 비효율적이다. (그리고 사용자 입장에서도 오래 걸린다.)
2. 현재 사용하는 라이브러리로는 동적으로 DOM이 생성되는 블로그는 크롤링하지 못하기 때문에, scraping할 수 있는 블로그가 제한적이다.
  (xxx.github.io같이 static한 페이지들의 내용은 곧잘 가져오지만, 쿠팡 같은 Medium 기반 블로그, 네이버, 페이스북 등 게시글을 동적으로 생성하는 곳이 많다.)

### 해결 방안
1. 조회할 때 마다, 매번 url에 접속하는 것 보단, 주기적으로 서버에서 각 블로그를 조회해서 DB에 저장해놓은 것을 클라이언트에게 보여주는 방식으로 개선(배치)
2. 동적인 페이지를 읽어주는 [Selenium](https://www.selenium.dev/documentation/en/) 사용 => 적용 완료. 2020.11.11

## 세팅 방법
1. 적당한 경로를 환경변수 Path에 추가한다.
2. 해당 경로에 내가 지금 사용하는 Chrome 버전과 맞는 브라우저 드라이버를 다운받는다. => [다운받는곳](https://sites.google.com/a/chromium.org/chromedriver/downloads)
3. `git clone https://github.com/eurowondollaryen/sayho-techblog-scraper`
4. `cd sayho-techblog-scraper`
5. `node app.js`
6. 기술블로그를 한 눈에 리스트업해서 볼 수 있다.

## 개발 방향
- React.js랑 프로젝트 분리하고, 해당 프로젝트는 API 형태로 바꾸는 방향으로 - 2020.11.18

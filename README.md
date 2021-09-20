# techblog-scraper
기술블로그 web scraper

## What is this?
- 제각각인 여러 회사들의 기술블로그를 매일 한 번씩 스크랩 해와서, 한 눈에 볼 수 있게 도와주는 웹 앱

## How to use
- [돈이 없어 Heroku에서 운영중](https://techblog-scraper.herokuapp.com/)

## Purpose
- 여러 국내/외 IT 회사들의 시행착오와, 적용하는 기술, 현업에서 필요로 하는 기술 수준을 한 눈에 보고 싶어서

## Tech Stack
- Frondend : ejs + React.js
- Backend : Node.js(express)
- axios (url로부터 html을 가져오는 라이브러리) - 정적 페이지 scraping에 사용.
- cheerio (가져온 html 데이터를 querySelector처럼 접근할 수 있게 도와주는 라이브러리)
- selenium (동적인 웹페이지까지 스크래핑 가능한 라이브러리. 브라우저 드라이버가 필요하다.)

## How to run my code
1. 적당한 경로를 환경변수 Path에 추가한다.
2. 해당 경로에 내가 지금 사용하는 Chrome 버전과 맞는 브라우저 드라이버를 다운받는다. => [다운받는곳](https://sites.google.com/a/chromium.org/chromedriver/downloads)
3. `git clone https://github.com/eurowondollaryen/sayho-techblog-scraper`
4. `cd sayho-techblog-scraper`
5. `node app.js`
6. 기술블로그를 한 눈에 리스트업해서 볼 수 있다.

## Reference - Node scheduler
- scheduler 관련 참고 자료
- [노드 서버를 이용한 스케쥴러 구성](https://bblog.tistory.com/307)
- [heroku scheduler with nodejs](http://www.modeo.co/blog/2015/1/8/heroku-scheduler-with-nodejs-tutorial)

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

## TODO
- Search => PROCESSING...
- Back Office (조회 통계, 배치 관리)
- News Feed

## TODO - DONE
- React.js랑 프로젝트 분리하고, 해당 프로젝트는 API 형태로 바꾸는 방향으로 - DONE
- DB구축, Node scheduler 적용하여.. 스케쥴러로 돌아가도록 수정 - DONE
- SCROLL LOAD 발동 시 DB 조회 (done. 모든 post가 조회되었을 때도 예외처리 필요 -> done.)
- 조회된 값을 HTML RENDERING(done. react.js 활용 필요)
- 포스트 클릭 시, 해당 포스트에 대해 클릭한 로그 남기기(포스트ID, IP, 시간) -> done.
- DARK MODE -> done.
- 새로운 글 표시 -> done.
- POST에 조회수 표시 -> done.
- get 방식 company=이상한값으로 요청하면 서버 에러 나는거 => 404로 돌리도록 수정 -> done.

## Reference - Node scheduler
- scheduler 관련 참고 자료
- [노드 서버를 이용한 스케쥴러 구성](https://bblog.tistory.com/307)
- [heroku scheduler with nodejs](http://www.modeo.co/blog/2015/1/8/heroku-scheduler-with-nodejs-tutorial)

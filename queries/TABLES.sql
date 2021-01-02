/*
ICTBLOGS
기술 블로그 정보
*/
CREATE TABLE ICTBLOGS(
BLOG_ID VARCHAR(4),
TITLE_KR VARCHAR(100),
TITLE_EN VARCHAR(100),
ROUTE VARCHAR(100),
BASE_URL VARCHAR(200),
INST_DT CHAR(8),
UPDT_DT CHAR(8)
);

INSERT INTO ICTBLOGS VALUES('1001','우아한형제들','wooahan','wooahan','https://woowabros.github.io','20201129');
INSERT INTO ICTBLOGS VALUES('1002','네이버','naver','naver','https://d2.naver.com/home','20201129');
INSERT INTO ICTBLOGS VALUES('1003','쿠팡','coupang','coupang','https://medium.com/coupang-tech/technote/home','20201129');
INSERT INTO ICTBLOGS VALUES('1004','스포카','spoqa','spoqa','https://spoqa.github.io','20201129');
INSERT INTO ICTBLOGS VALUES('1005','라인','LINE','line','https://engineering.linecorp.com/ko/blog','20201129');
INSERT INTO ICTBLOGS VALUES('1006','구글','google','google','https://developers.googleblog.com','20201129');
INSERT INTO ICTBLOGS VALUES('1007','NHN','NHN','nhn','https://meetup.toast.com','20201129');
INSERT INTO ICTBLOGS VALUES('1008','뱅크샐러드','Banksalad','banksalad','https://blog.banksalad.com/tech','20201129');
INSERT INTO ICTBLOGS VALUES('1009','레진코믹스','Lezhin','lezhin','https://tech.lezhin.com','20201129');
INSERT INTO ICTBLOGS VALUES('1010','카카오','Kakao','kakao','https://tech.kakao.com/blog','20201129');
INSERT INTO ICTBLOGS VALUES('1011','VCNC','VCNC','vcnc','http://engineering.vcnc.co.kr','20201129');

/*
ICTPOSTS
기술블로그별 각 포스트를 저장한다.
*/
CREATE TABLE ICTPOSTS(
BLOG_ID VARCHAR(4),
POST_SEQ INTEGER,
TITLE VARCHAR(200),
POST_URL VARCHAR(1000),
SUBTITLE VARCHAR(1000),
AUTHOR VARCHAR(100),
NOTE_DTL VARCHAR(100),
INST_DT CHAR(8),
UPDT_DT CHAR(8)
);

/*
SQ_ICTPOSTS
*/
CREATE SEQUENCE SQ_ICTPOSTS START 1;


/*
ICTVIEWLOG
각 포스트의 클릭수를 저장한다.
*/
CREATE TABLE ICTVIEWLOG(
    SEQ INTEGER,
    POST_SEQ INTEGER,
    DTL_NOTE VARCHAR(1000),
    IP VARCHAR(50),
    TIMESTAMP VARCHAR(14)
);

/*
SQ_ICTVIEWLOG
*/
CREATE SEQUENCE SQ_ICTVIEWLOG START 1;
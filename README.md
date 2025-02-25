# 버전관리
---
## 1. main Page making
메인 페이지 제작 
요구사항에 맞춰 
- CSS RESET 
- 화면 사이즈에 반응하도록 제작
- SNS icon 클릭 시 새로운 창으로 열리게

## 2. sub Page(login/sign) making
서브 페이지 제작
요구사항에 맞춰
- CSS RESET
- input 요소 & 색상
- palette color 값 css 변수로 등록

구글애널리틱스 등록 및 reset.css 수정
요구사항에 맞춰 구글애널리틱스 등록
- 기존 reset.css 삭제 후 모든 브라우저에 원하는 디자인이 적용될 수 있도록 reset.css를 통해 css 초기화

오류 수정
- 요구사항에 맞게 기존 픽셀로 크기를 나타내는 부분을 REM으로 변경
- contents 간격 조절
- 버튼요소에 폰트 스타일 적용
- scrollbar 표시 삭제
- 로그인 & 회원가입 페이지 요소 가운데 정렬
- index.html SNS icon 수정
- sub(login,singup) Page button hover 스타일 추가

- input 요소 눈모양 아이콘 추가(입력값이 없을 경우 눈 아이콘 클릭불가, 비밀번호 input 비밀번호 확인 input 각각 반응하게 수정)
- 화면에 따라 sub Page 가운데 정렬이 아닌 오류 수정

- main Page button hover 스타일 추가
- main Page 100vw 스타일 오류 수정
- input 입력 필드가 눈모양 아이콘을 넘지 않도록 수정
- input cursor color 변경

## 3. subPage JS & CSS MOD
요구사항에 따라 input MOD
- JS로 유효성 검사
- JS로 로그인 버튼 활성화 동작 추가
- JS로 user data 내의 값만 로그인이 가능하게 구현
- JS로 로그인 실패 시 popup 추가
- main & sub Page hover 동작 삭제

- items & faq & privacy 404Page 추가
- class name 변경

요구사항에 따라 반응형 제작
- css로 화면 너비에 따라 반응하는 main & sub Page
- meta tag 설정

- sub Page 공통부분 모듈화 
- @mobile에서 사이즈 너비가 커지면 QA & SNS 간격도 너비에 맞춰 커지게 수정


오류 수정
- login.js password input 눈 아이콘 입력 값이 있을 때만 동작하게 변경
- 모바일 화면에서 sign Page 로고가 잘리는 오류 수정
- main Page @tablet에서 기기마다 위치가 달라지는 오류 수정
- 반응형 사이즈에서 header가 page 끝까지 적용되게 수정
- @mobile에서 오른쪽 스크롤 가능 오류 수정
- 반응형 사이즈 sign & login logo 위치 잘림 현상 수정
- 아이폰에서 sign & login text-decoration 스타일 적용이 안되는 현상 발견 수정(var 인식 불가 현상)
- @mobile에서 main Page max-width와 비슷한 디바이스 너비일 경우 banner & footer에서 이미지가 텍스트를 가리는 오류 수정
- @mobile에서 footer class 배치 수정
- main Page class name 수정
- main Page banner & footer IMG padding 추가

- HTML CSS 최적화


## 4. API making
요구사항에 맞게 API 제작
- Articles (CRUD)
- Product (CRUD)
- main 

변경 사항
- login & sign page input class 이름 수정
- 회원가입 시 로그인 페이지로 이동하지 않는 오류 수정
- API 오류 및 성공 메시지 수정

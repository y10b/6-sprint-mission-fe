# 🐼 판다마켓 프로젝트 - 브랜치별 개발 과정

> _이 저장소는 판다마켓 프로젝트의 프론트엔드 개발 과정을 단계별로 기록한 레포지토리입니다. 바닐라 JavaScript부터 React, Next.js까지의 발전 과정을 브랜치별로 확인할 수 있습니다._ 🚀

## 📋 프로젝트 개요

판다마켓은 중고거래를 위한 커뮤니티 플랫폼으로, 다음과 같은 주요 기능을 제공합니다:

- 🛒 **상품 등록 및 관리**: 상품 CRUD 기능
- 💬 **문의 댓글 시스템**: 상품에 대한 소통 기능
- 📝 **자유게시판**: 커뮤니티 소통 공간
- 👤 **사용자 인증**: 로그인/회원가입 시스템

## 🌳 브랜치별 개발 과정

### 📌 1단계: [Basic-김승준-Sprint4](https://github.com/y10b/6-sprint-mission-fe/tree/basic-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint4)

**바닐라 JavaScript 기반 웹 애플리케이션**

#### 🔧 주요 구현 사항

- **HTML/CSS/JavaScript** 순수 기술 스택 사용
- **반응형 웹 디자인** 구현 (모바일, 태블릿, 데스크톱)
- **CSS Reset** 및 브라우저 호환성 최적화
- **Google Analytics** 연동

#### 📁 파일 구조

```
├── index.html          # 메인 페이지
├── login.html          # 로그인 페이지
├── signup.html         # 회원가입 페이지
├── item.html           # 상품 상세 페이지
├── FAQ.html            # FAQ 페이지
├── privacy.html        # 개인정보처리방침
├── style.css           # 메인 스타일시트
├── reset.css           # CSS 초기화
├── login.js            # 로그인 기능
└── signup.js           # 회원가입 기능
```

#### ✨ 핵심 기능

1. **사용자 인터페이스**

   - 픽셀 단위에서 REM 단위로 변경하여 접근성 향상
   - SNS 아이콘 클릭 시 새 창으로 열기
   - 입력 필드에 눈 모양 아이콘으로 비밀번호 표시/숨기기

2. **유효성 검사 시스템**

   - JavaScript를 통한 실시간 입력 검증
   - 로그인 버튼 활성화/비활성화 동적 제어
   - 사용자 데이터 기반 로그인 인증

3. **반응형 디자인**

   - 모바일 퍼스트 접근법
   - 화면 크기별 최적화된 레이아웃
   - 크로스 브라우저 호환성 (Safari 포함)

4. **API 연동**
   - Articles CRUD (생성, 읽기, 수정, 삭제)
   - Products CRUD
   - RESTful API 설계 패턴 적용

#### 🐛 해결된 주요 이슈들

- 모바일에서 로고 잘림 현상 수정
- 아이폰 Safari에서 CSS 변수 인식 문제 해결
- 스크롤바 표시 제거로 사용자 경험 개선
- 입력 필드와 아이콘 겹침 현상 수정

---

### 📌 2단계: [React-김승준-Sprint5](https://github.com/y10b/6-sprint-mission-fe/tree/react-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint5)

**React 기반 컴포넌트 아키텍처 전환**

#### 🔄 주요 변화점

- **바닐라 JavaScript → React** 마이그레이션
- **컴포넌트 기반 아키텍처** 도입
- **JSX 문법** 적용
- **상태 관리** (useState, useEffect) 구현

#### 🎯 구현 목표

- 재사용 가능한 컴포넌트 개발
- 단방향 데이터 플로우 구현
- 가상 DOM 활용한 성능 최적화

---

### 📌 3단계: [React-김승준-Sprint6](https://github.com/y10b/6-sprint-mission-fe/tree/react-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint6)

**고급 React 기능 및 라우팅**

#### 🚀 확장 기능

- **React Router** 도입으로 SPA 라우팅 구현
- **커스텀 훅** 개발로 로직 재사용성 향상
- **Context API** 또는 상태 관리 라이브러리 활용
- **폼 검증** 라이브러리 통합

---

### 📌 4단계: [React-김승준-Sprint7](https://github.com/y10b/6-sprint-mission-fe/tree/react-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint7)

**React 최적화 및 고도화**

#### ⚡ 성능 최적화

- **React.memo**, **useMemo**, **useCallback** 활용
- **코드 스플리팅** 및 **Lazy loading** 구현
- **에러 바운더리** 설정
- **테스팅** 환경 구축 (Jest, React Testing Library)

---

### 📌 5단계: [Next-김승준-Sprint8](https://github.com/y10b/6-sprint-mission-fe/tree/next-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint8)

**Next.js 프레임워크 전환**

#### 🔥 Next.js 도입 이유

- **서버 사이드 렌더링 (SSR)** 으로 SEO 개선
- **정적 사이트 생성 (SSG)** 으로 성능 향상
- **API Routes** 로 풀스택 개발 가능
- **이미지 최적화** 및 **자동 코드 스플리팅**

#### 🛠️ 주요 구현 사항

- Pages Router 또는 App Router 구조 설정
- getServerSideProps, getStaticProps 활용
- Next.js Image 컴포넌트로 이미지 최적화
- 환경 변수 설정 및 배포 최적화

---

### 📌 6단계: [Next-김승준-Sprint9](https://github.com/y10b/6-sprint-mission-fe/tree/next-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint9)

**고급 Next.js 기능 구현**

#### 🎨 향상된 기능들

- **미들웨어** 설정으로 인증 로직 개선
- **API Routes** 확장으로 백엔드 기능 강화
- **Incremental Static Regeneration (ISR)** 구현
- **국제화 (i18n)** 지원 (필요시)

---

### 📌 7단계: [Next-김승준-Sprint10](https://github.com/y10b/6-sprint-mission-fe/tree/next-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint10)

**프로덕션 레벨 최적화**

#### 🚀 프로덕션 준비

- **성능 모니터링** 도구 연동
- **에러 추적** 시스템 구축
- **PWA** 기능 구현 (서비스 워커, 매니페스트)
- **보안 강화** (CSRF, XSS 방어)

---

### 📌 8단계: [Next-김승준-Sprint11](https://github.com/y10b/6-sprint-mission-fe/tree/next-%EA%B9%80%EC%8A%B9%EC%A4%80-sprint11)

**최종 완성 및 배포**

#### 🎯 최종 단계

- **TypeScript** 도입으로 타입 안정성 확보
- **Storybook** 으로 컴포넌트 문서화
- **CI/CD 파이프라인** 구축
- **모니터링 및 로깅** 시스템 완성

## 🛠️ 기술 스택 발전 과정

| 단계            | 기술 스택                    | 주요 특징                   |
| --------------- | ---------------------------- | --------------------------- |
| **Sprint 1-4**  | HTML, CSS, JavaScript        | 순수 웹 기술, 반응형 디자인 |
| **Sprint 5-7**  | React, JSX, React Router     | 컴포넌트 기반, SPA          |
| **Sprint 8-11** | Next.js, SSR/SSG, API Routes | 풀스택, SEO 최적화          |

## 📊 주요 성과 지표

- **✅ 반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- **✅ 성능 최적화**: Core Web Vitals 개선
- **✅ 접근성**: WCAG 2.1 AA 준수
- **✅ SEO**: 검색 엔진 최적화 완료
- **✅ 보안**: 최신 보안 표준 적용

## 🚀 배포 및 데모

- **배포 URL**: [6-sprint-mission-fe-roan.vercel.app](https://6-sprint-mission-fe-roan.vercel.app)
- **개발 기간**: 2024년 스프린트 미션 과정
- **개발자**: 김승준

## 📚 학습 포인트

각 브랜치를 통해 다음과 같은 개발 역량을 단계적으로 습득할 수 있습니다:

1. **웹 기초**: HTML, CSS, JavaScript 숙달
2. **React 생태계**: 컴포넌트, 훅, 상태관리 이해
3. **Next.js 활용**: SSR, SSG, 풀스택 개발 경험
4. **프로덕션 준비**: 성능 최적화, 보안, 배포 경험

---

**📞 문의사항이나 피드백은 언제든 환영합니다!**

> 본 프로젝트는 [코드잇](https://www.codeit.kr)의 스프린트 미션 과정으로 진행되었습니다.  
> © 2024 Codeit. All rights reserved.

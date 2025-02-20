/* 참조 URL */
const baseURL = 'https://sprint-mission-api.vercel.app/articles'; // API 기본 URL

/* 게시글 목록 조회 */
function getArticleList(page = 1, pageSize = 100, keyword = "") {
    // URL 객체 생성 후 기본 URL 설정
    const url = new URL(baseURL);
    // 쿼리 파라미터 추가: 페이지 번호, 페이지 당 게시글 수, 키워드 (선택사항)
    url.searchParams.append("page", page);
    url.searchParams.append("pageSize", pageSize);
    if (keyword) {
        url.searchParams.append("keyword", keyword);
    }

    return fetch(url, {
        method: "GET", // GET 요청
        headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
        },
    })
        .then(response => {
            if (response.status === 200) {
                console.log("성공: 게시글 목록 조회");
                return response.json(); // 응답 데이터 반환
            } else {
                return response.json().then(error => { throw new Error(error); });
            }
        })
        .catch(error => {
            // 오류 발생 시 콘솔에 오류 메시지 출력
            console.error("오류: 게시글 목록 조회", error);
            return null; // 오류 발생 시 null 반환
        });
}

/* 게시글 등록 */
function createArticle(title, content, image) {
    // 제목, 내용, 이미지가 모두 있는지 확인
    if (!title || !content || !image) {
        console.error("유효성 검사: 제목, 내용, 이미지 URL은 필수입니다.");
        return null;
    }

    // 게시글 생성 요청 URL 설정
    const url = baseURL;
    // 요청 본문 데이터 준비
    const requestBody = {
        title: title,
        content: content,
        image: image
    };

    return fetch(url, {
        method: "POST", // POST 요청
        headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
        },
        body: JSON.stringify(requestBody), // 본문에 데이터 추가
    })
        .then(response => {
            // 응답 상태가 201(생성됨)일 경우 데이터를 반환
            if (response.status === 201) {
                console.log("성공: 게시글 등록")
                return response.json(); // 응답 데이터 반환
            }
            // 400 오류 처리
            else if (response.status === 400) {
                console.error("오류(게시글 등록): 유효성 검사 오류");
                return null;
            }
            // 그 외의 에러 처리
            else {
                return response.json().then(error => { throw new Error(error); });
            }
        })
        .catch(error => {
            // 네트워크 오류나 다른 예기치 않은 오류 처리
            console.error("오류: 게시글 생성", error); // 에러 출력
            return null; // 오류 발생 시 null 반환
        });
}

/* 게시글 상세 조회 */
function getArticle(id) {
    // 유효한 ID인지 확인
    if (!id || isNaN(id)) {
        console.error("유효성 검사: ID는 숫자여야 합니다.");
        return null;
    }

    // 게시글 상세 조회 URL 설정
    const url = `${baseURL}/${id}`;

    return fetch(url, {
        method: "GET", // GET 요청
        headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
        },
    })
        .then(response => {
            if (response.status === 200) {
                return response.json(); // 응답 데이터 반환
            }
            // 게시글이 없으면 404 오류 처리
            else if (response.status === 404) {
                console.error(`오류: 게시글을 찾을 수 없음 (ID: ${id})`);
                return null; // 게시글을 찾을 수 없으면 null 반환
            }
            // 그 외의 에러 처리
            else {
                return response.json().then(error => { throw new Error(error); });
            }
        })
        .then(data => {
            if (data) {
                console.log("성공: 게시글 상세 조회", data);
            }
            return data;
        })
        .catch(error => {
            // 네트워크 오류나 다른 예기치 않은 오류 처리
            console.error("오류: 게시글 상세 조회", error);
        });
}

/* 게시글 수정 */
function patchArticle(id, title, content, image) {
    // 유효한 ID인지 확인
    if (!id || isNaN(id)) {
        console.error("유효성 검사: 유효한 ID를 입력해주세요.");
        return null;
    }
    // 제목, 내용, 이미지가 모두 있는지 확인
    if (!title || !content || !image) {
        console.error("유효성 검사: 제목, 내용, 이미지 URL은 필수입니다.");
        return null;
    }

    // 수정할 게시글의 URL 설정
    const url = `${baseURL}/${id}`;
    // 수정할 데이터 준비
    const requestBody = {
        title: title,
        content: content,
        image: image
    };

    return fetch(url, {
        method: "PATCH", // PATCH 요청 (수정)
        headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
        },
        body: JSON.stringify(requestBody), // 수정할 데이터 본문에 추가
    })
        .then(response => {
            if (response.status === 200) {
                console.log(`성공: 게시글 수정 (ID: ${id})`)
                return response.json(); // 수정 성공 시 응답 데이터 반환
            } else if (response.status === 404) {
                console.error(`실패(게시글 수정): 게시글을 찾을 수 없음 (ID: ${id})`);
                return null; // 404 오류 발생 시 null 반환
            } else {
                return response.json().then(error => { throw new Error(error); }); // 그 외 에러 처리
            }
        })
        .catch(error => {
            console.error("오류: 게시글 수정", error); // 에러 출력
        });
}

/* 게시글 삭제 */
function deleteArticle(id) {
    // 유효한 ID인지 확인
    if (!id || isNaN(id)) {
        console.error("유효성 검사: 유효한 ID를 입력해주세요.");
        return null;
    }

    // 삭제할 게시글의 URL 설정
    const url = `${baseURL}/${id}`;

    return fetch(url, {
        method: "DELETE", // DELETE 요청
        headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
        },
    })
        .then(response => {
            // 응답 상태가 204(삭제 성공)일 경우 성공 메시지 출력
            if (response.status === 204) {
                console.log(`성공: 게시글 삭제 (ID:${id})`);
                return true; // 삭제 성공 시 true 반환
            } else if (response.status === 404) {
                console.error(`오류(게시글 삭제): 게시글을 찾을 수 없음 (ID: ${id})`);
                return null; // 게시글이 없으면 null 반환
            }
            // 그 외의 오류 처리
            return response.json().then(error => { throw new Error(error); });
        })
        .catch(error => {
            console.error("오류: 게시글 삭제", error); // 에러 출력
        });
}


/* 함수 내보내기 */
export {
    getArticle, getArticleList, createArticle, patchArticle, deleteArticle
}
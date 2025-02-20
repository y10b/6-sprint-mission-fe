
/* 참조 URL */
const baseURL = 'https://sprint-mission-api.vercel.app/products';

/* 상품 목록 조회 */
async function getProductList(page = 1, pageSize = 100, keyword = "") {
    try {
        // URL 객체 생성 및 쿼리 파라미터 설정
        const url = new URL(baseURL);
        url.searchParams.append("page", page);
        url.searchParams.append("pageSize", pageSize);
        if (keyword) {
            url.searchParams.append("keyword", keyword);
        }

        // GET 요청 보내기
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // 응답 상태 코드가 200인 경우 JSON 데이터 반환
        if (response.status === 200) {
            console.log("성공: 상품 목록 조회");
            return await response.json(); // JSON 데이터 반환
        }

        // 그 외의 오류 처리
        const error = await response.json(); // 오류 메시지 JSON 반환
        throw new Error(error); // 오류를 던짐

    } catch (error) {
        console.error("오류: 상품 목록 조회", error);
        return null; // 오류 발생 시 null 반환
    }
}

/* 상품 등록 */
async function createProduct(name, description, price, manufacturer, tags = [], images = []) {
    if (!name || !description || !price || !manufacturer || !Array.isArray(tags) || !Array.isArray(images)) {
        console.error("유효성 검사(상품 등록): 오류 모든 필수 입력 값을 확인 해주세요.");
        return null; // 유효하지 않은 입력값이면 null 반환
    }

    const url = baseURL; // API 엔드포인트 URL
    const requestBody = {
        name,
        description,
        price,
        manufacturer,
        tags,
        images
    };

    try {
        // 상품 등록 API 호출
        const response = await fetch(url, {
            method: "POST", // HTTP 메서드: POST
            headers: {
                "Content-Type": "application/json", // 요청 데이터 타입: JSON
            },
            body: JSON.stringify(requestBody), // JSON 형식으로 변환하여 전송
        });

        // 응답이 성공적이면 데이터 반환, 아니면 에러 처리
        const responseData = await response.json();

        if (response.status === 201) {
            console.log("성공: 상품 등록", responseData);
            return responseData; // 생성된 상품 데이터 반환
        } else if (response.status === 404) {
            // 404 에러 처리
            console.error("실패(상품 등록): 유효성 검사 오류", responseData.message);
            return null;
        } else {
            // 그 외(서버)
            throw new Error(responseData.message || "상품 등록 오류");
        }

    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error("오류: 상품 등록", error.message || error);
        return null;
    }
}

/* 상품 상세 조회 */
async function getProduct(id) {
    // 입력값 검증: ID가 존재하고 숫자인지 확인
    if (!id || isNaN(id)) {
        console.error("유효성 검사: 유효한 상품 ID를 입력해주세요");
        return null; // 유효하지 않은 ID일 경우 null 반환
    }

    const url = `${baseURL}/${id}`; // 요청할 상품의 API URL

    try {
        // 상품 상세 조회 API 호출 (GET 요청)
        const response = await fetch(url, { method: "GET" });

        // 응답 결과를 JSON으로 변환
        const responseData = await response.json();

        // 응답 코드 200: 상품 상세 조회 성공
        if (response.status === 200) {
            console.log("성공: 상품 상세 조회");
            return responseData; // 상품 정보 반환
        }
        // 응답 코드 404: 상품을 찾을 수 없음
        else if (response.status === 404) {
            console.error(`실패(상품 상세 조회): 상품을 찾을 수 없음 (ID: ${id})`);
            return null; // 상품을 찾을 수 없으면 null 반환
        }
        // 그 외의 오류 처리
        else {
            throw new Error(responseData.message || "상품 상세 조회 오류");
        }

    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error("오류: 상품 상세 조회", error);
        return null; // 오류 발생 시 null 반환
    }
}

/* 상품 수정 */
async function patchProduct(id, updates) {
    // 입력값 검증: ID가 존재하고 숫자인지 확인
    if (!id || isNaN(id)) {
        console.error("유효성 검사(상품 수정): 유효한 상품 ID를 입력해주세요.");
        return null; // 유효하지 않은 ID일 경우 null 반환
    }

    // 입력값 검증: updates가 객체인지, 업데이트할 데이터가 있는지 확인
    if (typeof updates !== "object" || Object.keys(updates).length === 0) {
        console.error("오류(상품 수정): 업데이트할 데이터가 없습니다.");
        return null; // 업데이트할 내용이 없을 경우 null 반환
    }

    const url = `${baseURL}/${id}`; // 요청할 상품의 API URL

    try {
        // 상품 수정 API 호출
        const response = await fetch(url, {
            method: "PATCH", // HTTP 메서드: PATCH (부분 수정)
            headers: {
                "Content-Type": "application/json", // 요청 데이터 타입: JSON
            },
            body: JSON.stringify(updates), // 업데이트할 데이터 JSON 변환 후 전송
        });

        // 응답 코드에 따른 처리
        const data = await response.json(); // JSON 데이터 변환

        if (response.status === 200) {
            // 응답 코드 200: 성공적으로 수정됨
            console.log(`성공: 상품 수정(ID: ${id})`, data);
            return data; // 수정된 상품 데이터 반환
        } else if (response.status === 404) {
            // 응답 코드 404: 상품을 찾을 수 없음
            console.error(`실패(상품 수정): 상품을 찾을 수 없음  (ID: ${id})`);
            return null;
        } else {
            // 그 외의 오류 처리
            throw new Error(data.message || "상품 수정 오류");
        }

    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error("오류: 상품 수정", error);
        return null;
    }
}

/* 상품 삭제 */
async function deleteProduct(id) {
    if (!id || isNaN(id)) {
        console.error("유효성검사(상품 삭제): 유효한 상품 ID를 입력해주세요.");
        return null; // 유효하지 않은 ID일 경우 null 반환
    }

    const url = `${baseURL}/${id}`; // 삭제할 상품의 API URL

    try {
        // 상품 삭제 API 호출 (DELETE 요청)
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json", // 요청 헤더 설정
            },
        });

        // 응답 코드에 따른 처리
        if (response.status === 204) {
            // 응답 코드 204: 삭제 성공 (본문이 없으므로 그냥 성공으로 처리)
            console.log(`성공: 상품 삭제(ID: ${id})`);
            return true; // 삭제 성공 시 true 반환
        }

        // 응답 코드 404: 상품을 찾을 수 없음
        if (response.status === 404) {
            console.error(`실패(상품 삭제): 상품을 찾을 수 없음 (ID: ${id})`);
            return null; // 상품이 존재하지 않을 경우 null 반환
        }

        // 그 외의 경우, JSON 응답을 처리
        const data = await response.json(); // 오류 응답을 JSON으로 변환
        throw new Error(data.message || "상품 삭제 오류");

    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error(`오류: 상품 삭제(ID: ${id})`, error);
        return null;
    }
}



/* 함수 내보내기 */
export {
    getProduct, getProductList, createProduct, patchProduct, deleteProduct
}
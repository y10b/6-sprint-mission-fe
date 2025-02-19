
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

        // 응답 확인
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // JSON 데이터 반환
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}

/* 상품 상세 조회 */
async function getProduct(id) {
    // 입력값 검증: ID가 존재하고 숫자인지 확인
    if (!id || isNaN(id)) {
        console.error("Error: 유효한 상품 ID를 입력해주세요.");
        return null; // 유효하지 않은 ID일 경우 null 반환
    }

    const url = `${baseURL}/${id}`; // 요청할 상품의 API URL

    try {
        // 상품 상세 조회 API 호출 (GET 요청)
        const response = await fetch(url, { method: "GET" });

        // 응답 코드 404: 상품을 찾을 수 없음
        if (response.status === 404) {
            console.error(`Error: 상품을 찾을 수 없습니다. (ID: ${id})`);
            return null;
        }

        // 응답이 정상적이지 않을 경우 오류 처리
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // JSON 데이터 변환
        return data; // 상품 정보 반환
    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error("Error fetching product:", error);
        return null;
    }
}

/* 상품 등록 */
async function createProduct(name, description, price, manufacturer, tags = [], images = []) {
    // 입력값 검증: 필수 값(name, description, price, manufacturer)이 존재하는지 확인
    // tags와 images는 배열인지 체크
    if (!name || !description || !price || !manufacturer || !Array.isArray(tags) || !Array.isArray(images)) {
        console.error("Error: 모든 필수 입력값을 확인해주세요.");
        return null; // 유효하지 않은 입력값이면 null 반환
    }

    const url = baseURL; // API 엔드포인트 URL
    const requestBody = {
        name,            // 상품명
        description,     // 상품 설명
        price,          // 가격
        manufacturer,   // 제조사
        tags,          // 태그 목록 (배열)
        images        // 이미지 목록 (배열)
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

        if (response.status === 201) { // 응답 코드 201: 성공적으로 생성됨
            const data = await response.json(); // JSON 데이터 변환
            console.log(" 상품이 성공적으로 등록되었습니다:", data);
            return data; // 생성된 상품 데이터 반환
        } else if (response.status === 400) { // 응답 코드 400: 유효성 검사 오류
            console.error(" Error: 유효성 검사 오류. 입력값을 확인해주세요.");
            return null;
        } else {
            // 예상하지 못한 응답 코드 처리
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error(" Error creating product:", error);
        return null;
    }
}

/* 상품 수정 */
async function patchProduct(id, updates) {
    // 입력값 검증: ID가 존재하고 숫자인지 확인
    if (!id || isNaN(id)) {
        console.error(" Error: 유효한 상품 ID를 입력해주세요.");
        return null; // 유효하지 않은 ID일 경우 null 반환
    }

    // 입력값 검증: updates가 객체인지, 업데이트할 데이터가 있는지 확인
    if (typeof updates !== "object" || Object.keys(updates).length === 0) {
        console.error(" Error: 업데이트할 데이터가 없습니다.");
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

        if (response.status === 200) { // 응답 코드 200: 성공적으로 수정됨
            const data = await response.json(); // JSON 데이터 변환
            console.log(`상품 (ID: ${id})이 성공적으로 수정되었습니다:`, data);
            return data; // 수정된 상품 데이터 반환
        } else if (response.status === 404) { // 응답 코드 404: 상품을 찾을 수 없음
            console.error(`Error: 상품을 찾을 수 없습니다. (ID: ${id})`);
            return null;
        } else {
            // 예상하지 못한 응답 코드 처리
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error("Error updating product:", error);
        return null;
    }
}

/* 상품 삭제 */
async function deleteProduct(id) {
    // 입력값 검증: ID가 존재하고 숫자인지 확인
    if (!id || isNaN(id)) {
        console.error("Error: 유효한 상품 ID를 입력해주세요.");
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

        // 응답 코드 204: 삭제 성공
        if (response.status === 204) {
            console.log(`상품 (ID: ${id})이 성공적으로 삭제되었습니다.`);
            return true; // 삭제 성공 시 true 반환
        }
        // 응답 코드 404: 상품을 찾을 수 없음
        else if (response.status === 404) {
            console.error(`Error: 상품을 찾을 수 없습니다. (ID: ${id})`);
            return null; // 상품이 존재하지 않을 경우 null 반환
        }
        // 기타 오류 처리
        else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        // 네트워크 오류 또는 예외 발생 시 오류 메시지 출력
        console.error("Error deleting product:", error);
        return null;
    }
}

/* 함수 내보내기 */
export {
    getProduct, getProductList, createProduct, patchProduct, deleteProduct
}
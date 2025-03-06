const baseURL = 'https://sprint-mission-api.vercel.app/products';

/* 상품 목록 조회 */
async function getProductList(page = 1, pageSize = 100, keyword = "") {
    try {
        const url = new URL(baseURL);
        url.searchParams.append("page", page);
        url.searchParams.append("pageSize", pageSize);
        if (keyword) {
            url.searchParams.append("keyword", keyword);
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // 상태 코드가 200번대가 아니면 에러를 던집니다
        if (!response.ok) {
            throw new Error(`상품 목록 조회 실패: ${response.statusText}`);
        }

        // 정상적인 응답 처리
        return await response.json();

    } catch (error) {
        console.error("오류: 상품 목록 조회", error);
        return null;
    }
}

/* 상품 등록 */
async function createProduct(name, description, price, manufacturer, tags = [], images = []) {
    if (!name || !description || !price || !manufacturer || !Array.isArray(tags) || !Array.isArray(images)) {
        console.error("유효성 검사(상품 등록): 오류 모든 필수 입력 값을 확인 해주세요.");
        return null;
    }

    const url = baseURL;
    const requestBody = {
        name,
        description,
        price,
        manufacturer,
        tags,
        images
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        // 상태 코드가 200번대가 아니면 에러를 던집니다
        if (!response.ok) {
            throw new Error(`상품 등록 실패: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("오류: 상품 등록", error.message || error);
        return null;
    }
}

/* 상품 상세 조회 */
async function getProduct(id) {
    if (!id || isNaN(id)) {
        console.error("유효성 검사: 유효한 상품 ID를 입력해주세요");
        return null;
    }

    const url = `${baseURL}/${id}`;

    try {
        const response = await fetch(url, { method: "GET" });

        // 상태 코드가 200번대가 아니면 에러를 던집니다
        if (!response.ok) {
            throw new Error(`상품 상세 조회 실패: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("오류: 상품 상세 조회", error);
        return null;
    }
}

/* 상품 수정 */
async function patchProduct(id, updates) {
    if (!id || isNaN(id)) {
        console.error("유효성 검사(상품 수정): 유효한 상품 ID를 입력해주세요.");
        return null;
    }

    if (typeof updates !== "object" || Object.keys(updates).length === 0) {
        console.error("오류(상품 수정): 업데이트할 데이터가 없습니다.");
        return null;
    }

    const url = `${baseURL}/${id}`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        // 상태 코드가 200번대가 아니면 에러를 던집니다
        if (!response.ok) {
            throw new Error(`상품 수정 실패: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("오류: 상품 수정", error);
        return null;
    }
}

/* 상품 삭제 */
async function deleteProduct(id) {
    if (!id || isNaN(id)) {
        console.error("유효성검사(상품 삭제): 유효한 상품 ID를 입력해주세요.");
        return null;
    }

    const url = `${baseURL}/${id}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // 상태 코드가 200번대가 아니면 에러를 던집니다
        if (!response.ok) {
            throw new Error(`상품 삭제 실패: ${response.statusText}`);
        }

        return true;

    } catch (error) {
        console.error(`오류: 상품 삭제(ID: ${id})`, error);
        return null;
    }
}

/* 함수 내보내기 */
export {
    getProduct, getProductList, createProduct, patchProduct, deleteProduct
};

const baseURL = "https://panda-market-api.vercel.app/users/me";

/* 사용자 정보 조회 (자기 자신) */
export async function getUserInfo(accessToken) {
    try {
        const url = new URL(baseURL);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // 인증 토큰 추가
            },
        });

        if (!response.ok) {
            throw new Error(`사용자 정보 조회 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적인 응답을 반환
        return {
            id: data.id,
            image: data.image,
            nickname: data.nickname,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    } catch (error) {
        console.error("오류: 사용자 정보 조회", error);
        return null; // 실패시 null 반환
    }
}

/* 사용자 정보 수정 (자기 자신) */
export async function updateUserInfo(accessToken, userData) {
    try {
        const url = new URL(baseURL);

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // 인증 토큰 추가
            },
            body: JSON.stringify(userData), // 수정할 사용자 정보 전송
        });

        if (!response.ok) {
            throw new Error(`사용자 정보 수정 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적인 응답을 반환
        return {
            id: data.id,
            image: data.image,
            nickname: data.nickname,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    } catch (error) {
        console.error("오류: 사용자 정보 수정", error);
        return null; // 실패시 null 반환
    }
}

/* 사용자 비밀번호 수정 (자기 자신) */
export async function updatePassword(accessToken, currentPassword, newPassword, passwordConfirmation) {
    try {
        const url = new URL(`${baseURL}/password`);

        // 비밀번호 변경에 필요한 데이터
        const requestData = {
            currentPassword,       // 현재 비밀번호
            password: newPassword, // 새로운 비밀번호
            passwordConfirmation,  // 새로운 비밀번호 확인
        };

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // 인증 토큰 추가
            },
            body: JSON.stringify(requestData), // 비밀번호 변경 데이터 전송
        });

        if (!response.ok) {
            throw new Error(`비밀번호 수정 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적인 응답을 반환
        return {
            id: data.id,
            image: data.image,
            nickname: data.nickname,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    } catch (error) {
        console.error("오류: 비밀번호 수정", error);
        return null; // 실패시 null 반환
    }
}

/* 사용자가 소유한 상품 목록 조회 */
export async function getUserProducts(accessToken, page = 1, pageSize = 10, keyword = "") {
    try {
        const url = new URL(`${baseURL}/products`);

        // URL 파라미터 설정
        url.searchParams.append("page", page);
        url.searchParams.append("pageSize", pageSize);
        if (keyword) {
            url.searchParams.append("keyword", keyword);
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // 인증 토큰 추가
            },
        });

        if (!response.ok) {
            throw new Error(`상품 목록 조회 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적으로 상품 목록을 반환
        return {
            totalCount: data.totalCount,
            products: data.list, // 상품 목록
        };
    } catch (error) {
        console.error("오류: 상품 목록 조회", error);
        return { totalCount: 0, products: [] }; // 실패 시 빈 배열 반환
    }
}

/* 사용자가 즐겨찾기한 상품 목록 조회 */
export async function getUserFavorites(accessToken, page = 1, pageSize = 10, keyword = "") {
    try {
        const url = new URL(`${baseURL}/favorites`);

        // URL 파라미터 설정
        url.searchParams.append("page", page);
        url.searchParams.append("pageSize", pageSize);
        if (keyword) {
            url.searchParams.append("keyword", keyword);
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // 인증 토큰 추가
            },
        });

        if (!response.ok) {
            throw new Error(`즐겨찾기 상품 목록 조회 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적으로 즐겨찾기 상품 목록을 반환
        return {
            totalCount: data.totalCount,
            favorites: data.list, // 즐겨찾기한 상품 목록
        };
    } catch (error) {
        console.error("오류: 즐겨찾기 상품 목록 조회", error);
        return { totalCount: 0, favorites: [] }; // 실패 시 빈 배열 반환
    }
}

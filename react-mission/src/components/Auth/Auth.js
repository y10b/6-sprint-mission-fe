const baseURL = "https://panda-market-api.vercel.app/auth";

/* 회원가입 */
export async function signUp(email, nickname, password, passwordConfirmation) {
    try {
        const url = new URL(`${baseURL}/signUp`);

        // 회원가입에 필요한 데이터
        const requestData = {
            email,
            nickname,
            password,
            passwordConfirmation,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData), // 회원가입 정보 전송
        });

        if (!response.ok) {
            throw new Error(`회원가입 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적인 응답을 반환
        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: {
                id: data.user.id,
                email: data.user.email,
                image: data.user.image,
                nickname: data.user.nickname,
                updatedAt: data.user.updatedAt,
                createdAt: data.user.createdAt,
            },
        };
    } catch (error) {
        console.error("오류: 회원가입", error);
        return null; // 실패시 null 반환
    }
}

/* 로그인 */
export async function signIn(email, password) {
    try {
        const url = new URL(`${baseURL}/signIn`);

        // 로그인에 필요한 데이터
        const requestData = {
            email,
            password,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData), // 로그인 정보 전송
        });

        if (!response.ok) {
            throw new Error(`로그인 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적인 응답을 반환
        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: {
                id: data.user.id,
                email: data.user.email,
                image: data.user.image,
                nickname: data.user.nickname,
                updatedAt: data.user.updatedAt,
                createdAt: data.user.createdAt,
            },
        };
    } catch (error) {
        console.error("오류: 로그인", error);
        return null; // 실패시 null 반환
    }
}

/* 토큰 갱신 */
export async function refreshToken(refreshToken) {
    try {
        const url = new URL(`${baseURL}/refresh-token`);

        // 토큰 갱신에 필요한 데이터
        const requestData = {
            refreshToken,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData), // refreshToken 전송
        });

        if (!response.ok) {
            throw new Error(`토큰 갱신 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 성공적인 응답을 반환
        return {
            accessToken: data.accessToken, // 새로운 accessToken 반환
        };
    } catch (error) {
        console.error("오류: 토큰 갱신", error);
        return null; // 실패시 null 반환
    }
}

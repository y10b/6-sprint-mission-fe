const BASE_URL = "http://localhost:5000";

export async function signup({ email, nickname, password }) {
    const res = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            nickname,
            encryptedPassword: password,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "회원가입 실패");
    }

    return res.json();
}

export async function login({ email, password }) {
    const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify({ email, encryptedPassword: password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "로그인 실패");
    }

    return res.json(); // accessToken은 이제 쿠키로 저장됨
}


export async function logout() {
    const res = await fetch(`${BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include", // 쿠키 포함
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "로그아웃 실패");
    }

    return res.json(); // 로그아웃 성공 시 응답 반환
}

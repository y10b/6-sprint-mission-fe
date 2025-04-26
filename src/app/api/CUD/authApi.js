"use server";

const BASE_URL = "https://panda-market-api.vercel.app";

export async function signup({ email, nickname, password, passwordConfirmation }) {
    const res = await fetch(`${BASE_URL}/Auth/SignUp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nickname, password, passwordConfirmation }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "회원가입 실패");
    }

    return res.json();
}

export async function login({ email, password }) {
    const res = await fetch(`${BASE_URL}/Auth/SignIn`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "로그인 실패");
    }

    return res.json();
}



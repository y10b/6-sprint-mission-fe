export const fetchWithRefresh = async (input, init = {}) => {
    let res = await fetch(input, {
        ...init,
        credentials: 'include',
    });

    if (res.status === 401) {
        // 액세스 토큰 만료로 판단
        const refreshRes = await fetch('http://localhost:5000/users/refresh', {
            method: 'POST',
            credentials: 'include', // ✅ 쿠키 포함
        });

        if (refreshRes.ok) {
            // 새 accessToken을 쿠키에 받아왔으니, 원래 요청 다시 시도
            res = await fetch(input, {
                ...init,
                credentials: 'include',
            });
        } else {
            throw new Error('로그인이 필요합니다.');
        }
    }

    return res;
};

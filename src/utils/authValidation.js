// 이메일 유효성
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// 비밀번호 8자
export const validatePassword = (password) => {
    return password.length >= 8;
};
// 비밀번호 확인
export const validatePasswordMatch = (password, confirmation) => {
    return password === confirmation;
};

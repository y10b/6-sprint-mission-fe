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



// 상품명 검증 (2글자 이상 15글자 이하)
export const validateProductName = (name) => {
    const trimmed = name.trim();
    return name.trim().length >= 2 && trimmed.length <= 15;
};

// 상품 소개 검증 (10자 이상 )
export const validateDescription = (description) => {
    const trimmed = description.trim();
    return description.trim().length >= 10 && trimmed.length <= 100;
};

// 가격 검증 (0보다 큰지)
export const validatePrice = (price) => {
    return Number(price) > 0;
};

// 태그 검증 (쉼표로 구분해서 최소 1개 이상)
export const validateTags = (tags) => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    return tagArray.length >= 1 && tagArray.length <= 5;
};
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 8;
};

export const validatePasswordMatch = (password, confirmation) => {
    return password === confirmation;
};

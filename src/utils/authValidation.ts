export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

// 이메일 유효성
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

// 비밀번호 8자
export const validatePassword = (password: string): boolean => {
  return password.length >= MIN_PASSWORD_LENGTH;
};

// 비밀번호 확인
export const validatePasswordMatch = (
  password: string,
  confirmation: string
): boolean => {
  return password === confirmation;
};

// 유효성 검사 에러 메시지
export const getValidationError = {
  email: (value: string) => {
    if (!value) return "이메일을 입력해주세요.";
    if (!validateEmail(value)) return "잘못된 이메일 형식입니다.";
    return true;
  },
  password: (value: string) => {
    if (!value) return "비밀번호를 입력해주세요.";
    if (!validatePassword(value)) return "8자 이상 입력해주세요.";
    return true;
  },
  passwordConfirm: (value: string, password: string) => {
    if (!value) return "비밀번호 확인을 입력해주세요.";
    if (!validatePasswordMatch(value, password))
      return "비밀번호가 일치하지 않습니다.";
    return true;
  },
};

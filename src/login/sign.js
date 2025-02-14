// 문서가 로드된 후 실행
document.addEventListener("DOMContentLoaded", function () {

    // DOM 요소 변수 선언
    const emailInput = document.getElementById("email"); // 이메일 입력 필드
    const passwordInput = document.getElementById("password"); // 비밀번호 입력 필드
    const confirmPasswordInput = document.getElementById("confirm-password"); // 비밀번호 확인 입력 필드
    const signUpButton = document.getElementById("sign_btn"); // 회원가입 버튼
    const emailError = document.getElementById("email-error"); // 이메일 오류 메시지 영역
    const passwordError = document.getElementById("password-error"); // 비밀번호 오류 메시지 영역
    const confirmPasswordError = document.getElementById("confirm-password-error"); // 비밀번호 확인 오류 메시지 영역
    const passwordToggle = document.querySelector(".passwordINPUT i"); // 비밀번호 표시/숨기기 아이콘
    const confirmPasswordToggle = document.querySelector(".confirm-passwordINPUT i"); // 비밀번호 확인 표시/숨기기 아이콘

    // 사용자 데이터 배열 (이메일과 비밀번호)
    const USER_DATA = [
        { email: 'codeit1@codeit.com', password: "codeit101!" },
        { email: 'codeit2@codeit.com', password: "codeit202!" },
        { email: 'codeit3@codeit.com', password: "codeit303!" },
        { email: 'codeit4@codeit.com', password: "codeit404!" },
        { email: 'codeit5@codeit.com', password: "codeit505!" },
        { email: 'codeit6@codeit.com', password: "codeit606!" },
    ];

    // 이메일 입력값 체크
    emailInput.addEventListener("input", function () {
        const emailValue = emailInput.value.trim();

        // 이메일 값이 비어있는지 확인
        if (emailValue === "") {
            showError(emailError, "이메일을 입력해주세요.", emailInput);
        }
        // 이메일 형식이 유효한지 확인
        else if (!isValidEmail(emailValue)) {
            showError(emailError, "잘못된 이메일 형식입니다.", emailInput);
        }
        else {
            hideError(emailError, emailInput); // 오류 메시지 숨기기
        }

        // 폼의 유효성 검사
        checkFormValidity([emailInput, passwordInput, confirmPasswordInput], signUpButton, [emailError, passwordError, confirmPasswordError]);
    });

    // 비밀번호 입력값 체크
    passwordInput.addEventListener("input", function () {
        const passwordValue = passwordInput.value.trim();

        // 비밀번호 값이 비어있는지 확인
        if (passwordValue === "") {
            showError(passwordError, "비밀번호를 입력해주세요.", passwordInput);
        }
        // 비밀번호의 길이가 8자 이상인지 확인
        else if (!isValidPassword(passwordValue)) {
            showError(passwordError, "비밀번호는 8자 이상이어야 합니다.", passwordInput);
        }
        else {
            hideError(passwordError, passwordInput); // 오류 메시지 숨기기
        }

        const confirmPasswordValue = confirmPasswordInput.value.trim();

        // 비밀번호 확인과 비밀번호 일치 여부 확인
        if (confirmPasswordValue !== "" && passwordValue !== confirmPasswordValue) {
            showError(confirmPasswordError, "비밀번호가 일치하지 않습니다.", confirmPasswordInput);
        } else {
            hideError(confirmPasswordError, confirmPasswordInput); // 오류 메시지 숨기기
        }

        // 폼의 유효성 검사
        checkFormValidity([emailInput, passwordInput, confirmPasswordInput], signUpButton, [emailError, passwordError, confirmPasswordError]);
    });

    // 비밀번호 확인 입력값 체크
    confirmPasswordInput.addEventListener("input", function () {
        const confirmPasswordValue = confirmPasswordInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // 비밀번호 확인 값이 비어있는지 확인
        if (confirmPasswordValue === "") {
            showError(confirmPasswordError, "비밀번호 확인을 입력해주세요.", confirmPasswordInput);
        }
        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        else if (passwordValue !== confirmPasswordValue) {
            showError(confirmPasswordError, "비밀번호가 일치하지 않습니다.", confirmPasswordInput);
        }
        else {
            hideError(confirmPasswordError, confirmPasswordInput); // 오류 메시지 숨기기
        }

        // 폼의 유효성 검사
        checkFormValidity([emailInput, passwordInput, confirmPasswordInput], signUpButton, [emailError, passwordError, confirmPasswordError]);
    });

    // 회원가입 버튼 클릭 시 처리
    signUpButton.addEventListener("click", function (event) {
        event.preventDefault(); // 기본 폼 제출을 막음

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // 이메일 중복 체크
        const emailExists = USER_DATA.some(function (user) {
            return user.email === emailValue;
        });

        // 이메일이 이미 존재하면 경고 메시지 표시
        if (emailExists) {
            showPopup("사용 중인 이메일입니다.");
        } else {
            // 새로운 사용자 추가
            USER_DATA.push({ email: emailValue, password: passwordValue });
            window.location.href = "/login/login.html"; // 로그인 페이지로 이동
        }
    });

    // 비밀번호 표시/숨기기 기능
    passwordToggle.addEventListener("click", function () {
        if (passwordInput.value.trim() !== "") {
            togglePasswordVisibility(passwordInput, passwordToggle);
        }
    });

    // 비밀번호 확인 표시/숨기기 기능
    confirmPasswordToggle.addEventListener("click", function () {
        if (confirmPasswordInput.value.trim() !== "") {
            togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
        }
    });
});

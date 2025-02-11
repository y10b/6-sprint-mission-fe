document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login_btn");
    const emailError = document.getElementById("email-error").querySelector("p");
    const passwordError = document.getElementById("password-error").querySelector("p");
    const passwordToggle = document.querySelector(".passwordINPUT i");
    const popup = document.getElementById("popup");
    const popupBg = document.getElementById("popup-bg");
    const popupText = document.querySelector(".popup-text");
    const popupClose = document.getElementById("popup-close");

    // 사용자 데이터 (예시 데이터베이스)
    const USER_DATA = [
        { email: 'codeit1@codeit.com', password: "codeit101!" },
        { email: 'codeit2@codeit.com', password: "codeit202!" },
        { email: 'codeit3@codeit.com', password: "codeit303!" },
        { email: 'codeit4@codeit.com', password: "codeit404!" },
        { email: 'codeit5@codeit.com', password: "codeit505!" },
        { email: 'codeit6@codeit.com', password: "codeit606!" },
    ];

    // 팝업을 띄우는 함수
    function showPopup(message) {
        popupText.textContent = message; // 메시지 설정
        popup.style.display = "block";
        popupBg.style.display = "block";
    }

    // 팝업을 닫는 함수
    function hidePopup() {
        popup.style.display = "none";
        popupBg.style.display = "none";
    }

    // 이메일 유효성 검사
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 비밀번호 유효성 검사 (8자 이상)
    function isValidPassword(password) {
        return password.length >= 8;
    }

    // 에러 메시지 표시
    function showError(errorElement, message, inputElement) {
        inputElement.classList.add("error");
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    // 에러 메시지 숨기기
    function hideError(errorElement, inputElement) {
        inputElement.classList.remove("error");
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }

    // 이메일 입력값 체크
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            showError(emailError, "이메일을 입력해주세요.", emailInput);
        } else if (!isValidEmail(emailValue)) {
            showError(emailError, "잘못된 이메일 형식입니다.", emailInput);
        } else {
            hideError(emailError, emailInput);
        }
        checkFormValidity();
    }

    // 비밀번호 입력값 체크
    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            showError(passwordError, "비밀번호를 입력해주세요.", passwordInput);
        } else if (!isValidPassword(passwordValue)) {
            showError(passwordError, "비밀번호는 8자 이상이어야 합니다.", passwordInput);
        } else {
            hideError(passwordError, passwordInput);
        }
        checkFormValidity();
    }

    // 로그인 버튼 활성화 여부 확인
    function checkFormValidity() {
        loginButton.disabled = !(emailInput.value.trim() && passwordInput.value.trim() && !emailError.textContent && !passwordError.textContent);
    }

    // 로그인 처리
    function handleLogin(event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!emailValue || !passwordValue) {
            showPopup("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        const user = USER_DATA.find(user => user.email === emailValue);

        if (!user) {
            showPopup("이메일이 존재하지 않습니다.");
            return;
        }

        if (user.password !== passwordValue) {
            showPopup("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 로그인 성공 시 바로 페이지 이동
        window.location.href = "/items";
    }

    // 비밀번호 표시/숨기기 기능
    function togglePasswordVisibility() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordToggle.classList.replace("fa-eye-slash", "fa-eye");
        } else {
            passwordInput.type = "password";
            passwordToggle.classList.replace("fa-eye", "fa-eye-slash");
        }
    }

    // 이벤트 리스너 추가
    emailInput.addEventListener("input", validateEmail);
    passwordInput.addEventListener("input", validatePassword);
    loginButton.addEventListener("click", handleLogin);
    passwordToggle.addEventListener("click", togglePasswordVisibility);
    popupClose.addEventListener("click", hidePopup);
    popupBg.addEventListener("click", hidePopup); // 배경 클릭 시 닫기

    // 초기 폼 상태 확인
    checkFormValidity();
});

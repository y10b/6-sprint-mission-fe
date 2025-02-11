document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const signUpButton = document.getElementById("sign_btn");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");
    const passwordToggle = document.querySelector(".passwordINPUT i");
    const confirmPasswordToggle = document.querySelector(".confirm-passwordINPUT i");

    const popupBg = document.getElementById("popup-bg");
    const popup = document.getElementById("popup");
    const popupText = popup.querySelector(".popup-text");
    const popupClose = document.getElementById("popup-close");

    const USER_DATA = [
        { email: 'codeit1@codeit.com', password: "codeit101!" },
        { email: 'codeit2@codeit.com', password: "codeit202!" },
        { email: 'codeit3@codeit.com', password: "codeit303!" },
        { email: 'codeit4@codeit.com', password: "codeit404!" },
        { email: 'codeit5@codeit.com', password: "codeit505!" },
        { email: 'codeit6@codeit.com', password: "codeit606!" },
    ];

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPassword(password) {
        return password.length >= 8;
    }

    function isPasswordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    function checkFormValidity() {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        if (
            emailValue &&
            passwordValue &&
            confirmPasswordValue &&
            !emailInput.classList.contains("error") &&
            !passwordInput.classList.contains("error") &&
            !confirmPasswordInput.classList.contains("error")
        ) {
            signUpButton.disabled = false;
        } else {
            signUpButton.disabled = true;
        }
    }

    emailInput.addEventListener("input", function () {
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            showError(emailError, "이메일을 입력해주세요.", emailInput);
        } else if (!isValidEmail(emailValue)) {
            showError(emailError, "잘못된 이메일 형식입니다.", emailInput);
        } else {
            hideError(emailError, emailInput);
        }
        checkFormValidity();
    });

    passwordInput.addEventListener("input", function () {
        const passwordValue = passwordInput.value.trim();

        if (passwordValue === "") {
            showError(passwordError, "비밀번호를 입력해주세요.", passwordInput);
        } else if (!isValidPassword(passwordValue)) {
            showError(passwordError, "비밀번호는 8자 이상이어야 합니다.", passwordInput);
        } else {
            hideError(passwordError, passwordInput);
        }

        const confirmPasswordValue = confirmPasswordInput.value.trim();
        if (confirmPasswordValue !== "" && !isPasswordsMatch(passwordValue, confirmPasswordValue)) {
            showError(confirmPasswordError, "비밀번호가 일치하지 않습니다.", confirmPasswordInput);
        } else {
            hideError(confirmPasswordError, confirmPasswordInput);
        }

        checkFormValidity();
    });

    confirmPasswordInput.addEventListener("input", function () {
        const confirmPasswordValue = confirmPasswordInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        if (confirmPasswordValue === "") {
            showError(confirmPasswordError, "비밀번호 확인을 입력해주세요.", confirmPasswordInput);
        } else if (!isPasswordsMatch(passwordValue, confirmPasswordValue)) {
            showError(confirmPasswordError, "비밀번호가 일치하지 않습니다.", confirmPasswordInput);
        } else {
            hideError(confirmPasswordError, confirmPasswordInput);
        }

        checkFormValidity();
    });

    function showError(errorElement, message, inputElement) {
        inputElement.classList.add("error");
        errorElement.querySelector("p").textContent = message;
        errorElement.querySelector("p").style.display = "block";
    }

    function hideError(errorElement, inputElement) {
        inputElement.classList.remove("error");
        errorElement.querySelector("p").style.display = "none";
    }

    checkFormValidity();

    /* 비밀번호 표시/숨기기 기능 */
    function togglePasswordVisibility(inputElement, toggleElement) {
        if (inputElement.type === "password") {
            inputElement.type = "text";
            toggleElement.classList.replace("fa-eye-slash", "fa-eye");
        } else {
            inputElement.type = "password";
            toggleElement.classList.replace("fa-eye", "fa-eye-slash");
        }
    }

    passwordToggle.addEventListener("click", function () {
        if (passwordInput.value.trim() !== "") {
            togglePasswordVisibility(passwordInput, passwordToggle);
        }
    });

    confirmPasswordToggle.addEventListener("click", function () {
        if (confirmPasswordInput.value.trim() !== "") {
            togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
        }
    });

    /* 이메일 중복 체크 및 회원가입 처리 */
    signUpButton.addEventListener("click", function (event) {
        event.preventDefault(); // 버튼 클릭 시 페이지 리로드 방지

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        // 이메일 중복 체크
        const emailExists = USER_DATA.some(function (user) {
            return user.email === emailValue;
        });

        if (emailExists) {
            // 중복된 이메일이 있으면 팝업을 띄우기
            showPopup("사용 중인 이메일입니다.");
        } else {
            // 중복된 이메일이 없으면 회원가입 성공 처리
            USER_DATA.push({ email: emailValue, password: passwordValue });
            window.location.href = "/login/login.html";
        }
    });

    /* 팝업 표시 및 닫기 기능 */
    function showPopup(message) {
        popupText.textContent = message;
        popup.style.display = "block";
        popupBg.style.display = "block";
    }

    popupClose.addEventListener("click", function () {
        popup.style.display = "none";
        popupBg.style.display = "none";
    });
});

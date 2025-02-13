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

    const USER_DATA = [
        { email: 'codeit1@codeit.com', password: "codeit101!" },
        { email: 'codeit2@codeit.com', password: "codeit202!" },
        { email: 'codeit3@codeit.com', password: "codeit303!" },
        { email: 'codeit4@codeit.com', password: "codeit404!" },
        { email: 'codeit5@codeit.com', password: "codeit505!" },
        { email: 'codeit6@codeit.com', password: "codeit606!" },
    ];

    emailInput.addEventListener("input", function () {
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            showError(emailError, "이메일을 입력해주세요.", emailInput);
        } else if (!isValidEmail(emailValue)) {
            showError(emailError, "잘못된 이메일 형식입니다.", emailInput);
        } else {
            hideError(emailError, emailInput);
        }
        checkFormValidity([emailInput, passwordInput, confirmPasswordInput], signUpButton, [emailError, passwordError, confirmPasswordError]);
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
        if (confirmPasswordValue !== "" && passwordValue !== confirmPasswordValue) {
            showError(confirmPasswordError, "비밀번호가 일치하지 않습니다.", confirmPasswordInput);
        } else {
            hideError(confirmPasswordError, confirmPasswordInput);
        }
        checkFormValidity([emailInput, passwordInput, confirmPasswordInput], signUpButton, [emailError, passwordError, confirmPasswordError]);
    });

    confirmPasswordInput.addEventListener("input", function () {
        const confirmPasswordValue = confirmPasswordInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        if (confirmPasswordValue === "") {
            showError(confirmPasswordError, "비밀번호 확인을 입력해주세요.", confirmPasswordInput);
        } else if (passwordValue !== confirmPasswordValue) {
            showError(confirmPasswordError, "비밀번호가 일치하지 않습니다.", confirmPasswordInput);
        } else {
            hideError(confirmPasswordError, confirmPasswordInput);
        }
        checkFormValidity([emailInput, passwordInput, confirmPasswordInput], signUpButton, [emailError, passwordError, confirmPasswordError]);
    });

    signUpButton.addEventListener("click", function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // 이메일 중복 체크
        const emailExists = USER_DATA.some(function (user) {
            return user.email === emailValue;
        });

        if (emailExists) {
            showPopup("사용 중인 이메일입니다.");
        } else {
            USER_DATA.push({ email: emailValue, password: passwordValue });
            window.location.href = "/login/login.html";
        }
    });

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
});

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login_btn");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const passwordToggle = document.querySelector(".passwordINPUT i");

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
        if (emailValue === "") {
            showError(emailError, "이메일을 입력해주세요.", emailInput);
        } else if (!isValidEmail(emailValue)) {
            showError(emailError, "잘못된 이메일 형식입니다.", emailInput);
        } else {
            hideError(emailError, emailInput);
        }
        checkFormValidity([emailInput, passwordInput], loginButton, [emailError, passwordError]);
    });

    // 비밀번호 입력값 체크
    passwordInput.addEventListener("input", function () {
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            showError(passwordError, "비밀번호를 입력해주세요.", passwordInput);
        } else if (!isValidPassword(passwordValue)) {
            showError(passwordError, "비밀번호는 8자 이상이어야 합니다.", passwordInput);
        } else {
            hideError(passwordError, passwordInput);
        }
        checkFormValidity([emailInput, passwordInput], loginButton, [emailError, passwordError]);
    });

    // 로그인 처리
    loginButton.addEventListener("click", function (event) {
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
    });

    // 비밀번호 표시/숨기기 기능
    passwordToggle.addEventListener("click", function () {
        if (passwordInput.value.trim() !== "") {
            togglePasswordVisibility(passwordInput, passwordToggle);
        }
    });
});

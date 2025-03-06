document.addEventListener("DOMContentLoaded", function () {

    // DOM 요소 변수 선언
    const emailInput = document.getElementById("email"); // 이메일 입력 필드
    const passwordInput = document.getElementById("password"); // 비밀번호 입력 필드
    const loginButton = document.getElementById("login_btn"); // 로그인 버튼
    const emailError = document.getElementById("email-error"); // 이메일 오류 메시지 영역
    const passwordError = document.getElementById("password-error"); // 비밀번호 오류 메시지 영역
    const passwordToggle = document.querySelector(".password-input i"); // 비밀번호 표시/숨기기 아이콘
    const headerNav = document.querySelector("header nav"); // 헤더 내 네비게이션 요소
    const userProfileImg = "src\img\profile.png"; // 기본 프로필 이미지 경로 (로그인 성공 시 사용할 이미지)

    // 사용자 데이터 배열 (이메일과 비밀번호, 프로필 이미지 추가)
    const USER_DATA = [
        { email: 'codeit1@codeit.com', password: "codeit101!", profileImage: "img/user1.jpg" },
        { email: 'codeit2@codeit.com', password: "codeit202!", profileImage: "img/user2.jpg" },
        { email: 'codeit3@codeit.com', password: "codeit303!", profileImage: "img/user3.jpg" },
        { email: 'codeit4@codeit.com', password: "codeit404!", profileImage: "img/user4.jpg" },
        { email: 'codeit5@codeit.com', password: "codeit505!", profileImage: "img/user5.jpg" },
        { email: 'codeit6@codeit.com', password: "codeit606!", profileImage: "img/user6.jpg" },
    ];

    // 이메일 입력값 체크
    emailInput.addEventListener("input", function () {
        const emailValue = emailInput.value.trim();

        if (emailValue === "") {
            showError(emailError, "이메일을 입력해주세요.", emailInput);
        }
        else if (!isValidEmail(emailValue)) {
            showError(emailError, "잘못된 이메일 형식입니다.", emailInput);
        }
        else {
            hideError(emailError, emailInput);
        }

        checkFormValidity([emailInput, passwordInput], loginButton, [emailError, passwordError]);
    });

    // 비밀번호 입력값 체크
    passwordInput.addEventListener("input", function () {
        const passwordValue = passwordInput.value.trim();

        if (passwordValue === "") {
            showError(passwordError, "비밀번호를 입력해주세요.", passwordInput);
        }
        else if (!isValidPassword(passwordValue)) {
            showError(passwordError, "비밀번호는 8자 이상이어야 합니다.", passwordInput);
        }
        else {
            hideError(passwordError, passwordInput);
        }

        checkFormValidity([emailInput, passwordInput], loginButton, [emailError, passwordError]);
    });

    // 로그인 버튼 클릭 시 처리
    loginButton.addEventListener("click", function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!emailValue || !passwordValue) {
            showPopup("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        // 이메일로 사용자 검색
        const user = USER_DATA.find(user => user.email === emailValue);

        if (!user) {
            showPopup("이메일이 존재하지 않습니다.");
            return;
        }

        // 비밀번호가 일치하지 않으면 경고 메시지 표시
        if (user.password !== passwordValue) {
            showPopup("비밀번호가 일치하지 않습니다.");
            return;
        }
        // 페이지 이동
        setTimeout(function () {
            window.location.href = "../index.html";
        }, 500);
        showProfileImage(user.profileImage);

    });

    // 비밀번호 표시/숨기기 기능
    passwordToggle.addEventListener("click", function () {
        if (passwordInput.value.trim() !== "") {
            togglePasswordVisibility(passwordInput, passwordToggle);
        }
    });

    // 프로필 이미지 표시 함수
    function showProfileImage(imageSrc) {
        // 로그인 후 헤더의 버튼을 프로필 이미지로 교체
        const profileImage = document.createElement("img");
        profileImage.src = imageSrc;
        profileImage.alt = "Profile Image";
        profileImage.style.width = "40px";
        profileImage.style.height = "40px";
        profileImage.style.borderRadius = "50%";

        // 기존 로그인 버튼을 프로필 이미지로 교체
        const loginButton = document.querySelector("header nav button");
        loginButton.replaceWith(profileImage);
    }
});

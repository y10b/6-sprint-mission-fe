
const popup = document.getElementById("popup");
const popupBg = document.getElementById("popup-bg");
const popupText = popup.querySelector(".popup-text");
const popupClose = document.getElementById("popup-close");

// 공통된 팝업 표시 함수
function showPopup(message) {
    popupText.textContent = message;
    popup.style.display = "block";
    popupBg.style.display = "block";
}

// 공통된 팝업 닫기 함수
function hidePopup() {
    const popup = document.getElementById("popup");
    const popupBg = document.getElementById("popup-bg");

    popup.style.display = "none";
    popupBg.style.display = "none";
}

// 팝업 닫기 버튼에 이벤트 리스너 추가
popupClose.addEventListener("click", hidePopup);

// 팝업 배경을 클릭했을 때도 팝업이 닫히도록 설정
popupBg.addEventListener("click", hidePopup);

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
    errorElement.querySelector("p").textContent = message;
    errorElement.querySelector("p").style.display = "block";
}

// 에러 메시지 숨기기
function hideError(errorElement, inputElement) {
    inputElement.classList.remove("error");
    errorElement.querySelector("p").style.display = "none";
}

// 비밀번호 표시/숨기기 기능
function togglePasswordVisibility(inputElement, toggleElement) {
    if (inputElement.type === "password") {
        inputElement.type = "text";
        toggleElement.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        inputElement.type = "password";
        toggleElement.classList.replace("fa-eye", "fa-eye-slash");
    }
}

// 폼 유효성 검사
function checkFormValidity(inputs, button, errorElements) {
    const isValid = inputs.every(input => input.value.trim() && !input.classList.contains("error"));
    button.disabled = !isValid;
}

const emailForm = document.querySelector('#email');
const nameForm = document.querySelector('#userName');
const pwForm = document.querySelector('#password');
const checkPwForm = document.querySelector('#checkPW');
const signupButton = document.querySelector('button[type="submit"]');

emailForm.addEventListener('keyup', validateForm);
nameForm.addEventListener('keyup', validateForm);
pwForm.addEventListener('keyup', validateForm);
checkPwForm.addEventListener('keyup', validateForm);

function validateForm() {
  const allFilled = emailForm.value && nameForm.value && pwForm.value && checkPwForm.value;
  const pwMatch = pwForm.value === checkPwForm.value;

  if (allFilled && pwMatch) {
    signupButton.disabled = false;
    signupButton.classList.add('active'); // Add active class for styling
  } else {
    signupButton.disabled = true;
    signupButton.classList.remove('active');
  }
}


// 비밀번호 표시/숨김 토글 기능
function togglePassword(icon) {
  // 아이콘과 연결된 input 요소 찾기
  const input = icon.closest(".password-container").querySelector("input");

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "visibility"; // 눈 모양 아이콘 변경
  } else {
    input.type = "password";
    icon.textContent = "visibility_off"; // 가려진 눈 아이콘 변경
  }
}
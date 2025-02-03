const emailForm = document.querySelector('#email');
const pwForm = document.querySelector('#password');
const loginButton = document.querySelector('.btnLogin'); 


emailForm.addEventListener('keyup', activeEvent);
pwForm.addEventListener('keyup', activeEvent);
loginButton.addEventListener('click', errorEvent);

function activeEvent() {
  if (emailForm.value && pwForm.value) {
    loginButton.disabled = false;
    loginButton.classList.add('active');
  } else {
    loginButton.disabled = true;
    loginButton.classList.remove('active');
  }
}

function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.querySelector(".toggle-password");

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "visibility"; // 눈 아이콘 변경
  } else {
    input.type = "password";
    icon.textContent = "visibility_off"; // 가려진 눈 아이콘 변경
  }
}
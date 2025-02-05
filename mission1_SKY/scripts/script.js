document.addEventListener("DOMContentLoaded", () => {
  const passwordType = document.querySelector('.password');
  const passwordCheckType = document.querySelector('.password-check');

  const toggleButton = document.querySelector('.hide-pw');
  const toggleButtonCheck = document.querySelector('.hide-pw-check');

  toggleButton.addEventListener('click', () => {
    if (passwordType.type === "password") {
      passwordType.type = "text";
      toggleButton.style.backgroundImage = "url('img/eye-open.png')";
    } else {
      passwordType.type = "password";
      toggleButton.style.backgroundImage = "url('img/eye-close.png')";
    }
  });

  toggleButtonCheck.addEventListener('click', () => {
    if (passwordCheckType.type === "password") {
      passwordCheckType.type = "text";
      toggleButtonCheck.style.backgroundImage = "url('img/eye-open.png')";
    } else {
      passwordCheckType.type = "password";
      toggleButtonCheck.style.backgroundImage = "url('img/eye-close.png')";
    }
  });
});
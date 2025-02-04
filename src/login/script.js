$(document).ready(function () {
    $('.to_password i').on('click', function () {
        let passwordInput = $(this).siblings('input'); // 현재 클릭된 아이콘의 형제 요소인 input을 찾음

        if (passwordInput.val().trim() !== '') {
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).attr('class', 'fa-regular fa-eye'); // 눈 뜬 아이콘
            } else {
                passwordInput.attr('type', 'password');
                $(this).attr('class', 'fa-regular fa-eye-slash'); // 눈 감은 아이콘
            }
        }
    });
});

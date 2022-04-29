//Password confirmation

$('#signup-username, #signup-password, #confirm-password').on('keyup', function () {
    let good = true;
    if ($('#signup-password').val() == $('#confirm-password').val()) {
        //Ensure passwords match
        $('#confirm-password-error').html("");
    } else {
        $('#confirm-password-error').html("Passwords do not match");
        good = false;
    }

    if ($('#signup-password').val().trim() == '' || $('#signup-username').val().trim() == '') {
        //Ensure username and password not empty
        good = false;
    }

    if (!good) {
        $('#submit-signup').prop('disabled', true);
    } else {
        $('#submit-signup').prop('disabled', false);
    }
});


const SIGNUP_BUTTON = document.getElementById("submit-signup");
const SIGNUP_USERNAME = document.getElementById("signup-username");
const SIGNUP_PASSWORD = document.getElementById("signup-password");
const SIGNUP_ERROR = document.getElementById("signup-error");

SIGNUP_BUTTON.addEventListener("click", () => {
    $.post("/adduser", {
        username: SIGNUP_USERNAME.value,
        password: SIGNUP_PASSWORD.value
    }, function (data,status) {
        if (data == "success") {
            window.location.href = "home";
        } else {
            SIGNUP_ERROR.innerHTML = data;
        }

    });

});

const LOGIN_BUTTON = document.getElementById("submit-login");
const LOGIN_USERNAME = document.getElementById("login-username");
const LOGIN_PASSWORD = document.getElementById("login-password");
const LOGIN_ERROR = document.getElementById("login-error");

LOGIN_BUTTON.addEventListener("click", () => {
    $.post("/login", {
        username: LOGIN_USERNAME.value,
        password: LOGIN_PASSWORD.value
    }, function (data,status) {
        if (data == "success") {
            window.location.href = "home";
        } else {
            LOGIN_ERROR.innerHTML = data;
        }

    });

});
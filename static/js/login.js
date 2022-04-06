//Password confirmation

$('#username, #password, #confirm-password').on('keyup', function () {
    let good = true;
    if ($('#password').val() == $('#confirm-password').val()) {
        //Ensure passwords match
        $('#confirm-password-error').addClass("hidden");
    } else {
        $('#confirm-password-error').removeClass("hidden");
        good = false;
    }

    if ($('#password').val().trim() == '' || $('#username').val().trim() == '') {
        //Ensure username and password not empty
        good = false;
    }

    if (!good) {
        $('#submit-signup').prop('disabled', true);
    } else {
        $('#submit-signup').prop('disabled', false);
    }
});

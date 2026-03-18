function showSuccessMessage(message) {
    Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
    });
}

function showErrorMessage(message) {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Try again',
    });
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailPattern.test(email);
}

function isStrongPassword(password) {
    // Check for a minimum length and at least one letter and one number
    return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

document.getElementsByClassName('signin-btn')[0].addEventListener('click', function() {
    const email = document.getElementsByClassName('email')[0].value.trim();
    const password = document.getElementsByClassName('password')[0].value;
    console.log('email');

    // Validate email and password
    if (!email || !password) {
        return showErrorMessage('Please enter both email and password.');
    }
    if (!isValidEmail(email)) {
        return showErrorMessage('Please enter a valid email address.');
    }
    if (!isStrongPassword(password)) {
        return showErrorMessage('Password must be at least 6 characters long and contain at least one letter and one number.');
    }

    // Save user credentials to localStorage (consider security implications)
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    console.log(localStorage);

    showSuccessMessage('You have successfully signed up!');
    document.getElementById('sign-up-modal').style.display = 'none'; 
});
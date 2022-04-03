"use strict";
const registerButton = document.getElementById("register-btn");
const registerForm = document.getElementById("register-form");
registerButton === null || registerButton === void 0 ? void 0 : registerButton.addEventListener("click", (ev) => {
    ev.preventDefault();
    const password = document.getElementById("password-input");
    const repPassword = document.getElementById("rep-password-input");
    if (password.value !== repPassword.value) {
        alert("Provided passwords do not match");
    }
    else {
        registerForm.submit();
    }
});

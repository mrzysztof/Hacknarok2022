"use strict";
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const registrationBtn = document.getElementById("register-button");
registrationBtn === null || registrationBtn === void 0 ? void 0 : registrationBtn.addEventListener("click", () => {
    window.location.href = "/register";
});
loginBtn === null || loginBtn === void 0 ? void 0 : loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email-input");
    const password = document.getElementById("password-input");
    fetch("https://floating-escarpment-35869.herokuapp.com/login", {
        method: "POST",
        body: JSON.stringify({
            "user_name": email.value,
            "password": password.value
        })
    })
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.error("Error:", error));
});

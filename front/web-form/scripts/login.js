"use strict";
const loginForm = document.getElementById("login-form");
const registrationBtn = document.getElementById("register-button");
registrationBtn === null || registrationBtn === void 0 ? void 0 : registrationBtn.addEventListener("click", () => {
    window.location.href = "/register";
});

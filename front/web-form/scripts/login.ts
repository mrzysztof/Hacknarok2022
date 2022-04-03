const loginForm = document.getElementById("login-form") as HTMLFormElement;
const registrationBtn = document.getElementById("register-button");

registrationBtn?.addEventListener("click", () => {
    window.location.href = "/register"
});



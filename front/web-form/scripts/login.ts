const loginForm = document.getElementById("login-form") as HTMLFormElement;
const loginBtn = document.getElementById("login-btn");
const registrationBtn = document.getElementById("register-button");

registrationBtn?.addEventListener("click", () => {
    window.location.href = "/register"
});

loginBtn?.addEventListener("click", () => {
    const email = document.getElementById("email-input") as HTMLInputElement;
    const password = document.getElementById("password-input") as HTMLInputElement;
    fetch("https://floating-escarpment-35869.herokuapp.com/login", {
        method: "POST",
        body : JSON.stringify({
            "user_name" : email.value,
            "password" : password.value
        })
    })
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.error("Error:", error));
})



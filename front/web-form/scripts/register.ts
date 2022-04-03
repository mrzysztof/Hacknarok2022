const registerButton = document.getElementById("register-btn");
const registerForm = document.getElementById("register-form") as HTMLFormElement;

registerButton?.addEventListener("click", (ev) => {
    ev.preventDefault();
    const password = document.getElementById("password-input") as HTMLInputElement;
    const repPassword = document.getElementById("rep-password-input") as HTMLInputElement;
    if(password.value !== repPassword.value){
        alert("Provided passwords do not match");
    }
    else{
        registerForm.submit();
    }
});

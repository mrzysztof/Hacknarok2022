const baseURL = "https://floating-escarpment-35869.herokuapp.com";
const registerButton = document.getElementById("register-btn");

registerButton?.addEventListener("click", () => {
    const email = document.getElementById("email-input") as HTMLInputElement;
    const password = document.getElementById("password-input") as HTMLInputElement;
    const repPassword = document.getElementById("rep-password-input") as HTMLInputElement;
    
    if(password.value !== repPassword.value){
        alert("Provided passwords do not match");
    }
    else{
        const formData = new FormData();
        formData.append("user_name" , email.value);
        formData.append("password" , password.value);
        fetch(new URL("update_user", baseURL).toString(), {
            method: "POST",
            body: formData
        })
        .then(response => {
            if(response.status == 200){
                alert("Registered successfully. You can login now.");
                window.location.href = new URL("login", baseURL).toString();
            }
            else if(response.status == 400){
                alert("Provided email is already in use.");
            }
        })
        .catch(err => console.error(err));
    }
});

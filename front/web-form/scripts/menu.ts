const contactForm = document.getElementById("contact-form");
let switches = Array.from(document.getElementsByClassName("form-check-input")) as HTMLInputElement[];

switches.forEach((opt) => {
    const optionName = opt.id;
    const isChecked = opt.checked;
    opt.addEventListener("change", () => {
        fetch("https://floating-escarpment-35869.herokuapp.com/update_user", {
            method: 'POST',
            body: JSON.stringify({optionName : isChecked})
        }).catch(err => console.error("Error:", err));
    });
});

function init(){
    
}


const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-btn");
const token = localStorage.getItem("token");

let switches = Array.from(document.getElementsByClassName("form-check-input")) as HTMLInputElement[];

function init(){
    
}

switches.forEach((opt) => {
    const optionName = opt.id;
    const isChecked = opt.checked;
    opt.addEventListener("change", () => {
        fetch("https://floating-escarpment-35869.herokuapp.com/update_user", {
            method: 'POST',
            body: JSON.stringify({optionName : isChecked}),
            headers: {
                'Content-Type': 'application/json',
                "x-access-token" : token ? token : "0"
              }
        }).catch(err => console.error("Error:", err));
    });
});

contactBtn?.addEventListener("click", () => {
    const name = document.getElementById("contact-name-input");
    const number = document.getElementById("contact-number-input");
    fetch("https://floating-escarpment-35869.herokuapp.com/update_user", {
        method: "POST",
        body: JSON.stringify({
            "name" : name,
            "number" : number
        }),
        headers: {
            'Content-Type': 'application/json',
            "x-access-token" : token ? token : "0"
          }
    })

})


const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-btn");
const token = localStorage.getItem("token");

let switches = Array.from(document.getElementsByClassName("form-check-input")) as HTMLInputElement[];
let options = [];
let contacts = [];



switches.forEach((opt) => {
    let fd = new FormData();
    fd.append(opt.id, opt.checked.toString());
    opt.addEventListener("change", () => {
        fetch("https://floating-escarpment-35869.herokuapp.com/update_user", {
            method: 'POST',
            body: fd,
            headers: {
                'Content-Type': 'application/json',
                "x-access-token" : token ? token : ""
              }
        }).catch(err => console.error("Error:", err));
    });
});

contactBtn?.addEventListener("click", () => {
    let fd = new FormData();
    const name = document.getElementById("contact-name-input") as HTMLInputElement;
    const number = document.getElementById("contact-number-input") as HTMLInputElement;
    fd.append("name" , name.value);
    fd.append("number" , number.value);
    fetch("https://floating-escarpment-35869.herokuapp.com/update_user", {
        method: "POST",
        body: fd,
        headers: {
            'Content-Type': 'application/json',
            "x-access-token" : token ? token : "0"
          }
    })

})


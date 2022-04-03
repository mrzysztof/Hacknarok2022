"use strict";
const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-btn");
const token = localStorage.getItem("token");
let switches = Array.from(document.getElementsByClassName("form-check-input"));
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
                "x-access-token": token ? token : ""
            }
        }).catch(err => console.error("Error:", err));
    });
});
contactBtn === null || contactBtn === void 0 ? void 0 : contactBtn.addEventListener("click", () => {
    let fd = new FormData();
    const name = document.getElementById("contact-name-input");
    const number = document.getElementById("contact-number-input");
    fd.append("name", name.value);
    fd.append("number", number.value);
    fetch("https://floating-escarpment-35869.herokuapp.com/update_user", {
        method: "POST",
        body: fd,
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": token ? token : "0"
        }
    });
});

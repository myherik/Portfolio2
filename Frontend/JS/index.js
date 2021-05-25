// loads the input fields and buttons as variables
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

// method for loging in
const login = () => {
    const user = {
        username: loginUsername.value,
        password: loginPassword.value
    }
    // sending login request to backend
    fetch("/login", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(data => {
            // checking that we get the username back
            if (data.body.username !== undefined) {
                // redirects to game
                sessionStorage.setItem("username", data.body.username);
                window.location.href = "/game"
            } else {
                // displays error message
                loginMessage.innerText = data.body.message;
                loginPassword.value = "";
                loginPassword.focus();
            }
        });
}

loginUsername.focus();

// eventlistener for enterclick in username to move focus to password
loginUsername.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        loginPassword.focus();
    }
})

// eventlistener for enterclick to call the login method
loginPassword.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        login();
    }
})

// method for register user
const register = () => {
    const user = {
        username: regUsername.value,
        password: regPassword.value
    }
    // calling register in backend
    fetch("/register", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(data => {
            // showing the message from backend
            regMessage.innerText = data.body.message;
            console.log(data);
        });
}

// eventlistener for enterclick in username to focus password
regUsername.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        regPassword.focus();
    }
})
// eventlistener for enterclick in password to call register method
regPassword.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        register();
    }
})

// switches between login an register form
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
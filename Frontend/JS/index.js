const login = () => {
    const user = {
        username: document.getElementById("loginNm").value,
        password: document.getElementById("loginPwd").value
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
            console.log(data.body.username);
            if (data.body.username !== undefined) {
                sessionStorage.setItem("username", data.body.username);
                window.location.href = "/game"
            }
        });
}

const register = () => {
    const user = {
        username: document.getElementById("regNm").value,
        password: document.getElementById("regPwd").value
    }
    console.log(user);
    fetch("/register", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(user)
    }).then(res => res.json())
        .then(data => {
            console.log(data);
        });
}

const toggle = () => {

    if (document.getElementById("login").classList.contains("show")) {
        document.getElementById("login").classList.remove("show");
        document.getElementById("login").classList.add("hidden");
        document.getElementById("reg").classList.remove("hidden");
        document.getElementById("reg").classList.add("show");

        document.getElementById("togglebutton").innerText = "Login"

    } else {
        document.getElementById("login").classList.remove("hidden");
        document.getElementById("login").classList.add("show");
        document.getElementById("reg").classList.remove("show");
        document.getElementById("reg").classList.add("hidden");

        document.getElementById("togglebutton").innerText = "Register"
    }
}
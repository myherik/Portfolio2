let id_token = null;

function onSignIn(googleUser){ // function for signing in with google authorization
    var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    id_token = googleUser.getAuthResponse().id_token;
    console.log(`ID Token to pass to server: ${id_token}`)

    fetch("/google", {// google API endpoint
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ token: id_token })
    })
        .then(response => response.json()
            .then(data => {
                if (data.status === 'success') {
                    sessionStorage.setItem('username', data.body.username);
                    signOut();
                    window.location.href = "/game"
                } else {
                    console.log("google not working!")
                }
            }))
}

const signOut = () => { // google signout function
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    id_token = null;
}
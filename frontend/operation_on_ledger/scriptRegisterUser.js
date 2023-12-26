// scriptToRegisterUser.js

function registerUser() {
    const username = document.getElementById('username').value;

    // Mock API call
    fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            orgName: 'Org1',
        }),
    })
    .then(response => response.json())
    .then(data => {
        displayToken(data.message, data.token);
    })
    .catch(error => console.error('Error:', error));
}

function displayToken(message, token) {
    document.getElementById('message').innerText = message;
    document.getElementById('token').innerText = 'Token: ' + token;
    document.getElementById('token-display').style.display = 'block';
}

function copyToken() {
    const tokenElement = document.getElementById('token');
    const tokenValue = tokenElement.innerText.replace('Token: ', ''); // Remove the "Token: " prefix
    const textarea = document.createElement('textarea');
    textarea.value = tokenValue;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Token copied to clipboard!');
}

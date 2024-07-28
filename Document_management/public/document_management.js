async function checkLoginStatus() {
    const response = await fetch('http://localhost:5001/check-login', {
        method: 'GET',
        credentials: 'include'
    });

    const result = await response.json();
    if (result.loggedIn) {
        document.getElementById('employee-section').style.display = 'block';
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
    }
}

function logout() {
    fetch('http://localhost:5001/logout', {
        method: 'GET',
        credentials: 'include'
    }).then(() => {
        window.location.href = 'index.html';
    });
}

document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const docType = document.getElementById('docType').value;
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('file', file);

    const response = await fetch('http://localhost:5001/upload-document', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    if (response.ok) {
        const document = await response.json();
        const documentList = document.getElementById('document-list');
        const li = document.createElement('li');
        li.textContent = `${document.docType}: ${document.fileName}`;
        documentList.appendChild(li);
    } else {
        console.error('Error uploading document:', response.statusText);
    }
    fileInput.value = ''; // Reset the file input
});

window.onload = checkLoginStatus;

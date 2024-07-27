document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    let currentIndex = 0;

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(showNextSlide, 3000);
});

document.addEventListener('DOMContentLoaded', function() {
    // Resident Section
    const residentSection = document.getElementById('resident-section');
    const employeeSection = document.getElementById('employee-section');
    const documentContainer = document.getElementById('document-container');
    const retrievedContainer = document.getElementById('retrieved-container');

    // Storage for uploaded documents
    const uploadedDocuments = [];

    // Generate unique ID
    function generateUniqueId(type, userId) {
        const timestamp = Date.now();
        return `${type}_${userId}_${timestamp}`;
    }

    // Show Resident Section
    window.showResidentSection = function() {
        residentSection.classList.add('active');
        employeeSection.classList.remove('active');
    };

    // Show Employee Section
    window.showEmployeeSection = function() {
        residentSection.classList.remove('active');
        employeeSection.classList.add('active');
    };

    // Upload Document
    window.uploadDocument = function() {
        const documentType = document.getElementById('document-type').value;
        const documentFile = document.getElementById('document-file').files[0];
        const userId = generateUniqueId('user', Math.floor(Math.random() * 1000)); // Example user ID generation

        if (documentFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const documentId = generateUniqueId(documentType, userId);
                const documentData = {
                    id: documentId,
                    type: documentType,
                    file: e.target.result,
                    name: documentFile.name,
                    userId: userId
                };
                uploadedDocuments.push(documentData);
                displayUploadedDocuments();
            };
            reader.readAsDataURL(documentFile);
        }
    };

    function displayUploadedDocuments() {
        documentContainer.innerHTML = '';
        uploadedDocuments.forEach((doc, index) => {
            const docDiv = document.createElement('div');
            docDiv.className = 'document-item';
            docDiv.innerHTML = `
                <strong>${doc.type}</strong>
                <p>${doc.name}</p>
                <p>ID: ${doc.id}</p>
                <a href="${doc.file}" download="${doc.name}">Download</a>
            `;
            documentContainer.appendChild(docDiv);
        });
    }

    // Retrieve Documents
    window.retrieveDocuments = function() {
        const retrieveType = document.getElementById('retrieve-type').value;
        const retrieveCategory = document.getElementById('retrieve-category').value;

        let filteredDocuments = uploadedDocuments;

        if (retrieveType !== 'all') {
            filteredDocuments = filteredDocuments.filter(doc => doc.type === retrieveType);
        }

        // Simulate filtering by category if necessary
        // Currently, just fetching all documents regardless of category
        displayRetrievedDocuments(filteredDocuments);
    };

    function displayRetrievedDocuments(documents) {
        retrievedContainer.innerHTML = '';
        documents.forEach((doc, index) => {
            const docDiv = document.createElement('div');
            docDiv.className = 'document-item';
            docDiv.innerHTML = `
                <strong>${doc.type}</strong>
                <p>${doc.name}</p>
                <p>ID: ${doc.id}</p>
                <a href="${doc.file}" download="${doc.name}">Download</a>
            `;
            retrievedContainer.appendChild(docDiv);
        });
    }

    // Send Documents to Designation
    window.sendDocuments = function() {
        const sendDesignation = document.getElementById('send-designation').value;
        const retrievedDocuments = document.querySelectorAll('#retrieved-container .document-item');

        if (retrievedDocuments.length > 0) {
            retrievedDocuments.forEach(doc => {
                // Append a message to the chat of the selected designation (for simplicity, just an alert here)
                const message = `Document sent to ${sendDesignation}: ${doc.innerHTML}`;
                alert(message); // Replace this with actual chat sending logic
            });
            alert(`Documents sent to ${sendDesignation} successfully.`);
        } else {
            alert('No documents to send.');
        }
    };
});


document.addEventListener('DOMContentLoaded', function() {
    // Mock data for employees
    const employees = [
        { id: 1, name: 'Arjun Singh', position: 'Manager', chat: [] },
        { id: 2, name: 'Ravi Kumar', position: 'Engineer', chat: [] },
        { id: 3, name: 'Sneha Gupta', position: 'HR', chat: [] },
        { id: 4, name: 'Ananya Verma', position: 'Designer', chat: [] },
        { id: 5, name: 'Vikas Reddy', position: 'Developer', chat: [] },
        { id: 6, name: 'Priya Sharma', position: 'Marketing', chat: [] },
        { id: 7, name: 'Manoj Patil', position: 'Sales', chat: [] },
        { id: 8, name: 'Nisha Agarwal', position: 'Support', chat: [] },
        { id: 9, name: 'Karan Mehta', position: 'Finance', chat: [] },
        { id: 10, name: 'Anil Rao', position: 'Operations', chat: [] }
    ];

    document.getElementById('employee-list').addEventListener('click', function(event) {
        if (event.target && event.target.closest('.employee-card')) {
            selectEmployee(event.target.closest('.employee-card').dataset.id);
        }
    });

    document.getElementById('chat-form').addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage();
    });

    // Store selected employee
    let selectedEmployee = null;

    function selectEmployee(employeeId) {
        selectedEmployee = employees.find(emp => emp.id == employeeId);
        if (selectedEmployee) {
            displayEmployeeDetails(selectedEmployee);
            displayChatMessages(selectedEmployee.chat);
        }
    }

    function displayEmployeeDetails(employee) {
        const chatHeader = document.getElementById('chat-header');
        chatHeader.innerHTML = `<h3>${employee.name} - ${employee.position}</h3>`;
    }

    function displayChatMessages(chat) {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = ''; // Clear previous messages
        chat.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message';
            messageDiv.innerHTML = `<span class="message-text">${msg}</span>`;
            chatMessages.appendChild(messageDiv);
        });
    }

    function sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value;

        if (message.trim() !== '' && selectedEmployee) {
            selectedEmployee.chat.push(message);
            displayChatMessages(selectedEmployee.chat);
            chatInput.value = ''; // Clear input
        }
    }

    function sendFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (selectedEmployee) {
                const fileLink = `<a href="${e.target.result}" download="${file.name}">${file.name}</a>`;
                selectedEmployee.chat.push(fileLink);
                displayChatMessages(selectedEmployee.chat);
            }
        };
        reader.readAsDataURL(file);
    }

    function getSelectedEmployees() {
        const selected = [];
        document.querySelectorAll('.employee-select:checked').forEach(checkbox => {
            const employeeId = parseInt(checkbox.dataset.id, 10);
            const employee = employees.find(emp => emp.id === employeeId);
            if (employee) {
                selected.push(employee);
            }
        });
        return selected;
    }

    window.sendGroupDocuments = function() {
        const selectedEmployees = getSelectedEmployees();
        const files = document.getElementById('group-documents').files;

        if (selectedEmployees.length > 0 && files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileLink = `<a href="${e.target.result}" download="${file.name}">${file.name}</a>`;
                    selectedEmployees.forEach(employee => {
                        employee.chat.push(fileLink);
                    });
                    displayChatMessages(selectedEmployee.chat); // Refresh the chat of the currently selected employee
                };
                reader.readAsDataURL(file);
            });
            alert(`Document sent to ${selectedEmployees.length} employees successfully.`);
        } else {
            alert('Please select at least one employee and one document.');
        }
    };

    window.scheduleGoogleMeeting = function() {
        const selectedEmployees = getSelectedEmployees();
        const date = document.getElementById('meeting-date').value;
        const time = document.getElementById('meeting-time').value;
        const url = document.getElementById('meeting-url').value;

        if (selectedEmployees.length > 0 && date && time && url) {
            const meetingDetails = `Meeting scheduled on ${date} at ${time}. Join using this link: <a href="${url}" target="_blank">${url}</a>`;
            selectedEmployees.forEach(employee => {
                employee.chat.push(meetingDetails);
            });
            displayChatMessages(selectedEmployee.chat); // Refresh the chat of the currently selected employee
            alert(`Meeting link sent to ${selectedEmployees.length} employees successfully.`);
        } else {
            alert('Please select at least one employee and fill in all meeting details.');
        }
    };
});

// Function to fetch and display documents
function fetchDocuments() {
    fetch('php/documents.php')
        .then(response => response.json())
        .then(data => {
            const documentList = document.getElementById('document-list');
            if (documentList) {
                documentList.innerHTML = ''; // Clear the list before adding new documents
                data.forEach(doc => {
                    const docDiv = document.createElement('div');
                    docDiv.classList.add('document');
                    docDiv.innerHTML = `
                        <h3>${doc.title}</h3>
                        <p>Uploaded by: ${doc.username}</p>
                        <a href="${doc.file_path}" download>Download</a>
                    `;
                    documentList.appendChild(docDiv);
                });
            }
        });
}

// Initialize Firebase (copy your config here)
const firebaseConfig = {
    apiKey: "AIzaSyCLkCNfknbt8-KyIESr17MgjPu-k9GzGtw",
    authDomain: "eoffice-2567f.firebaseapp.com",
    databaseURL: "https://eoffice-2567f-default-rtdb.firebaseio.com",
    projectId: "eoffice-2567f",
    storageBucket: "eoffice-2567f.appspot.com",
    messagingSenderId: "278745781755",
    appId: "1:278745781755:web:35204184f14e4c3259675e",
    measurementId: "G-VNY5VKBVX0"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


// Function to fetch and display workflows
function fetchWorkflows() {
    fetch('php/workflows.php')
        .then(response => response.json())
        .then(data => {
            const workflowList = document.getElementById('workflow-list');
            workflowList.innerHTML = ''; // Clear the list before adding new workflows
            data.forEach(workflow => {
                const workflowDiv = document.createElement('div');
                workflowDiv.classList.add('workflow');
                workflowDiv.innerHTML = `
                    <h3>${workflow.title}</h3>
                    <p>${workflow.description}</p>
                    <p>Status: ${workflow.status}</p>
                `;
                workflowList.appendChild(workflowDiv);
            });
        });
}

// Function to fetch and display tasks
function fetchTasks() {
    fetch('php/tasks.php')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = ''; // Clear the list before adding new tasks
            data.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task');
                taskDiv.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>Assigned to: ${task.username}</p>
                    <p>Due date: ${task.due_date}</p>
                    <p>Status: ${task.status}</p>
                `;
                taskList.appendChild(taskDiv);
            });
        });
}

// Function to fetch and display employees
function fetchEmployees() {
    fetch('php/employees.php')
        .then(response => response.json())
        .then(data => {
            const employeeList = document.getElementById('employee-list');
            employeeList.innerHTML = ''; // Clear the list before adding new employees
            data.forEach(employee => {
                const employeeDiv = document.createElement('div');
                employeeDiv.classList.add('employee');
                employeeDiv.innerHTML = `
                    <h3>${employee.name}</h3>
                    <p>Position: ${employee.position}</p>
                    <p>Contact: ${employee.contact}</p>
                `;
                employeeList.appendChild(employeeDiv);
            });
        });
}

// Event listeners to fetch data on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('document-list')) {
        fetchDocuments();
    }
    if (document.getElementById('workflow-list')) {
        fetchWorkflows();
    }
    if (document.getElementById('task-list')) {
        fetchTasks();
    }
    if (document.getElementById('employee-list')) {
        fetchEmployees();
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const documentList = document.getElementById('document-list');
    if (documentList) {
        console.log('document-list element found.');
        fetchDocuments();
    } else {
        console.error('document-list element not found.');
    }
});

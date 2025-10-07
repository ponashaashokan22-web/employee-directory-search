// Initialize employees array from localStorage or empty array
let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Load employees when page loads
window.addEventListener('DOMContentLoaded', () => {
    displayEmployees();
});

// Add employee function
function addEmployee() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const positionInput = document.getElementById('positionInput');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const position = positionInput.value;

    // Validation
    if (name === '' || email === '' || position === '') {
        alert('Please fill in all fields');
        return;
    }

    // Email validation - accepts single character emails like s@gmail.com
    const emailPattern = /^.+@.+..+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Check for duplicate email
    const isDuplicate = employees.some(emp => emp.email.toLowerCase() === email.toLowerCase());
    if (isDuplicate) {
        alert('An employee with this email already exists');
        return;
    }

    // Create employee object
    const employee = {
        id: Date.now(),
        name: name,
        email: email,
        position: position
    };

    // Add to array
    employees.push(employee);

    // Save to localStorage
    saveToLocalStorage();

    // Clear inputs
    nameInput.value = '';
    emailInput.value = '';
    positionInput.value = '';

    // Refresh display
    displayEmployees();

    // Focus back to name input
    nameInput.focus();

    // Success message
    console.log('Employee added successfully!');
}

// Display employees function
function displayEmployees() {
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';

    if (employees.length === 0) {
        employeeList.innerHTML = '<li class="empty-message">No employees added yet. Add your first employee above!</li>';
        return;
    }

    employees.forEach(employee => {
        const li = document.createElement('li');
        li.className = 'employee-item';
        
        li.innerHTML = `
            <div class="employee-info">
                <span class="employee-name">${escapeHtml(employee.name)}</span>
                <span class="employee-email">${escapeHtml(employee.email)}</span>
                <span class="employee-position">${escapeHtml(employee.position)}</span>
            </div>
            <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Delete</button>
        `;
        
        employeeList.appendChild(li);
    });
}

// Delete employee function
function deleteEmployee(id) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        saveToLocalStorage();
        displayEmployees();
    }
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to add employee
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'nameInput' || 
            activeElement.id === 'emailInput' || 
            activeElement.id === 'positionInput') {
            addEmployee();
        }
    }
});

// Search functionality (bonus feature)
function searchEmployees(searchTerm) {
    const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered;
}
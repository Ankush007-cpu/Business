// Utility to save data in localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Utility to get data from localStorage
function getData(key) {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Initialize or load existing users and transactions from localStorage
let users = getData('users') || [];
let transactions = getData('transactions') || [];
let dueCustomers = getData('dueCustomers') || [];

// Authentication Section
function showSignup() {
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function signup() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    // Check if the user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        alert('User already exists!');
        return;
    }

    users.push({ username, password });
    saveData('users', users); // Save to localStorage
    alert('Sign Up Successful!');
    showLogin();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const userExists = users.some(user => user.username === username && user.password === password);

    if (userExists) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        alert('Invalid credentials!');
    }
}

// Due Customer Section
function addDueCustomer() {
    const name = document.getElementById('dueCustomerName').value;
    const date = document.getElementById('dueDate').value;
    const amount = parseFloat(document.getElementById('dueAmount').value);

    if (name && date && amount) {
        dueCustomers.push({ name, date, amount });
        saveData('dueCustomers', dueCustomers); // Save to localStorage
        updateDueCustomerList();
        updateSummary();
    } else {
        alert('Please enter all due customer details');
    }
}

function updateDueCustomerList() {
    const dueCustomerList = document.getElementById('dueCustomerList');
    dueCustomerList.innerHTML = '';

    dueCustomers.forEach((customer, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.date}</td>
            <td>${customer.amount}</td>
            <td><button onclick="removeDueCustomer(${index})">Remove</button></td>
        `;
        dueCustomerList.appendChild(row);
    });
}

function removeDueCustomer(index) {
    dueCustomers.splice(index, 1);
    saveData('dueCustomers', dueCustomers); // Save updated list to localStorage
    updateDueCustomerList();
    updateSummary();
}

// Transaction Section
function handleItemChange() {
    const itemSelect = document.getElementById('itemSelect').value;
    const rechargeProviderDiv = document.getElementById('rechargeProviderDiv');
    const onlineWorkDiv = document.getElementById('onlineWorkDiv');

    // Show/Hide based on selected item
    if (itemSelect === 'Recharge') {
        rechargeProviderDiv.style.display = 'block';
        onlineWorkDiv.style.display = 'none';
    } else if (itemSelect === 'Online Work') {
        onlineWorkDiv.style.display = 'block';
        rechargeProviderDiv.style.display = 'none';
    } else {
        rechargeProviderDiv.style.display = 'none';
        onlineWorkDiv.style.display = 'none';
    }
}

function addTransaction(event) {
    event.preventDefault();
    const item = document.getElementById('itemSelect').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const date = document.getElementById('date').value;
    const name = document.getElementById('name').value;

    let transactionAmount = 0;
    let earning = 0;

    // Calculate based on item
    switch (item) {
        case 'BW Xerox':
            transactionAmount = quantity * 2;
            earning = transactionAmount;
            break;
        case 'Colour Xerox':
            transactionAmount = quantity * 5;
            earning = transactionAmount;
            break;
        case 'Colour Print':
            transactionAmount = quantity * 10;
            earning = transactionAmount;
            break;
        case 'BW Print':
            transactionAmount = quantity * 5;
            earning = transactionAmount;
            break;
        case 'Withdraw':
            transactionAmount = quantity;
            earning = calculateEarnings(quantity, [1000, 5000], [10, 50]);
            break;
        case 'Deposit':
            transactionAmount = quantity;
            earning = calculateEarnings(quantity, [1000, 5000], [10, 50]);
            break;
        case 'Photo':
            transactionAmount = calculatePhotoEarnings(quantity);
            earning = transactionAmount;
            break;
        case 'Pan':
            transactionAmount = quantity * 200;
            earning = transactionAmount;
            break;
        case 'Recharge':
            transactionAmount = quantity;
            earning = calculateRechargeEarnings(quantity);
            break;
        case 'Online Work':
            transactionAmount = quantity;
            const workEarning = parseFloat(document.getElementById('workEarning').value);
            earning = workEarning;
            break;
        default:
            alert('Invalid item selected');
            return;
    }

    transactions.push({ name, date, item, quantity, transactionAmount, earning });
    saveData('transactions', transactions); // Save to localStorage
    updateTransactionList();
    updateSummary();
}

function calculatePhotoEarnings(quantity) {
    switch (quantity) {
        case 2:
            return 20;
        case 4:
            return 30;
        case 6:
            return 40;
        case 8:
            return 50;
        case 12:
            return 60;
        default:
            return 0; // Return 0 for unsupported quantities
    }
}

function calculateEarnings(amount, limits, earnings) {
    if (amount <= limits[0]) return earnings[0];
    if (amount <= limits[1]) return Math.floor(amount / 1000) * earnings[0];
    return earnings[1];
}

function calculateRechargeEarnings(amount) {
    const provider = document.getElementById('rechargeProvider').value;
    const rates = {
        Airtel: 1.30,
        Voda: 3.40,
        Jio: 0.50,
        BSNL: 4.50,
        DTH: 3.20
    };
    return (amount / 100) * rates[provider];
}

function updateTransactionList() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.name}</td>
            <td>${transaction.date}</td>
            <td>${transaction.item}</td>
            <td>${transaction.quantity}</td>
            <td>${transaction.transactionAmount}</td>
            <td>${transaction.earning}</td>
            <td><button onclick="removeTransaction(${index})">Remove</button></td>
        `;
        transactionList.appendChild(row);
    });
}

function removeTransaction(index) {
    transactions.splice(index, 1);
    saveData('transactions', transactions); // Save updated list to localStorage
    updateTransactionList();
    updateSummary();
}

// Summary Update
function updateSummary() {
    const totalTransactions = transactions.reduce((sum, transaction) => sum + transaction.transactionAmount, 0);
    const totalEarnings = transactions.reduce((sum, transaction) => sum + transaction.earning, 0);
    const totalDues = dueCustomers.reduce((sum, customer) => sum + customer.amount, 0);

    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('totalEarnings').textContent = totalEarnings;
    document.getElementById('totalDues').textContent = totalDues;
}

// Forgot Password Placeholder
function forgotPassword() {
    alert('Forgot Password functionality is not implemented yet.');
}

// Initialize the app by loading the data from localStorage
window.onload = function() {
    updateTransactionList();
    updateDueCustomerList();
    updateSummary();
}

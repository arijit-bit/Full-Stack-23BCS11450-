document.addEventListener('DOMContentLoaded', () => {
    // Initialize application
    const userNameElement = document.getElementById('user-name');
    const currentDateElement = document.getElementById('current-date-time');

    // User data with local storage persistence
    let user = JSON.parse(localStorage.getItem('bankingUser')) || {
        name: 'John Doe',
        accounts: [],
        transactions: []
    };

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('bankingUser', JSON.stringify(user));
    }

    // Generate unique account ID
    function generateAccountId() {
        return Date.now().toString();
    }

    // Set user information
    userNameElement.textContent = user.name;
    updateDateTime();

    // Update date/time every second
    function updateDateTime() {
        currentDateElement.textContent = new Date().toLocaleString();
    }
    setInterval(updateDateTime, 1000);

    // Initialize dashboard on load
    updateDashboard();
    updateAccountsList();
    updateTransactionsList();
    populateAccountSelects();

    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active classes
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));

            // Add active classes
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Update content when switching tabs
            if (targetTab === 'dashboard') {
                updateDashboard();
            } else if (targetTab === 'transactions') {
                updateTransactionsList();
            }
        });
    });

    // Modal functionality
    const addAccountBtn = document.getElementById('add-account-btn');
    const addAccountModal = document.getElementById('add-account-modal');
    const cancelAccountBtn = document.getElementById('cancel-account');
    const closeBtn = document.querySelector('.close');

    addAccountBtn.addEventListener('click', () => {
        addAccountModal.style.display = 'flex';
    });

    cancelAccountBtn.addEventListener('click', () => {
        addAccountModal.style.display = 'none';
        document.getElementById('add-account-form').reset();
    });

    closeBtn.addEventListener('click', () => {
        addAccountModal.style.display = 'none';
        document.getElementById('add-account-form').reset();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addAccountModal) {
            addAccountModal.style.display = 'none';
            document.getElementById('add-account-form').reset();
        }
    });

    // Create account
    const addAccountForm = document.getElementById('add-account-form');
    addAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accountName = document.getElementById('account-name').value.trim();
        const accountType = document.getElementById('account-type').value;
        const initialDeposit = parseFloat(document.getElementById('initial-deposit').value);

        // Validation
        if (!accountName || !accountType || isNaN(initialDeposit) || initialDeposit < 0) {
            showMessage('Please fill all fields with valid data.', 'error');
            return;
        }

        // Check for duplicate account names
        if (user.accounts.some(acc => acc.name.toLowerCase() === accountName.toLowerCase())) {
            showMessage('Account name already exists.', 'error');
            return;
        }

        // Add the account
        const account = {
            id: generateAccountId(),
            name: accountName,
            type: accountType,
            balance: initialDeposit,
            createdDate: new Date()
        };

        user.accounts.push(account);

        // Add initial deposit transaction if amount > 0
        if (initialDeposit > 0) {
            user.transactions.push({
                id: generateAccountId(),
                date: new Date(),
                account: accountName,
                type: 'deposit',
                description: 'Initial deposit',
                amount: initialDeposit,
                balance: initialDeposit
            });
        }

        saveUserData();
        updateAccountsList();
        updateDashboard();
        populateAccountSelects();
        addAccountModal.style.display = 'none';
        addAccountForm.reset();
        showMessage('Account created successfully!', 'success');
    });

    // Transaction forms
    const depositForm = document.getElementById('deposit-form');
    const withdrawForm = document.getElementById('withdraw-form');
    const transferForm = document.getElementById('transfer-form');

    // Deposit functionality
    depositForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accountName = document.getElementById('deposit-account').value;
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        const description = document.getElementById('deposit-description').value.trim() || 'Deposit';

        if (!accountName || isNaN(amount) || amount <= 0) {
            showMessage('Please select an account and enter a valid amount.', 'error');
            return;
        }

        const account = user.accounts.find(acc => acc.name === accountName);
        if (!account) {
            showMessage('Account not found.', 'error');
            return;
        }

        account.balance += amount;
        user.transactions.push({
            id: generateAccountId(),
            date: new Date(),
            account: accountName,
            type: 'deposit',
            description: description,
            amount: amount,
            balance: account.balance
        });

        saveUserData();
        updateAccountsList();
        updateDashboard();
        updateTransactionsList();
        depositForm.reset();
        showMessage(`Successfully deposited $${amount.toFixed(2)}!`, 'success');
    });

    // Withdrawal functionality
    withdrawForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accountName = document.getElementById('withdraw-account').value;
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const description = document.getElementById('withdraw-description').value.trim() || 'Withdrawal';

        if (!accountName || isNaN(amount) || amount <= 0) {
            showMessage('Please select an account and enter a valid amount.', 'error');
            return;
        }

        const account = user.accounts.find(acc => acc.name === accountName);
        if (!account) {
            showMessage('Account not found.', 'error');
            return;
        }

        if (account.balance < amount) {
            showMessage('Insufficient funds for withdrawal.', 'error');
            return;
        }

        account.balance -= amount;
        user.transactions.push({
            id: generateAccountId(),
            date: new Date(),
            account: accountName,
            type: 'withdrawal',
            description: description,
            amount: amount,
            balance: account.balance
        });

        saveUserData();
        updateAccountsList();
        updateDashboard();
        updateTransactionsList();
        withdrawForm.reset();
        showMessage(`Successfully withdrew $${amount.toFixed(2)}!`, 'success');
    });

    // Transfer functionality
    transferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fromAccountName = document.getElementById('transfer-from').value;
        const toAccountName = document.getElementById('transfer-to').value;
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        const description = document.getElementById('transfer-description').value.trim() || 'Transfer';

        if (!fromAccountName || !toAccountName || isNaN(amount) || amount <= 0) {
            showMessage('Please select valid accounts and enter a valid amount.', 'error');
            return;
        }

        if (fromAccountName === toAccountName) {
            showMessage('Cannot transfer to the same account.', 'error');
            return;
        }

        const fromAccount = user.accounts.find(acc => acc.name === fromAccountName);
        const toAccount = user.accounts.find(acc => acc.name === toAccountName);

        if (!fromAccount || !toAccount) {
            showMessage('One or both accounts not found.', 'error');
            return;
        }

        if (fromAccount.balance < amount) {
            showMessage('Insufficient funds for transfer.', 'error');
            return;
        }

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        // Add transfer out transaction
        user.transactions.push({
            id: generateAccountId(),
            date: new Date(),
            account: fromAccountName,
            type: 'transfer',
            description: `Transfer to ${toAccountName}: ${description}`,
            amount: -amount,
            balance: fromAccount.balance
        });

        // Add transfer in transaction
        user.transactions.push({
            id: generateAccountId(),
            date: new Date(),
            account: toAccountName,
            type: 'transfer',
            description: `Transfer from ${fromAccountName}: ${description}`,
            amount: amount,
            balance: toAccount.balance
        });

        saveUserData();
        updateAccountsList();
        updateDashboard();
        updateTransactionsList();
        transferForm.reset();
        showMessage(`Successfully transferred $${amount.toFixed(2)}!`, 'success');
    });

    // Update functions
    function updateDashboard() {
        const totalBalance = user.accounts.reduce((sum, acc) => sum + acc.balance, 0);
        const activeAccounts = user.accounts.length;
        const totalTransactions = user.transactions.length;
        
        // Calculate this month's activity
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyActivity = user.transactions
            .filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        document.getElementById('total-balance').textContent = `$${totalBalance.toFixed(2)}`;
        document.getElementById('active-accounts').textContent = activeAccounts;
        document.getElementById('total-transactions').textContent = totalTransactions;
        document.getElementById('monthly-activity').textContent = `$${monthlyActivity.toFixed(2)}`;

        // Update recent transactions
        updateRecentTransactions();
    }

    function updateRecentTransactions() {
        const recentTransactions = document.getElementById('recent-transactions');
        const recent = user.transactions.slice(-5).reverse();

        if (recent.length === 0) {
            recentTransactions.innerHTML = '<p class="no-data">No recent transactions</p>';
        } else {
            recentTransactions.innerHTML = recent.map(t => `
                <div class="transaction-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <div>
                        <strong>${t.account}</strong><br>
                        <small>${t.description}</small>
                    </div>
                    <div style="text-align: right;">
                        <strong class="${t.amount >= 0 ? 'text-success' : 'text-danger'}">$${t.amount.toFixed(2)}</strong><br>
                        <small>${new Date(t.date).toLocaleDateString()}</small>
                    </div>
                </div>
            `).join('');
        }
    }

    function updateAccountsList() {
        const accountsList = document.getElementById('accounts-list');
        
        if (user.accounts.length === 0) {
            accountsList.innerHTML = '<p class="no-data">No accounts created yet</p>';
        } else {
            accountsList.innerHTML = user.accounts.map(account => `
                <div class="account-item">
                    <h3>${account.name}</h3>
                    <p><strong>Type:</strong> ${account.type.charAt(0).toUpperCase() + account.type.slice(1)}</p>
                    <p><strong>Balance:</strong> $${account.balance.toFixed(2)}</p>
                    <p><strong>Created:</strong> ${new Date(account.createdDate).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
    }

    function updateTransactionsList() {
        const transactionsList = document.getElementById('transactions-body');
        
        if (user.transactions.length === 0) {
            transactionsList.innerHTML = '<p class="no-data">No transactions found</p>';
        } else {
            const sortedTransactions = user.transactions.slice().reverse();
            transactionsList.innerHTML = sortedTransactions.map(transaction => `
                <div class="transaction-row">
                    <div>${new Date(transaction.date).toLocaleDateString()}</div>
                    <div>${transaction.account}</div>
                    <div><span class="transaction-type ${transaction.type}">${transaction.type}</span></div>
                    <div>${transaction.description}</div>
                    <div class="${transaction.amount >= 0 ? 'text-success' : 'text-danger'}">$${transaction.amount.toFixed(2)}</div>
                    <div>$${transaction.balance.toFixed(2)}</div>
                </div>
            `).join('');
        }
    }

    function populateAccountSelects() {
        const selects = [
            'deposit-account',
            'withdraw-account',
            'transfer-from',
            'transfer-to',
            'filter-account'
        ];

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            const currentValue = select.value;
            
            // Keep the first option and clear the rest
            const firstOption = select.querySelector('option').outerHTML;
            select.innerHTML = firstOption;
            
            // Add account options
            user.accounts.forEach(account => {
                const option = document.createElement('option');
                option.value = account.name;
                option.textContent = `${account.name} ($${account.balance.toFixed(2)})`;
                select.appendChild(option);
            });
            
            // Restore selection if still valid
            if (currentValue && user.accounts.some(acc => acc.name === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    function showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 3000);
    }

    // Transaction filtering
    const filterAccount = document.getElementById('filter-account');
    const filterType = document.getElementById('filter-type');

    filterAccount.addEventListener('change', filterTransactions);
    filterType.addEventListener('change', filterTransactions);

    function filterTransactions() {
        const selectedAccount = filterAccount.value;
        const selectedType = filterType.value;
        
        let filteredTransactions = user.transactions;
        
        if (selectedAccount) {
            filteredTransactions = filteredTransactions.filter(t => t.account === selectedAccount);
        }
        
        if (selectedType) {
            filteredTransactions = filteredTransactions.filter(t => t.type === selectedType);
        }
        
        const transactionsList = document.getElementById('transactions-body');
        
        if (filteredTransactions.length === 0) {
            transactionsList.innerHTML = '<p class="no-data">No transactions found</p>';
        } else {
            const sortedTransactions = filteredTransactions.slice().reverse();
            transactionsList.innerHTML = sortedTransactions.map(transaction => `
                <div class="transaction-row">
                    <div>${new Date(transaction.date).toLocaleDateString()}</div>
                    <div>${transaction.account}</div>
                    <div><span class="transaction-type ${transaction.type}">${transaction.type}</span></div>
                    <div>${transaction.description}</div>
                    <div class="${transaction.amount >= 0 ? 'text-success' : 'text-danger'}">$${transaction.amount.toFixed(2)}</div>
                    <div>$${transaction.balance.toFixed(2)}</div>
                </div>
            `).join('');
        }
    }
});


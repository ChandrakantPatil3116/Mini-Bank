// ==========================================
// API CONFIGURATION
// ==========================================

const API = "http://localhost:5000/api";


// ==========================================
// LOGIN / REGISTER UI
// ==========================================

function showRegister() {

    const loginCard =
        document.getElementById("loginCard");

    const registerCard =
        document.getElementById("registerCard");

    if (loginCard) {
        loginCard.classList.add("hidden");
    }

    if (registerCard) {
        registerCard.classList.remove("hidden");
    }
}


function showLogin() {

    const loginCard =
        document.getElementById("loginCard");

    const registerCard =
        document.getElementById("registerCard");

    if (registerCard) {
        registerCard.classList.add("hidden");
    }

    if (loginCard) {
        loginCard.classList.remove("hidden");
    }
}


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            if (
                !name ||
                !email ||
                !password
            ) {

                alert(
                    "Please fill all fields"
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    email,
                                    password
                                })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    alert(
                        "Account created successfully!\n\n" +
                        "Account Number: " +
                        data.accountNumber
                    );

                    registerForm.reset();

                    showLogin();

                } else {

                    alert(
                        data.message ||
                        "Registration failed"
                    );

                }

            } catch (error) {

                console.error(error);

                alert(
                    "Cannot connect to server."
                );

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            if (!email || !password) {

                alert(
                    "Please enter email and password"
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    // Store logged-in user
                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            data.user
                        )
                    );

                    window.location.href =
                        "dashboard.html";

                } else {

                    alert(
                        data.message ||
                        "Login failed"
                    );

                }

            } catch (error) {

                console.error(error);

                alert(
                    "Cannot connect to server."
                );

            }

        }
    );

}


// ==========================================
// GET CURRENT USER
// ==========================================

let user = null;

try {

    user =
        JSON.parse(
            localStorage.getItem("user")
        );

} catch (error) {

    user = null;

}


// ==========================================
// LOAD DASHBOARD
// ==========================================

if (
    window.location.pathname.includes(
        "dashboard.html"
    )
) {

    if (!user) {

        window.location.href =
            "index.html";

    } else {

        loadDashboard();

    }

}


// ==========================================
// LOAD DASHBOARD DATA
// ==========================================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                `${API}/user/${user.id}`
            );

        const currentUser =
            await response.json();

        if (!response.ok) {

            alert(
                currentUser.message ||
                "Unable to load account"
            );

            logout();

            return;
        }

        // Update localStorage
        user = currentUser;

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        // Name
        const nameElement =
            document.getElementById("name");

        if (nameElement) {

            nameElement.innerText =
                user.name;

        }

        // Account number
        const accountElement =
            document.getElementById("account");

        if (accountElement) {

            accountElement.innerText =
                user.accountNumber;

        }

        // Balance
        const balanceElement =
            document.getElementById("balance");

        if (balanceElement) {

            balanceElement.innerText =
                "₹ " +
                Number(user.balance)
                    .toLocaleString("en-IN");

        }

        // Transactions
        loadTransactions();

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server."
        );

    }

}


// ==========================================
// DEPOSIT
// ==========================================

async function deposit() {

    const input =
        document.getElementById(
            "depositAmount"
        );

    const amount =
        Number(input.value);

    if (amount <= 0) {

        alert(
            "Enter a valid amount"
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API}/deposit`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            userId: user.id,
                            amount: amount
                        })
                }
            );

        const data =
            await response.json();

        alert(data.message);

        if (response.ok) {

            input.value = "";

            await loadDashboard();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server."
        );

    }

}


// ==========================================
// WITHDRAW
// ==========================================

async function withdraw() {

    const input =
        document.getElementById(
            "withdrawAmount"
        );

    const amount =
        Number(input.value);

    if (amount <= 0) {

        alert(
            "Enter a valid amount"
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API}/withdraw`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            userId: user.id,
                            amount: amount
                        })
                }
            );

        const data =
            await response.json();

        alert(data.message);

        if (response.ok) {

            input.value = "";

            await loadDashboard();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server."
        );

    }

}


// ==========================================
// TRANSFER
// ==========================================

async function transfer() {

    const receiverInput =
        document.getElementById(
            "receiverAccount"
        );

    const amountInput =
        document.getElementById(
            "transferAmount"
        );

    const receiverAccount =
        receiverInput.value.trim();

    const amount =
        Number(amountInput.value);

    if (
        receiverAccount === "" ||
        amount <= 0
    ) {

        alert(
            "Enter receiver account and amount"
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API}/transfer`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            senderId: user.id,
                            receiverAccount:
                                receiverAccount,
                            amount: amount
                        })
                }
            );

        const data =
            await response.json();

        alert(data.message);

        if (response.ok) {

            receiverInput.value = "";

            amountInput.value = "";

            await loadDashboard();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server."
        );

    }

}


// ==========================================
// TRANSACTION HISTORY
// ==========================================

async function loadTransactions() {

    const tbody =
        document.getElementById(
            "transactionBody"
        );

    if (!tbody || !user) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/transactions/${user.id}`
            );

        const transactions =
            await response.json();

        if (!response.ok) {

            tbody.innerHTML =
                `<tr>
                    <td colspan="4">
                        Unable to load transactions
                    </td>
                </tr>`;

            return;
        }

        tbody.innerHTML = "";

        if (
            transactions.length === 0
        ) {

            tbody.innerHTML =
                `<tr>
                    <td colspan="4">
                        No transactions yet
                    </td>
                </tr>`;

            return;
        }

        transactions.forEach(
            transaction => {

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `

                    <td>
                        ${transaction.type}
                    </td>

                    <td>
                        ₹ ${Number(
                            transaction.amount
                        ).toLocaleString("en-IN")}
                    </td>

                    <td>
                        ${transaction.description}
                    </td>

                    <td>
                        ${new Date(
                            transaction.created_at
                        ).toLocaleString()}
                    </td>

                `;

                tbody.appendChild(row);

            }
        );

    } catch (error) {

        console.error(error);

        tbody.innerHTML =
            `<tr>
                <td colspan="4">
                    Cannot connect to server
                </td>
            </tr>`;

    }

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("user");

    window.location.href =
        "index.html";

}
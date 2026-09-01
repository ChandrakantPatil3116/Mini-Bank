# 🏦 MiniBank

MiniBank is a simple full-stack banking web application designed to demonstrate the core concepts of a digital banking system. Users can create an account, securely log in, manage their balance, deposit and withdraw money, transfer funds to another account, and view their transaction history.

The project uses a **HTML, CSS, and JavaScript frontend** connected to a **Node.js + Express.js backend**, with **MySQL** used for persistent data storage.

---

## 📌 Project Overview

MiniBank provides a basic banking experience through a simple and responsive web interface.

The application allows users to:

* Create a new bank account
* Log in using email and password
* Receive a unique account number
* View account details and available balance
* Deposit money
* Withdraw money
* Transfer money to another account
* View transaction history
* Log out of their account

The dashboard provides separate sections for balance information, banking operations, and transaction history.

---

## ✨ Features

### 👤 User Authentication

* User registration
* User login
* Email-based account identification
* Password hashing using bcrypt
* Client-side session information using `localStorage`
* Logout functionality

### 💰 Account Management

* Automatically generated account number
* Account balance tracking
* Display of user name and account number
* Real-time balance refresh after banking operations

### 💵 Deposit

Users can enter an amount and deposit money into their account.

The deposited amount is added to the user's balance and recorded as a transaction.

### 💸 Withdrawal

Users can withdraw money from their account.

The system checks the available balance before processing the withdrawal and prevents withdrawals when the requested amount exceeds the available balance.

### 🔄 Money Transfer

Users can transfer money using another user's account number.

The application:

* Identifies the receiver's account
* Checks the sender's balance
* Prevents transfers to the same account
* Deducts money from the sender
* Adds money to the receiver
* Records the transfer in transaction history

### 📜 Transaction History

Users can view their previous banking activities, including:

* Transaction type
* Amount
* Description
* Date and time

### 📱 Responsive Interface

The frontend uses responsive CSS so that the banking operation cards adapt to smaller screen sizes.

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Browser Local Storage

### Backend

* Node.js
* Express.js
* REST APIs
* CORS
* bcrypt

### Database

* MySQL
* mysql2

### Configuration

* dotenv

The backend dependencies include Express, CORS, dotenv, MySQL2, and bcrypt.

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │                      │
                    │ HTML + CSS + JS      │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │                      │
                    │ Node.js + Express.js │
                    └──────────┬───────────┘
                               │
                               │ SQL Queries
                               ▼
                    ┌──────────────────────┐
                    │       MySQL          │
                    │                      │
                    │ Users & Transactions │
                    └──────────────────────┘
```

---

## 📂 Project Structure

```text
MiniBank/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── script.js
│   └── style.css
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
└── README.md
```

> **Note:** Do not upload your real `.env` file to GitHub. Add `.env` to `.gitignore` and provide a `.env.example` file instead.

---

## 🔌 API Endpoints

The backend exposes REST API endpoints under the `/api` path.

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| `GET`  | `/`                         | Check whether the API is running  |
| `POST` | `/api/register`             | Create a new user account         |
| `POST` | `/api/login`                | Authenticate a user               |
| `GET`  | `/api/user/:id`             | Retrieve user/account information |
| `POST` | `/api/deposit`              | Deposit money                     |
| `POST` | `/api/withdraw`             | Withdraw money                    |
| `POST` | `/api/transfer`             | Transfer money                    |
| `GET`  | `/api/transactions/:userId` | Retrieve transaction history      |

## The backend uses `/api/register` and `/api/login` for registration and authentication and exposes separate endpoints for user information and banking operations.

## 🗄️ Database

MiniBank uses MySQL as its database.

The backend connects to MySQL using the `mysql2` package and reads database configuration through environment variables.

A typical database configuration uses:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bankingapp
DB_PORT=3306
```

The database stores information required for user accounts and transaction records.

---

## 🔐 Security

The project includes basic security practices for a learning/demo banking application:

* Passwords are hashed using bcrypt before being stored.
* Passwords are not returned to the frontend after authentication.
* SQL queries use parameterized placeholders.
* Database credentials are stored using environment variables.
* CORS is configured on the backend.

The registration flow hashes the supplied password before inserting the user into the database. The login flow compares the supplied password against the stored hash and returns user information without returning the password.

> **Important:** This project is intended for educational purposes and should not be treated as production-ready banking software.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/minibank.git
```

```bash
cd minibank
```

---

### 2. Install backend dependencies

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

The project is configured to start the backend with:

```bash
npm start
```

as defined in `package.json`.

---

### 3. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE bankingapp;
```

Then create the required tables for users and transactions according to your database schema.

---

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bankingapp
DB_PORT=3306
PORT=5000
```

The application uses environment variables for its database connection configuration.

---

### 5. Start the backend

From the `backend` directory:

```bash
npm start
```

The Express application runs on port `5000` by default.

You should see:

```text
MySQL connected
MiniBank server running on port 5000
```

---

### 6. Run the frontend

Open the frontend using a local development server such as **VS Code Live Server**.

Open:

```text
frontend/index.html
```

The frontend communicates with the backend through:

```text
http://localhost:5000/api
```

The JavaScript client is configured with this API base URL.

---

## 🔄 Application Flow

### Registration

```text
User
  │
  ▼
Registration Form
  │
  ▼
POST /api/register
  │
  ▼
Express Backend
  │
  ▼
Password Hashing
  │
  ▼
MySQL
  │
  ▼
Account Number Generated
```

### Login

```text
User
  │
  ▼
Login Form
  │
  ▼
POST /api/login
  │
  ▼
Express Backend
  │
  ▼
Password Verification
  │
  ▼
User Data
  │
  ▼
Dashboard
```

### Banking Operation

```text
Dashboard
    │
    ├── Deposit
    │
    ├── Withdraw
    │
    └── Transfer
           │
           ▼
      REST API
           │
           ▼
      Express.js
           │
           ▼
         MySQL
           │
           ▼
   Updated Balance
           │
           ▼
 Transaction History
```

---

## 🖥️ User Interface

### Login & Registration

The application provides a combined authentication interface where users can switch between login and account creation.

### Dashboard

The dashboard displays:

* User name
* Account number
* Available balance
* Deposit section
* Withdrawal section
* Transfer section
* Transaction history
* Logout option

## These components are implemented in the dashboard page.

## 🧪 Example Usage

### Create an account

```text
Name: Rahul
Email: rahul@example.com
Password: ********
```

After successful registration, the application generates an account number.

### Deposit

```text
Amount: ₹10,000
```

Balance:

```text
₹10,000
```

### Withdraw

```text
Amount: ₹2,000
```

Balance:

```text
₹8,000
```

### Transfer

```text
Receiver Account: AC12345678
Amount: ₹1,000
```

The sender's balance is reduced and the receiver's balance is increased.

---

## 📚 What I Learned

This project helped demonstrate practical concepts including:

* Frontend and backend integration
* REST API development
* Express.js routing
* MySQL database connectivity
* SQL queries
* CRUD-style database operations
* Password hashing
* Environment variables
* HTTP requests using Fetch API
* JSON data exchange
* Client-side local storage
* Basic authentication flow
* Transaction management concepts
* Responsive web design

---

## 🚀 Future Improvements

Possible improvements for future versions include:

* JWT-based authentication
* HTTP-only cookies
* Stronger input validation
* Database transactions for money transfers
* Improved error handling
* Transaction IDs
* Transfer receipts
* User profile management
* Password reset functionality
* Email verification
* Admin dashboard
* Pagination for transaction history
* Search and filtering of transactions
* Better UI notifications
* Deployment to a cloud platform
* Automated testing

---

## ⚠️ Disclaimer

MiniBank is an **educational/demo project** created to practice full-stack web development.

It does not implement the security, compliance, auditing, encryption, fraud prevention, and infrastructure requirements of a real banking system.

**Do not use this application to manage real financial transactions or sensitive banking information.**

---

## 👨‍💻 Author

**Chandrakant Patil**

GitHub: `https://github.com/ChandrakantPatil3116`

---

## 📄 License

This project is available for educational and learning purposes.

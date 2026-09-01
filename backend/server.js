require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());


// ================================
// TEST ROUTE
// ================================

app.get("/", (req, res) => {
    res.json({
        message: "MiniBank API is running"
    });
});


// ================================
// REGISTER
// ================================

app.post("/api/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        // Validate input
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }

        // Check if email already exists
        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, results) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        message: "Database error"
                    });

                }

                if (results.length > 0) {

                    return res.status(400).json({
                        message: "Email already registered"
                    });

                }

                // Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // Generate account number
                const accountNumber =
                    "AC" +
                    Math.floor(
                        10000000 +
                        Math.random() * 90000000
                    );

                const sql = `
                    INSERT INTO users
                    (name, email, password, account_number, balance)
                    VALUES (?, ?, ?, ?, 0)
                `;

                db.query(
                    sql,
                    [
                        name,
                        email,
                        hashedPassword,
                        accountNumber
                    ],
                    (err, result) => {

                        if (err) {

                            console.error(err);

                            return res.status(500).json({
                                message:
                                    "Error registering user"
                            });

                        }

                        res.status(201).json({

                            message:
                                "Account created successfully",

                            accountNumber:
                                accountNumber

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ================================
// LOGIN
// ================================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message:
                "Email and password are required"
        });

    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Database error"
                });

            }

            if (results.length === 0) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }

            const user = results[0];

            const passwordValid =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordValid) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }

            // IMPORTANT:
            // Don't send password to frontend

            res.json({

                message:
                    "Login successful",

                user: {

                    id: user.id,

                    name: user.name,

                    email: user.email,

                    accountNumber:
                        user.account_number,

                    balance:
                        user.balance

                }

            });

        }
    );

});


// ================================
// GET USER
// ================================

app.get("/api/user/:id", (req, res) => {

    const userId = req.params.id;

    db.query(
        `
        SELECT
            id,
            name,
            email,
            account_number,
            balance
        FROM users
        WHERE id = ?
        `,
        [userId],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Database error"
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message:
                        "User not found"
                });

            }

            res.json({

                id: results[0].id,

                name: results[0].name,

                email: results[0].email,

                accountNumber:
                    results[0].account_number,

                balance:
                    results[0].balance

            });

        }
    );

});


// ================================
// DEPOSIT
// ================================

app.post("/api/deposit", (req, res) => {

    const {
        userId,
        amount
    } = req.body;

    const depositAmount =
        Number(amount);

    if (!userId || depositAmount <= 0) {

        return res.status(400).json({
            message:
                "Invalid deposit amount"
        });

    }

    // Update balance
    db.query(
        `
        UPDATE users
        SET balance = balance + ?
        WHERE id = ?
        `,
        [
            depositAmount,
            userId
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Error depositing money"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "User not found"
                });

            }

            // Record transaction
            db.query(
                `
                INSERT INTO transaction
                (user_id, type, amount, description)
                VALUES (?, 'DEPOSIT', ?, ?)
                `,
                [
                    userId,
                    depositAmount,
                    "Money deposited"
                ],
                (err) => {

                    if (err) {
                        console.error(
                            "Transaction error:",
                            err
                        );
                    }

                }
            );

            res.json({
                message:
                    "Money deposited successfully"
            });

        }
    );

});


// ================================
// WITHDRAW
// ================================

app.post("/api/withdraw", (req, res) => {

    const {
        userId,
        amount
    } = req.body;

    const withdrawAmount =
        Number(amount);

    if (!userId || withdrawAmount <= 0) {

        return res.status(400).json({
            message:
                "Invalid withdrawal amount"
        });

    }

    // Get current balance
    db.query(
        `
        SELECT balance
        FROM users
        WHERE id = ?
        `,
        [userId],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Database error"
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message:
                        "User not found"
                });

            }

            const balance =
                Number(results[0].balance);

            // Check balance
            if (withdrawAmount > balance) {

                return res.status(400).json({
                    message:
                        "Insufficient balance"
                });

            }

            // Update balance
            db.query(
                `
                UPDATE users
                SET balance = balance - ?
                WHERE id = ?
                `,
                [
                    withdrawAmount,
                    userId
                ],
                (err, result) => {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            message:
                                "Error withdrawing money"
                        });

                    }

                    // Record transaction
                    db.query(
                        `
                        INSERT INTO transaction
                        (user_id, type, amount, description)
                        VALUES (?, 'WITHDRAW', ?, ?)
                        `,
                        [
                            userId,
                            withdrawAmount,
                            "Money withdrawn"
                        ]
                    );

                    res.json({
                        message:
                            "Money withdrawn successfully"
                    });

                }
            );

        }
    );

});


// ================================
// TRANSFER
// ================================

app.post("/api/transfer", (req, res) => {

    const {
        senderId,
        receiverAccount,
        amount
    } = req.body;

    const transferAmount =
        Number(amount);

    if (
        !senderId ||
        !receiverAccount ||
        transferAmount <= 0
    ) {

        return res.status(400).json({
            message:
                "Invalid transfer details"
        });

    }

    // Get sender
    db.query(
        `
        SELECT
            balance,
            account_number
        FROM users
        WHERE id = ?
        `,
        [senderId],
        (err, senderResults) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Database error"
                });

            }

            if (senderResults.length === 0) {

                return res.status(404).json({
                    message:
                        "Sender not found"
                });

            }

            const sender =
                senderResults[0];

            const senderBalance =
                Number(sender.balance);

            // Check balance
            if (
                transferAmount >
                senderBalance
            ) {

                return res.status(400).json({
                    message:
                        "Insufficient balance"
                });

            }

            // Prevent transfer to same account
            if (
                sender.account_number ===
                receiverAccount
            ) {

                return res.status(400).json({
                    message:
                        "Cannot transfer to your own account"
                });

            }

            // Find receiver
            db.query(
                `
                SELECT id
                FROM users
                WHERE account_number = ?
                `,
                [receiverAccount],
                (err, receiverResults) => {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            message:
                                "Database error"
                        });

                    }

                    if (
                        receiverResults.length === 0
                    ) {

                        return res.status(404).json({
                            message:
                                "Receiver account not found"
                        });

                    }

                    const receiverId =
                        receiverResults[0].id;

                    // Deduct from sender
                    db.query(
                        `
                        UPDATE users
                        SET balance = balance - ?
                        WHERE id = ?
                        `,
                        [
                            transferAmount,
                            senderId
                        ],
                        (err) => {

                            if (err) {

                                console.error(err);

                                return res.status(500).json({
                                    message:
                                        "Transfer failed"
                                });

                            }

                            // Add to receiver
                            db.query(
                                `
                                UPDATE users
                                SET balance = balance + ?
                                WHERE id = ?
                                `,
                                [
                                    transferAmount,
                                    receiverId
                                ],
                                (err) => {

                                    if (err) {

                                        console.error(err);

                                        return res.status(500).json({
                                            message:
                                                "Transfer failed"
                                        });

                                    }

                                    // Sender transaction
                                    db.query(
                                        `
                                        INSERT INTO transaction
                                        (user_id, type, amount, description)
                                        VALUES (?, 'TRANSFER', ?, ?)
                                        `,
                                        [
                                            senderId,
                                            transferAmount,
                                            `Transfer to ${receiverAccount}`
                                        ]
                                    );

                                    // Receiver transaction
                                    db.query(
                                        `
                                        INSERT INTO transaction
                                        (user_id, type, amount, description)
                                        VALUES (?, 'TRANSFER', ?, ?)
                                        `,
                                        [
                                            receiverId,
                                            transferAmount,
                                            `Received from ${sender.account_number}`
                                        ]
                                    );

                                    res.json({
                                        message:
                                            "Money transferred successfully"
                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});


// ================================
// TRANSACTION HISTORY
// ================================

app.get(
    "/api/transactions/:userId",
    (req, res) => {

        const userId =
            req.params.userId;

        db.query(
            `
            SELECT
                id,
                type,
                amount,
                description,
                created_at
            FROM transaction
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId],
            (err, results) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        message:
                            "Error fetching transactions"
                    });

                }

                res.json(results);

            }
        );

    }
);


// ================================
// START SERVER
// ================================

app.listen(
    PORT,
    () => {

        console.log(
            `MiniBank server running on port ${PORT}`
        );

    }
);
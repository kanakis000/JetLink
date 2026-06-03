const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; 

//  User Registration Route
router.post('/register', async (req, res) => {
    console.log("📩 Received Registration Request:", req.body);

    let { username, email, password, phonenumber, role } = req.body;

    //  Accept all three roles
    const validRoles = ["user", "hotel_manager", "restaurant_manager"];
    if (!role || !validRoles.includes(role)) {
        role = "user"; // Default to 'user' if invalid role
    }

    if (!username || !email || !password || !phonenumber) {
        console.log(" Missing fields! Received:", req.body);
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        //  Check if the username or email already exists
        const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkUserQuery, [username, email], async (err, results) => {
            if (err) {
                console.log(" Database Error:", err);
                return res.status(500).json({ message: 'Database error', error: err });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Username or Email already exists!' });
            }

            //  Hash password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            //  Insert user
            const sql = 'INSERT INTO users (username, email, password, phonenumber, role) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [username, email, hashedPassword, phonenumber, role], (err, result) => {
                if (err) {
                    console.log(" Database Error:", err);
                    return res.status(500).json({ message: 'Error registering user', error: err });
                }
                console.log("✅ User Registered:", { username, email, role });
                res.status(201).json({ message: 'User registered successfully!', role });
            });
        });
    } catch (error) {
        console.log(" Server Error:", error);
        res.status(500).json({ message: 'Server error', error });
    }
});


//  **User Login Route**
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user exists
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.log(" Database Error:", err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            console.log(" User not found for email:", email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        console.log("✅ User found:", user);

        // Compare the entered password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log(" Error comparing passwords:", err);
                return res.status(500).json({ message: 'Error processing login' });
            }

            console.log("🔎 Password comparison result:", isMatch);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            //  Include `role` in the JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email, role: user.role },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            console.log(" Login Successful for:", user.username);
            res.json({ 
                message: 'Login successful', 
                token, 
                user: { id: user.id, username: user.username, email: user.email, role: user.role } 
            });
        });
    });
});


module.exports = router;

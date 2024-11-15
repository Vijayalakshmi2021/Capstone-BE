// controllers/userController.js
const User = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    try {
        const { name, email, gender, password, studentID } = req.body;

        // Validate studentID is a 6-digit number
        if (!/^\d{6}$/.test(studentID)) {
            return res.status(400).json({ status: "error", message: "Student ID must be a 6-digit number." });
        }
        // Check for duplicate student ID
        const existingUser = await User.findOne({ studentID });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Student ID already exists." });
        }


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, gender, password: hashedPassword, studentID });
        await user.save();



        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to SVR Hostel',
            text: `Hello ${name},\n\nThank you for Registering with us!! \nYour user ID is ${email}. \nYour password is ${password}. \nYour student ID is ${studentID}.\n\nBest Regards,\nThe Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.json({ status: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error" });
    }
};


exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            // Compare the password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json({ status: "success" });
            } else {
                res.status(401).json({ status: "error", message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ status: "error", message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ status: "success", users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error" });
    }
};
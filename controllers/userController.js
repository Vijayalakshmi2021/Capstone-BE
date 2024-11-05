// userController.js

const User = require("../models/user");

const generateStudentId = () => {
    const prefix = 'STU';
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    const year = new Date().getFullYear().toString().substr(-2); // Last 2 digits of current year
    return `${prefix}${year}${randomNum}`;
};

exports.signup = async (req, res) => {
    try {
        const { name, email, gender, password } = req.body;
        const studentId = generateStudentId(); // Generate student ID
        const user = new User({ name, email, gender, password, studentId }); // Include student ID
        await user.save();
        res.json({ status: "success", studentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user, email);
        if (user) {
            res.json({ status: "success" });
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

exports.Profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Assuming req.user.id is set by an authentication middleware
        if (!user) {
            return res.status(404).json({ status: "error", message: "User  not found" });
        }
        res.json({ status: "success", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
};
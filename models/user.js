// models/user.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    studentID: {
        type: String,
        required: true,
        unique: true,
        length: 6,
    },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
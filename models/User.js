const mongoose = require('mongoose');

const {UserRoles} = require('../enums/UserRole')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: UserRoles.staff,
        enum: [UserRoles.staff, UserRoles.admin, UserRoles.customer],
        required: true,
    },
    refresh_token: {
        type: String,
        required: false,
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);
const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: false
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('customer', customerSchema);
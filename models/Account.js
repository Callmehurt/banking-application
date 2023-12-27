const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: false,
        unique: true
    },
    transaction: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'transaction'
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('account', accountSchema);
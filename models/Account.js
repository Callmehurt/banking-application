const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: false,
        unique: false
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

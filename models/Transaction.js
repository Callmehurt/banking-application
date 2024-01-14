const mongoose = require('mongoose');
const {Types} = require('mongoose');


const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('transaction', transactionSchema);
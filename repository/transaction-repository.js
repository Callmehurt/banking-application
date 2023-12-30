const mongoose = require('mongoose');
const {TransactionModel} = require('../models')
const {APIError, STATUS_CODES} = require('../utils/app-errors');

class TransactionRepository{

    constructor(type, amount){
        this.type = type;
        this.amount = amount;
    }

    async createTransaction(){

        const session = await mongoose.startSession();

        try{

            const data = {
                type: this.type,
                amount: parseFloat(this.amount).toFixed(2)
            }
            // return data;
            await session.startTransaction();
            const transaction = await TransactionModel.create(data);

            await session.commitTransaction();
            return transaction;

        }catch(err){
            console.log(err);
            await session.abortTransaction();
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Transaction create failed"
              );
        }finally{
            await session.endSession();
        }
    }

    async getTransaction({transactionId}){
        try{

            const transaction = await TransactionModel.findById(transactionId);
            return transaction;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Something went wrong"
              );
        }
    }
}

module.exports = TransactionRepository;
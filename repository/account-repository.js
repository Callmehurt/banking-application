const mongoose = require('mongoose');
const {AccountModel} = require('../models')
const {APIError, STATUS_CODES} = require('../utils/app-errors');

class AccountRepository{

    async createAccount({accountNumber, customerId}){
        try{

            const account = new AccountModel({
                accountNumber,
                customerId,
                transaction: []
            });

            const newAccount = await account.save();
            return newAccount;

        }catch(err){
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Account"
              );
        }
    }


    async findAccount({accountNumber}){
        try{

            const account = await AccountModel.findOne({accountNumber: accountNumber}).populate('customerId').populate('transaction');
            if(!account){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.NOT_FOUND,
                    "Data not found"
                  );
            }
            return account;
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Data not found"
              );
        }
    }

    async findAccountViaCustomerId({customerId}){
        try{

            const account = await AccountModel.findOne({customerId: customerId}).populate('customerId').populate('transaction');
            if(!account){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.NOT_FOUND,
                    "Data not found"
                  );
            }
            return account;
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Data not found"
              );
        }
    }

    async fetchAllAccounts(){
        try{

            const account = await AccountModel.find({}).populate('customerId').populate('transaction');
            if(!account){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.NOT_FOUND,
                    "Data not found"
                  );
            }
            return account;
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Data not found"
              );
        }
    }

    async getBalance({accountNumber}){
        try{

            const account = await this.findAccount({accountNumber});
            const transactions = account.transaction;

            if(transactions.length < 1){
                return {
                    balance: parseFloat(0).toFixed(2),
                    totalCredit: parseFloat(0).toFixed(2),
                    totalDebit: parseFloat(0).toFixed(2)
                };
            }

            let balance = 0;
            let totalCredit = 0;
            let totalDebit = 0;
            transactions.map((trans) => {                
                switch (trans.type) {
                    case "credit":
                      balance += parseFloat(trans.amount);
                      totalCredit += parseFloat(trans.amount);
                      break;
                    case "debit":
                      balance -= parseFloat(trans.amount);
                      totalDebit += parseFloat(trans.amount);
                      break;
                    default:
                      balance
                      break;
                  }
            });

            return {
                balance: balance.toFixed(2),
                totalCredit: totalCredit,
                totalDebit: totalDebit
            };

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Cannot get balance"
              );
        }
    }

    async addTransaction({account, transaction}){

        const session = await mongoose.startSession();

        try{

            account.transaction.push(transaction);
            await session.startTransaction();
            await account.save();
            await session.commitTransaction();
            return account;

        }catch(err){
            await session.abortTransaction();
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Data not found"
              );
        }finally{
            await session.endSession();
        }
    }

    // async queryAccountStatement({accountNumber}){
    //     try{

    //         const account = await this.findAccount({accountNumber});
    //         const balance = await this.getBalance({accountNumber});

    //         return {
    //             transactions: account.transaction,
    //             balance: balance
    //         };

    //     }catch(err){
    //         throw new APIError(
    //             "API Error",
    //             STATUS_CODES.INTERNAL_ERROR,
    //             "Cannot get account statement"
    //           );
    //     }
    // }

    async updateAccount(inputs){
        try{

            const {customerId, ...other} = inputs;
            // const customerResult = await CustomerModel.findByIdAndUpdate(customerId, other, {
            //     returnOriginal: false
            // }).exec()
            // return customerResult;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update Customer"
              );
        }   
    }

}

module.exports = AccountRepository;
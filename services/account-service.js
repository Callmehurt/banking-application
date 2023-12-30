const {AccountRepository, TransactionRepository} = require('../repository')
const {APIError, STATUS_CODES} = require('../utils/app-errors');


class AccountService{

    constructor(){
        this.repository = new AccountRepository();
    }

    async createAccount({customerId}){
        try{

            const accountNumber = (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString();
            let account = await this.repository.createAccount({accountNumber, customerId});
            return account;

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

            const account = await this.repository.findAccount({accountNumber});
            return account;

        }catch(err){
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Data not found"
              );
        }
    }

    async addTransaction({fromAccountNumber, toAccountNumber, type, amount}){
        try{

            const transaction = new TransactionRepository(type, amount);
            const newTransaction = await transaction.createTransaction();
            return newTransaction;

        }catch(err){
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Data not found"
              );
        }
    }



}


module.exports = AccountService;
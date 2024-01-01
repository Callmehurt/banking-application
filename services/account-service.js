const {AccountRepository, TransactionRepository} = require('../repository')
const {APIError, STATUS_CODES} = require('../utils/app-errors');
const {Transactions} = require('../enums');
const Transaction = require('../models/Transaction');


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

    async findAccountViaCustomer({customerId}){
        try{

            const account = await this.repository.findAccountViaCustomerId({customerId});
            return account;
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                'Record not found'
            ) 
        }
    }

    async addTransaction({initiatorAccountNumber, receiverAccountNumber, type, amount}){
        try{

            var result = null;
            switch (type) {
                case Transactions.deposit:
                    result = await this.deposit({accountNumber: initiatorAccountNumber, amount});
                    break; 
                case Transactions.withdraw:
                    result = await this.withdraw({accountNumber: initiatorAccountNumber, amount});
                    break;
                case Transactions.transferedTo:
                    result = await this.transfer({initiatorAccountNumber, receiverAccountNumber, amount});
                    break;
                default:
                    result;
                    break;
              }
            
              return result;

        }catch(err){
            throw err;
        }
    }

    async deposit({accountNumber, amount}){
        try{
            var newTransaction = new TransactionRepository('credit', Transactions.deposit, amount);
            var transaction = await newTransaction.createTransaction();
            var initiatorAccount = await this.repository.findAccount({accountNumber});
            var result = await this.repository.addTransaction({account: initiatorAccount, transaction}); 
            return result;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Deposit failed"
              );
        }
    }

    async withdraw({accountNumber, amount}){
        try{
            var initiatorAccount = await this.repository.findAccount({accountNumber});
            var {balance} = await this.getBalance({accountNumber});
            const initiatorBalance = balance;
            if(initiatorBalance < amount){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "Insufficient balance"
                    );
            }
            var newTransaction = new TransactionRepository('debit', Transactions.withdraw, amount);
            var transaction = await newTransaction.createTransaction();
            var result = await this.repository.addTransaction({account: initiatorAccount, transaction}); 
            return result;

        }catch(err){
            if(err){
                throw err;
            }else{
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "With"
                  );
            }
        }
    }
    async transfer({initiatorAccountNumber, receiverAccountNumber, amount}){
        try{
            if(!receiverAccountNumber){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "Receiver account number missing"
                  );
            }

            if(receiverAccountNumber == initiatorAccountNumber){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "Action cannot be performed within same account"
                  );
            }
            var initiatorAccount = await this.repository.findAccount({accountNumber: initiatorAccountNumber});
            var toAccount = await this.repository.findAccount({accountNumber: receiverAccountNumber});
            var {balance} = await this.getBalance({accountNumber: initiatorAccountNumber});
            const initiatorBalance = balance;
            if(initiatorBalance < amount){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "Insufficient balance"
                  );
            }
            var newTransaction1 = new TransactionRepository('debit', Transactions.transferedTo, amount);
            var newTransaction2 = new TransactionRepository('credit', Transactions.transferedIn, amount);
            var transaction1 = await newTransaction1.createTransaction();
            var transaction2 = await newTransaction2.createTransaction();
            var result1 = await this.repository.addTransaction({account: initiatorAccount, transaction: transaction1}); 
            var result2 = await this.repository.addTransaction({account: toAccount, transaction: transaction2}); 
            return {
                result1,
                result2 
            }  
        }catch(err){
            if(err){
                throw err;
            }else{
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "With"
                  );
            }
        }
    }


    async getBalance({accountNumber}){
        try{

            const balance = await this.repository.getBalance({accountNumber});
            return balance

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Cannot get balance"
              );
        }
    }

    async queryAccountStatement({accountNumber}){
        try{

            const account = await this.repository.findAccount({accountNumber});
            const balance = await this.repository.getBalance({accountNumber});
            return {
                account,
                balance
            }

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Cannot get account statement"
              );
        }
    }




}


module.exports = AccountService;
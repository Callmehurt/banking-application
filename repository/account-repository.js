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

            const account = await AccountModel.findOne({accountNumber: accountNumber}).populate('customerId');
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

    async addTransaction({accountNumber, transaction}){
        try{

            const account = await this.findAccount({accountNumber});

            return account;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Data not found"
              );
        }
    }

}

module.exports = AccountRepository;
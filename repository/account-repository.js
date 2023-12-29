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

}

module.exports = AccountRepository;
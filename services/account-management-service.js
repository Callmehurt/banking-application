const {CustomerRepository, AccountRepository} = require('../repository')
const {APIError, STATUS_CODES} = require('../utils/app-errors');


class AccountManagementService{

    constructor(){
        this.customerRepository = new CustomerRepository();
        this.accountRepository = new AccountRepository();
    }

    async fetchAllCustomer(){
        try{
            const newList = [];
            const customers = await this.accountRepository.fetchAllAccounts();
            customers.map((obj) => {
                let newCustomer = obj.customerId._doc;
                newCustomer.accountNumber = obj.accountNumber;
                let {password, refreshToken, ...other} = newCustomer;
                newList.push(other);
            })

            return newList;
            
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to fetch customers"
              );
        }
    }


}

module.exports = AccountManagementService;
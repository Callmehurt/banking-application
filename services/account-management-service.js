const {CustomerRepository} = require('../repository')
const {APIError, STATUS_CODES} = require('../utils/app-errors');


class AccountManagementService{

    constructor(){
        this.customerRepository = new CustomerRepository();
    }

    async fetchAllCustomer(){
        try{
            
            const customers = await this.customerRepository.fetchCustomers();
            return customers;
            
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